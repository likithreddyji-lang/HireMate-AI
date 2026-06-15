package com.hiremate.ai.controller;

import com.hiremate.ai.dto.AppDto.RoadmapRequest;
import com.hiremate.ai.dto.AppDto.RoadmapResponse;
import com.hiremate.ai.service.RoadmapService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/roadmaps")
@RequiredArgsConstructor
public class RoadmapController {

    private final RoadmapService roadmapService;

    @PostMapping("/generate")
    public ResponseEntity<RoadmapResponse> generateRoadmap(
            @RequestBody RoadmapRequest request
    ) {
        return ResponseEntity.ok(roadmapService.generateRoadmap(request.getCareerGoal()));
    }
}
