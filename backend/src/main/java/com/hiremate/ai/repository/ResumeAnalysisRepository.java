package com.hiremate.ai.repository;

import com.hiremate.ai.entity.ResumeAnalysis;
import com.hiremate.ai.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResumeAnalysisRepository extends JpaRepository<ResumeAnalysis, Long> {
    List<ResumeAnalysis> findByUserOrderByCreatedAtDesc(User user);
    List<ResumeAnalysis> findByUserIdOrderByCreatedAtDesc(Long userId);
}
