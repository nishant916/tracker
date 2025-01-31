package com.classroom.tracker.controller;

import com.classroom.tracker.entity.StudentAttendance;
import com.classroom.tracker.service.StudentAttendanceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;

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


    @PatchMapping("/{courseId}/class/{classNumber}/update")
    public ResponseEntity<?> updateAttendance(
            @PathVariable Long courseId,
            @PathVariable int classNumber,
            @RequestBody List<Map<String, Object>> attendanceUpdates) {

        for (Map<String, Object> record : attendanceUpdates) {
            Long studentId = Long.parseLong(record.get("studentId").toString());
            String status = record.get("class" + classNumber).toString();

            studentAttendanceService.updateAttendance(studentId, courseId, classNumber, status);
        }

        return ResponseEntity.ok(Collections.singletonMap("message", "Attendance updated successfully"));

    }
}