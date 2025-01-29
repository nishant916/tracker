package com.classroom.tracker.controller;

import com.classroom.tracker.DTO.AttendanceStatsDTO;
import com.classroom.tracker.entity.StudentAttendance;
import com.classroom.tracker.service.AttendanceSummaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/attendance-summary")
public class AttendanceSummaryController {

    private final AttendanceSummaryService attendanceSummaryService;

    // Constructor injection
    @Autowired
    public AttendanceSummaryController(AttendanceSummaryService attendanceSummaryService) {
        this.attendanceSummaryService = attendanceSummaryService;
    }

    // Endpoint to get attendance stats for active courses
    @GetMapping("/{teacherId}")
    public ResponseEntity<List<AttendanceStatsDTO>> getAttendanceStats(@PathVariable Long teacherId) {
        List<AttendanceStatsDTO> attendanceStats = attendanceSummaryService.getAttendanceStatsForCourses(teacherId);
        return ResponseEntity.ok(attendanceStats);
    }

    @GetMapping("/students-below-minimum/{teacherId}/{courseId}/{minAttendance}")
    public ResponseEntity<List<Map<String, Object>>> getStudentsBelowMinimumAttendance(
            @PathVariable Long teacherId,
            @PathVariable Long courseId,
            @PathVariable Double minAttendance) {
        List<Map<String, Object>> lowAttendanceStudents = attendanceSummaryService.getStudentsBelowMinimumAttendance(teacherId, courseId, minAttendance);
        return ResponseEntity.ok(lowAttendanceStudents);
    }
}