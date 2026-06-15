package com.hiremate.ai.service;

import com.hiremate.ai.dto.AppDto.*;
import com.hiremate.ai.entity.Evaluation;
import com.hiremate.ai.entity.InterviewSession;
import com.hiremate.ai.entity.Question;
import com.hiremate.ai.entity.User;
import com.hiremate.ai.exception.CustomException;
import com.hiremate.ai.repository.EvaluationRepository;
import com.hiremate.ai.repository.InterviewSessionRepository;
import com.hiremate.ai.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InterviewService {

    private final InterviewSessionRepository sessionRepository;
    private final QuestionRepository questionRepository;
    private final EvaluationRepository evaluationRepository;
    private final OpenAiService openAiService;

    @Transactional
    public InterviewSessionResponse generateSession(User user, String jobRole) {
        // Generate questions using AI / Mock
        List<String> questionTexts = openAiService.generateQuestions(jobRole);

        // Save session
        InterviewSession session = InterviewSession.builder()
                .user(user)
                .jobRole(jobRole)
                .createdAt(LocalDateTime.now())
                .build();
        session = sessionRepository.save(session);

        // Save Questions
        List<Question> questions = new ArrayList<>();
        for (String qText : questionTexts) {
            Question question = Question.builder()
                    .session(session)
                    .questionText(qText)
                    .build();
            questions.add(questionRepository.save(question));
        }
        session.setQuestions(questions);

        return mapToSessionResponse(session);
    }

    @Transactional(readOnly = true)
    public InterviewSessionResponse getSession(Long sessionId, User user) {
        InterviewSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new CustomException("Interview session not found", HttpStatus.NOT_FOUND));

        if (!session.getUser().getId().equals(user.getId())) {
            throw new CustomException("Access Denied", HttpStatus.FORBIDDEN);
        }

        return mapToSessionResponse(session);
    }

    @Transactional
    public EvaluationResponse submitAnswer(User user, AnswerSubmitRequest request) {
        Question question = questionRepository.findById(request.getQuestionId())
                .orElseThrow(() -> new CustomException("Question not found", HttpStatus.NOT_FOUND));

        if (!question.getSession().getUser().getId().equals(user.getId())) {
            throw new CustomException("Access Denied", HttpStatus.FORBIDDEN);
        }

        // Check if already evaluated
        Evaluation existing = evaluationRepository.findByQuestionId(request.getQuestionId()).orElse(null);
        if (existing != null) {
            evaluationRepository.delete(existing);
        }

        // Get AI Evaluation
        EvaluationResponse evalResponse = openAiService.evaluateAnswer(question.getQuestionText(), request.getAnswerText());

        // Save Evaluation
        Evaluation evaluation = Evaluation.builder()
                .question(question)
                .answerText(request.getAnswerText())
                .score(evalResponse.getScore())
                .strengths(evalResponse.getStrengths())
                .weaknesses(evalResponse.getWeaknesses())
                .suggestions(evalResponse.getSuggestions())
                .build();

        evaluation = evaluationRepository.save(evaluation);

        return EvaluationResponse.builder()
                .id(evaluation.getId())
                .questionId(question.getId())
                .score(evaluation.getScore())
                .strengths(evaluation.getStrengths())
                .weaknesses(evaluation.getWeaknesses())
                .suggestions(evaluation.getSuggestions())
                .build();
    }

    @Transactional(readOnly = true)
    public List<InterviewSessionResponse> getUserHistory(User user) {
        List<InterviewSession> sessions = sessionRepository.findByUserOrderByCreatedAtDesc(user);
        return sessions.stream()
                .map(this::mapToSessionResponse)
                .collect(Collectors.toList());
    }

    private InterviewSessionResponse mapToSessionResponse(InterviewSession session) {
        List<QuestionDto> qDtos = session.getQuestions().stream()
                .map(q -> {
                    Evaluation eval = q.getEvaluation();
                    EvaluationResponse evalDto = null;
                    if (eval != null) {
                        evalDto = EvaluationResponse.builder()
                                .id(eval.getId())
                                .questionId(q.getId())
                                .score(eval.getScore())
                                .strengths(eval.getStrengths())
                                .weaknesses(eval.getWeaknesses())
                                .suggestions(eval.getSuggestions())
                                .build();
                    }
                    return QuestionDto.builder()
                            .id(q.getId())
                            .questionText(q.getQuestionText())
                            .answered(eval != null)
                            .evaluation(evalDto)
                            .build();
                })
                .collect(Collectors.toList());

        return InterviewSessionResponse.builder()
                .id(session.getId())
                .jobRole(session.getJobRole())
                .createdAt(session.getCreatedAt())
                .questions(qDtos)
                .build();
    }
}
