package com.hiremate.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

public class AppDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class InterviewGenerateRequest {
        private String jobRole;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class QuestionDto {
        private Long id;
        private String questionText;
        private boolean answered;
        private EvaluationResponse evaluation;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class InterviewSessionResponse {
        private Long id;
        private String jobRole;
        private LocalDateTime createdAt;
        private List<QuestionDto> questions;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AnswerSubmitRequest {
        private Long questionId;
        private String answerText;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EvaluationResponse {
        private Long id;
        private Long questionId;
        private Integer score;
        private String strengths;
        private String weaknesses;
        private String suggestions;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ResumeAnalysisResponse {
        private Long id;
        private String filename;
        private Integer atsScore;
        private List<String> missingSkills;
        private List<String> suggestions;
        private LocalDateTime createdAt;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RoadmapRequest {
        private String careerGoal;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RoadmapResponse {
        private String careerGoal;
        private List<WeeklyRoadmapItem> weeks;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WeeklyRoadmapItem {
        private Integer weekNumber;
        private String topic;
        private List<String> objectives;
        private List<String> topicsToCover;
        private String practicalExercise;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProfileResponse {
        private String name;
        private String email;
        private LocalDateTime joinedDate;
        private Integer totalInterviews;
        private Integer totalQuestionsAnswered;
        private Double averageInterviewScore;
        private Double averageAtsScore;
        private Integer resumesAnalyzed;
    }
}
