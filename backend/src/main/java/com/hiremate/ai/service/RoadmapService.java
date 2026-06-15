package com.hiremate.ai.service;

import com.hiremate.ai.dto.AppDto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RoadmapService {

    private final OpenAiService openAiService;

    public RoadmapResponse generateRoadmap(String careerGoal) {
        if (careerGoal == null || careerGoal.trim().isEmpty()) {
            careerGoal = "Software Engineer";
        }
        return openAiService.generateRoadmap(careerGoal);
    }
}
