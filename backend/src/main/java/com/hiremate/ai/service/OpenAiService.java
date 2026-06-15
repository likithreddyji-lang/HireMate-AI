package com.hiremate.ai.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hiremate.ai.dto.AppDto.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class OpenAiService {

    @Value("${openai.key}")
    private String apiKey;

    @Value("${openai.url}")
    private String apiUrl;

    @Value("${openai.model}")
    private String apiModel;

    private final ObjectMapper objectMapper;
    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    /**
     * Generates 10 interview questions based on the job role.
     */
    public List<String> generateQuestions(String jobRole) {
        if (isMockMode()) {
            return generateMockQuestions(jobRole);
        }

        String prompt = String.format(
                "Generate exactly 10 interview questions for a candidate applying for the role of '%s'. " +
                "The questions should range from basic concepts to advanced scenarios. " +
                "You must return a JSON object with a single key 'questions' containing a list of strings. " +
                "Do not include any formatting or other keys. Example format: { \"questions\": [ \"Question 1\", \"Question 2\", ... ] }",
                jobRole
        );

        try {
            String rawJson = callOpenAi(prompt);
            JsonNode root = objectMapper.readTree(rawJson);
            JsonNode questionsNode = root.get("questions");
            if (questionsNode != null && questionsNode.isArray()) {
                List<String> questions = new ArrayList<>();
                questionsNode.forEach(node -> questions.add(node.asText()));
                if (questions.size() == 10) {
                    return questions;
                }
            }
            log.warn("OpenAI response did not contain exactly 10 questions. Using fallback.");
        } catch (Exception e) {
            log.error("Failed to generate questions using OpenAI API: {}", e.getMessage());
        }

        return generateMockQuestions(jobRole);
    }

    /**
     * Evaluates a candidate's answer to a specific question.
     */
    public EvaluationResponse evaluateAnswer(String question, String answer) {
        if (isMockMode() || answer == null || answer.trim().isEmpty()) {
            return generateMockEvaluation(question, answer);
        }

        String prompt = String.format(
                "As an expert technical interviewer, evaluate the candidate's response to the question. " +
                "Question: \"%s\"\n" +
                "Candidate's Answer: \"%s\"\n\n" +
                "You must return a JSON object with exactly the following keys: " +
                "- 'score': an integer from 0 to 100. " +
                "- 'strengths': a summary of what the candidate did well. " +
                "- 'weaknesses': a summary of what was missing or incorrect. " +
                "- 'suggestions': actionable advice on how to improve the response.",
                question, answer
        );

        try {
            String rawJson = callOpenAi(prompt);
            JsonNode root = objectMapper.readTree(rawJson);
            return EvaluationResponse.builder()
                    .score(root.path("score").asInt(50))
                    .strengths(root.path("strengths").asText("The answer provided standard industry terms."))
                    .weaknesses(root.path("weaknesses").asText("Lacks depth and structural examples."))
                    .suggestions(root.path("suggestions").asText("Try adding examples from your past projects."))
                    .build();
        } catch (Exception e) {
            log.error("Failed to evaluate answer using OpenAI API: {}", e.getMessage());
        }

        return generateMockEvaluation(question, answer);
    }

    /**
     * Analyzes resume text for ATS score, missing skills, and suggestions.
     */
    public ResumeAnalysisResponse analyzeResume(String filename, String resumeText) {
        if (isMockMode() || resumeText == null || resumeText.trim().isEmpty()) {
            return generateMockResumeAnalysis(filename, resumeText);
        }

        String prompt = String.format(
                "You are an ATS (Applicant Tracking System) optimizer and professional recruiter. " +
                "Analyze the following resume text and provide a helpful ATS scorecard.\n" +
                "Resume Content:\n%s\n\n" +
                "Return a JSON object with these keys: " +
                "- 'atsScore': integer between 0 and 100. " +
                "- 'missingSkills': JSON array of string names representing common industry skills missing in the text. " +
                "- 'suggestions': JSON array of bullet points suggesting resume improvements.",
                resumeText
        );

        try {
            String rawJson = callOpenAi(prompt);
            JsonNode root = objectMapper.readTree(rawJson);
            List<String> missingSkills = objectMapper.convertValue(root.path("missingSkills"), new TypeReference<List<String>>() {});
            List<String> suggestions = objectMapper.convertValue(root.path("suggestions"), new TypeReference<List<String>>() {});

            return ResumeAnalysisResponse.builder()
                    .filename(filename)
                    .atsScore(root.path("atsScore").asInt(70))
                    .missingSkills(missingSkills != null ? missingSkills : List.of("Docker", "CI/CD Pipelines"))
                    .suggestions(suggestions != null ? suggestions : List.of("Quantify your achievements with numbers.", "Add a profile summary."))
                    .build();
        } catch (Exception e) {
            log.error("Failed to analyze resume using OpenAI API: {}", e.getMessage());
        }

        return generateMockResumeAnalysis(filename, resumeText);
    }

    /**
     * Generates a weekly roadmap based on the career goal.
     */
    public RoadmapResponse generateRoadmap(String careerGoal) {
        if (isMockMode()) {
            return generateMockRoadmap(careerGoal);
        }

        String prompt = String.format(
                "Create a weekly career roadmap to help a professional become a '%s'. " +
                "Return a structured learning path with exactly 4 weeks. " +
                "Return a JSON object with this key structure: " +
                "{ " +
                "  \"careerGoal\": \"%s\", " +
                "  \"weeks\": [ " +
                "    { " +
                "      \"weekNumber\": 1, " +
                "      \"topic\": \"Week 1 Main Topic\", " +
                "      \"objectives\": [ \"Objective 1\", \"Objective 2\" ], " +
                "      \"topicsToCover\": [ \"Subtopic A\", \"Subtopic B\" ], " +
                "      \"practicalExercise\": \"Short description of hands-on project/exercise\" " +
                "    }, " +
                "    ... up to Week 4 " +
                "  ] " +
                "}",
                careerGoal, careerGoal
        );

        try {
            String rawJson = callOpenAi(prompt);
            JsonNode root = objectMapper.readTree(rawJson);
            List<WeeklyRoadmapItem> weeks = objectMapper.convertValue(root.path("weeks"), new TypeReference<List<WeeklyRoadmapItem>>() {});
            if (weeks != null && !weeks.isEmpty()) {
                return RoadmapResponse.builder()
                        .careerGoal(careerGoal)
                        .weeks(weeks)
                        .build();
            }
        } catch (Exception e) {
            log.error("Failed to generate career roadmap using OpenAI API: {}", e.getMessage());
        }

        return generateMockRoadmap(careerGoal);
    }

    private boolean isMockMode() {
        return apiKey == null || apiKey.trim().isEmpty() || "mock".equalsIgnoreCase(apiKey.trim());
    }

    private String callOpenAi(String userPrompt) throws Exception {
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", apiModel);
        
        List<Map<String, String>> messages = new ArrayList<>();
        messages.add(Map.of("role", "system", "content", "You are an expert career and technical interview assistant. You speak ONLY JSON. You never wrap your outputs in markdown ```json blocks. You reply with a raw JSON block directly."));
        messages.add(Map.of("role", "user", "content", userPrompt));
        requestBody.put("messages", messages);
        requestBody.put("response_format", Map.of("type", "json_object"));
        requestBody.put("temperature", 0.7);

        String jsonPayload = objectMapper.writeValueAsString(requestBody);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(apiUrl))
                .header("Content-Type", "application/json")
                .header("Authorization", "Bearer " + apiKey)
                .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            throw new RuntimeException("OpenAI API returned non-OK status: " + response.statusCode() + " " + response.body());
        }

        JsonNode responseNode = objectMapper.readTree(response.body());
        return responseNode.path("choices").path(0).path("message").path("content").asText().trim();
    }

    // --- MOCK FALLBACKS ---

    private List<String> generateMockQuestions(String jobRole) {
        List<String> list = new ArrayList<>();
        String roleLower = jobRole.toLowerCase();
        if (roleLower.contains("react") || roleLower.contains("frontend") || roleLower.contains("web")) {
            list.add("Explain the difference between the Virtual DOM and the real DOM in React.");
            list.add("What are React Hooks? Explain useState, useEffect, and custom hooks.");
            list.add("Explain how state reconciliation works inside React.");
            list.add("What is the Context API, and how does it compare to state libraries like Redux?");
            list.add("How do you optimize rendering performance in a large-scale React app?");
            list.add("Explain SSR (Server-Side Rendering) vs CSR (Client-Side Rendering) in frameworks like Next.js.");
            list.add("What is the purpose of keys in React lists, and why shouldn't indexes be used as keys?");
            list.add("How does code-splitting work in React (e.g., React.lazy, Suspense)?");
            list.add("Describe React's handling of synthetic events and state batching.");
            list.add("How would you manage application-wide security/auth tokens in frontend stores?");
        } else if (roleLower.contains("java") || roleLower.contains("spring") || roleLower.contains("backend")) {
            list.add("What are Virtual Threads in Java 21, and how do they differ from Platform Threads?");
            list.add("Explain Dependency Injection and the inversion of control (IoC) container in Spring Boot.");
            list.add("What is the difference between Hibernate and Spring Data JPA?");
            list.add("How does JVM Garbage Collection work, and what are G1 and ZGC garbage collectors?");
            list.add("Describe the Spring Security Filter Chain and how JWT stateless auth fits in.");
            list.add("What are record classes in modern Java, and what benefits do they provide?");
            list.add("Explain the Java Stream API and how intermediate operations differ from terminal operations.");
            list.add("How does Spring handle @Transactional annotations and rollback strategies?");
            list.add("What are REST API design best practices, and how do you version API resources?");
            list.add("Explain Spring Boot auto-configuration and the role of @EnableAutoConfiguration.");
        } else {
            list.add("Explain the differences between REST and GraphQL architectures.");
            list.add("How do you choose between a SQL database (MySQL) and a NoSQL database (MongoDB)?");
            list.add("How do you design a scalable microservices structure with reliable communications?");
            list.add("What is a CI/CD pipeline, and what components should it contain?");
            list.add("Explain database index structures and how they optimize search queries.");
            list.add("What is MVC architecture, and how does it split concerns?");
            list.add("Explain SOLID design principles with concrete architectural examples.");
            list.add("How do you handle global exception mapping and secure logs in a cloud service?");
            list.add("Explain Git merge vs Git rebase strategies in collaborative environments.");
            list.add("What are the advantages of containerization (Docker) in developer operations?");
        }
        return list;
    }

    private EvaluationResponse generateMockEvaluation(String question, String answer) {
        if (answer == null || answer.trim().isEmpty()) {
            return EvaluationResponse.builder()
                    .score(0)
                    .strengths("None.")
                    .weaknesses("No answer was provided by the candidate.")
                    .suggestions("Type a response detailing technical concepts, syntax, or architectural structures.")
                    .build();
        }

        int score;
        int len = answer.trim().length();
        String strengths;
        String weaknesses;
        String suggestions;

        if (len < 20) {
            score = 35;
            strengths = "Answered the question in a brief manner.";
            weaknesses = "The answer is extremely short and fails to define core concepts, frameworks, or code architecture.";
            suggestions = "Elaborate by defining key terminology and giving a brief example of how you apply this in your workspace.";
        } else if (len < 80) {
            score = 65;
            strengths = "Identified the primary concept correctly and used relevant technical terminology.";
            weaknesses = "Lacks detailed runtime mechanisms, design patterns, or real-world application references.";
            suggestions = "Try structuring your answer with the STAR method (Situation, Task, Action, Result) or include code syntax references.";
        } else {
            score = 88;
            strengths = "Provided a comprehensive explanation with clear architecture insights, terminology, and sound technical depth.";
            weaknesses = "Could further expand on edge cases, scaling limitations, or performance trade-offs under high workloads.";
            suggestions = "Discuss how this configuration or design behaves under high traffic or memory constraints to secure a perfect score.";
        }

        return EvaluationResponse.builder()
                .score(score)
                .strengths(strengths)
                .weaknesses(weaknesses)
                .suggestions(suggestions)
                .build();
    }

    private ResumeAnalysisResponse generateMockResumeAnalysis(String filename, String resumeText) {
        int score = 65;
        List<String> missing = new ArrayList<>();
        List<String> suggestions = new ArrayList<>();

        String textLower = resumeText != null ? resumeText.toLowerCase() : "";

        if (textLower.contains("react") || textLower.contains("javascript")) {
            score += 10;
        } else {
            missing.add("React / Modern JS Frameworks");
        }

        if (textLower.contains("java") || textLower.contains("spring")) {
            score += 10;
        } else {
            missing.add("Java 21 / Spring Boot Framework");
        }

        if (textLower.contains("mysql") || textLower.contains("sql") || textLower.contains("database")) {
            score += 5;
        } else {
            missing.add("SQL / Relational Databases");
        }

        if (textLower.contains("docker") || textLower.contains("kubernetes") || textLower.contains("aws")) {
            score += 5;
        } else {
            missing.add("Cloud Deployments & Containerization (Docker, AWS)");
        }

        if (!textLower.contains("ci/cd") && !textLower.contains("jenkins") && !textLower.contains("github actions")) {
            missing.add("CI/CD Automation Pipelines");
        }

        score = Math.min(score, 98);

        suggestions.add("Incorporate active action verbs at the beginning of each project description bullet point (e.g., Developed, Accelerated, Architected).");
        suggestions.add("Add measurable key results or metrics showing how your contributions improved page performance or system latency (e.g., 'reduced API response times by 30%').");
        suggestions.add("Ensure your contact details (LinkedIn, GitHub, Portfolio) are clear and placed at the top header block.");
        suggestions.add("Re-format section headers to be easily read by ATS parsers (avoid non-standard text styling and complex double-column layouts).");

        return ResumeAnalysisResponse.builder()
                .filename(filename)
                .atsScore(score)
                .missingSkills(missing)
                .suggestions(suggestions)
                .build();
    }

    private RoadmapResponse generateMockRoadmap(String careerGoal) {
        List<WeeklyRoadmapItem> weeks = new ArrayList<>();

        weeks.add(WeeklyRoadmapItem.builder()
                .weekNumber(1)
                .topic("Foundations & System Architecture of " + careerGoal)
                .objectives(List.of("Understand core protocols and syntax standards", "Configure local developer environments and CLI utilities"))
                .topicsToCover(List.of("Development Environment Setup", "Syntactical Basics and Compiler rules", "Version Control Integrations"))
                .practicalExercise("Build a simple CLI application using standard inputs and config schemas.")
                .build());

        weeks.add(WeeklyRoadmapItem.builder()
                .weekNumber(2)
                .topic("Intermediary Concepts & API Designs")
                .objectives(List.of("Design RESTful database entities and connection pools", "Implement error handlers and request parsing validation"))
                .topicsToCover(List.of("REST API specifications", "Databases & ORM mappings", "Dependency injection and scoping"))
                .practicalExercise("Create an API that performs CRUD operations, containing structured validation filters.")
                .build());

        weeks.add(WeeklyRoadmapItem.builder()
                .weekNumber(3)
                .topic("Advanced Framework Integrations & Identity Services")
                .objectives(List.of("Implement OAuth / JWT stateless security layers", "Design cache engines to decrease queries to disk"))
                .topicsToCover(List.of("JWT Authentication & Filters", "Redis cache engines", "Multi-thread tasks and concurrency"))
                .practicalExercise("Build an API authentication flow securing routes with JWT tokens.")
                .build());

        weeks.add(WeeklyRoadmapItem.builder()
                .weekNumber(4)
                .topic("Cloud Deployment, Containerization & CI/CD")
                .objectives(List.of("Bundle local apps into Docker container shapes", "Deploy pipelines to AWS / cloud nodes with monitoring logs"))
                .topicsToCover(List.of("Docker files & configurations", "GitHub Actions CI/CD workflows", "Server hosting & log diagnostics"))
                .practicalExercise("Write a GitHub Action script that automatically builds and deploys your container to a public staging server.")
                .build());

        return RoadmapResponse.builder()
                .careerGoal(careerGoal)
                .weeks(weeks)
                .build();
    }
}
