package com.classroom.tracker.controller;

import com.classroom.tracker.entity.StudentDetails;
import com.classroom.tracker.service.StudentDetailsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    private final StudentDetailsService studentDetailsService;

    public AttendanceController(StudentDetailsService studentDetailsService) {
        this.studentDetailsService = studentDetailsService;
    }

    // Fetch students for a selected course
    @GetMapping("/{courseId}/students")
    public ResponseEntity<List<StudentDetails>> getStudentsByCourseId(@PathVariable Long courseId) {
        List<StudentDetails> students = studentDetailsService.getStudentsByCourseId(courseId);
        return ResponseEntity.ok(students);
    }

    // Fetch student count for each course
    @GetMapping("/studentCounts/{teacherId}")
    public ResponseEntity<List<Map<String, Object>>> getStudentCountsByTeacher(@PathVariable Long teacherId) {
        List<Map<String, Object>> studentCounts = studentDetailsService.getStudentsPerCourseByTeacher(teacherId);
        return ResponseEntity.ok(studentCounts);
    }
}
