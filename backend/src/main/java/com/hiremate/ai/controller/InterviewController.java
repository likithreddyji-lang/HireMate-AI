package com.hiremate.ai.controller;

import com.hiremate.ai.dto.AppDto.*;
import com.hiremate.ai.entity.User;
import com.hiremate.ai.service.InterviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/interviews")
@RequiredArgsConstructor
public class InterviewController {

    private final InterviewService interviewService;

    @PostMapping("/generate")
    public ResponseEntity<InterviewSessionResponse> generateSession(
            @RequestBody InterviewGenerateRequest request,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(interviewService.generateSession(user, request.getJobRole()));
    }

    @GetMapping("/{sessionId}")
    public ResponseEntity<InterviewSessionResponse> getSession(
            @PathVariable Long sessionId,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(interviewService.getSession(sessionId, user));
    }

    @PostMapping("/evaluate")
    public ResponseEntity<EvaluationResponse> submitAnswer(
            @RequestBody AnswerSubmitRequest request,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(interviewService.submitAnswer(user, request));
    }

    @GetMapping("/history")
    public ResponseEntity<List<InterviewSessionResponse>> getHistory(
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(interviewService.getUserHistory(user));
    }
}
