package com.hiremate.ai.service;

import com.hiremate.ai.dto.AppDto.ProfileResponse;
import com.hiremate.ai.entity.Evaluation;
import com.hiremate.ai.entity.InterviewSession;
import com.hiremate.ai.entity.ResumeAnalysis;
import com.hiremate.ai.entity.User;
import com.hiremate.ai.repository.InterviewSessionRepository;
import com.hiremate.ai.repository.ResumeAnalysisRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final InterviewSessionRepository sessionRepository;
    private final ResumeAnalysisRepository resumeAnalysisRepository;

    @Transactional(readOnly = true)
    public ProfileResponse getUserProfileStats(User user) {
        List<InterviewSession> sessions = sessionRepository.findByUserOrderByCreatedAtDesc(user);
        List<ResumeAnalysis> resumes = resumeAnalysisRepository.findByUserOrderByCreatedAtDesc(user);

        int totalInterviews = sessions.size();
        int totalQuestionsAnswered = 0;
        double sumScore = 0;
        int evalCount = 0;

        for (InterviewSession session : sessions) {
            if (session.getQuestions() != null) {
                for (var question : session.getQuestions()) {
                    Evaluation eval = question.getEvaluation();
                    if (eval != null) {
                        totalQuestionsAnswered++;
                        sumScore += eval.getScore();
                        evalCount++;
                    }
                }
            }
        }

        double averageInterviewScore = evalCount > 0 ? (sumScore / evalCount) : 0.0;

        double sumAts = 0;
        int resumeCount = resumes.size();
        for (ResumeAnalysis res : resumes) {
            sumAts += res.getAtsScore();
        }
        double averageAtsScore = resumeCount > 0 ? (sumAts / resumeCount) : 0.0;

        return ProfileResponse.builder()
                .name(user.getName())
                .email(user.getEmail())
                .joinedDate(user.getJoinedDate())
                .totalInterviews(totalInterviews)
                .totalQuestionsAnswered(totalQuestionsAnswered)
                .averageInterviewScore(averageInterviewScore)
                .averageAtsScore(averageAtsScore)
                .resumesAnalyzed(resumeCount)
                .build();
    }
}
