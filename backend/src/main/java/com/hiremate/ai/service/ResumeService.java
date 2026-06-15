package com.hiremate.ai.service;

import com.hiremate.ai.dto.AppDto.*;
import com.hiremate.ai.entity.ResumeAnalysis;
import com.hiremate.ai.entity.User;
import com.hiremate.ai.exception.CustomException;
import com.hiremate.ai.repository.ResumeAnalysisRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ResumeService {

    private final ResumeAnalysisRepository resumeAnalysisRepository;
    private final OpenAiService openAiService;

    @Transactional
    public ResumeAnalysisResponse analyzeResume(MultipartFile file, User user) {
        if (file.isEmpty()) {
            throw new CustomException("Uploaded file is empty", HttpStatus.BAD_REQUEST);
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.equalsIgnoreCase("application/pdf")) {
            throw new CustomException("Only PDF resumes are supported", HttpStatus.BAD_REQUEST);
        }

        String extractedText;
        try {
            extractedText = extractTextFromPdf(file);
        } catch (IOException e) {
            log.error("Failed to parse PDF resume: {}", e.getMessage());
            throw new CustomException("Failed to parse PDF document. Ensure the file is not corrupted.", HttpStatus.BAD_REQUEST);
        }

        // Get analysis from AI/Mock
        ResumeAnalysisResponse aiResponse = openAiService.analyzeResume(file.getOriginalFilename(), extractedText);

        // Serialize missing skills and suggestions as simple newline-separated texts
        String missingSkillsStr = String.join("\n", aiResponse.getMissingSkills());
        String suggestionsStr = String.join("\n", aiResponse.getSuggestions());

        // Save resume analysis
        ResumeAnalysis analysis = ResumeAnalysis.builder()
                .user(user)
                .filename(file.getOriginalFilename())
                .atsScore(aiResponse.getAtsScore())
                .missingSkills(missingSkillsStr)
                .suggestions(suggestionsStr)
                .createdAt(LocalDateTime.now())
                .build();

        analysis = resumeAnalysisRepository.save(analysis);

        return mapToResponse(analysis);
    }

    public List<ResumeAnalysisResponse> getUserResumes(User user) {
        List<ResumeAnalysis> analyses = resumeAnalysisRepository.findByUserOrderByCreatedAtDesc(user);
        return analyses.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private String extractTextFromPdf(MultipartFile file) throws IOException {
        try (PDDocument document = Loader.loadPDF(file.getBytes())) {
            PDFTextStripper stripper = new PDFTextStripper();
            String text = stripper.getText(document);
            if (text == null || text.trim().isEmpty()) {
                throw new IOException("No text content found in PDF.");
            }
            return text;
        }
    }

    private ResumeAnalysisResponse mapToResponse(ResumeAnalysis entity) {
        List<String> missingSkillsList = entity.getMissingSkills() != null && !entity.getMissingSkills().isEmpty()
                ? Arrays.asList(entity.getMissingSkills().split("\n"))
                : List.of();

        List<String> suggestionsList = entity.getSuggestions() != null && !entity.getSuggestions().isEmpty()
                ? Arrays.asList(entity.getSuggestions().split("\n"))
                : List.of();

        return ResumeAnalysisResponse.builder()
                .id(entity.getId())
                .filename(entity.getFilename())
                .atsScore(entity.getAtsScore())
                .missingSkills(missingSkillsList)
                .suggestions(suggestionsList)
                .createdAt(entity.getCreatedAt())
                .build();
    }
}
