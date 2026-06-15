package com.hiremate.ai.controller;

import com.hiremate.ai.dto.AppDto.ProfileResponse;
import com.hiremate.ai.entity.User;
import com.hiremate.ai.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping("/stats")
    public ResponseEntity<ProfileResponse> getProfileStats(
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(profileService.getUserProfileStats(user));
    }
}
