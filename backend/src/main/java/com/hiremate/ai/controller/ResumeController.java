package com.hiremate.ai.controller;

import com.hiremate.ai.dto.AppDto.ResumeAnalysisResponse;
import com.hiremate.ai.entity.User;
import com.hiremate.ai.service.ResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/resumes")
@RequiredArgsConstructor
public class ResumeController {

    private final ResumeService resumeService;

    @PostMapping("/analyze")
    public ResponseEntity<ResumeAnalysisResponse> analyzeResume(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(resumeService.analyzeResume(file, user));
    }

    @GetMapping("/history")
    public ResponseEntity<List<ResumeAnalysisResponse>> getHistory(
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(resumeService.getUserResumes(user));
    }
}
