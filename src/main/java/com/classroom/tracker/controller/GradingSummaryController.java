package com.classroom.tracker.controller;

import com.classroom.tracker.DTO.GradingStats2DTO;
import com.classroom.tracker.DTO.GradingStatsDTO;
import com.classroom.tracker.service.GradingSummaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/grading-summary")
public class GradingSummaryController {
    private final GradingSummaryService gradingSummaryService;

    @Autowired
    public GradingSummaryController(GradingSummaryService gradingSummaryService) {
        this.gradingSummaryService = gradingSummaryService;
    }

    // Endpoint to get grading stats for active courses
    @GetMapping("/{teacherId}")
    public ResponseEntity<List<GradingStatsDTO>> getGradingStats1(@PathVariable Long teacherId) {
        List<GradingStatsDTO> gradingStats = gradingSummaryService.getGradingStatsForCourses(teacherId);
        return ResponseEntity.ok(gradingStats);
    }

    // Endpoint to get grading stats for completed courses
    @GetMapping("/completed/{teacherId}")
    public ResponseEntity<List<GradingStats2DTO>> getGradingStats2(@PathVariable Long teacherId) {
        List<GradingStats2DTO> gradingStats = gradingSummaryService.getGradingStatsForCompletedCourses(teacherId);
        return ResponseEntity.ok(gradingStats);
    }

}
