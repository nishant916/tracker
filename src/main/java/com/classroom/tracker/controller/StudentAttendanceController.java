package com.classroom.tracker.controller;

import com.classroom.tracker.entity.StudentAttendance;
import com.classroom.tracker.service.StudentAttendanceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/students-attendance")
public class StudentAttendanceController {
    private final StudentAttendanceService studentAttendanceService;

    public StudentAttendanceController(StudentAttendanceService studentAttendanceService) {
        this.studentAttendanceService = studentAttendanceService;
    }

    // Fetch student attendance details from courseId
    @GetMapping("/{courseId}")
    public ResponseEntity<List<StudentAttendance>> getAttendance(@PathVariable Long courseId) {
        List<StudentAttendance> attendance = studentAttendanceService.getAttendanceByCourseId(courseId);
        return ResponseEntity.ok(attendance);
    }
}