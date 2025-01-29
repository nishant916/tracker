package com.classroom.tracker.controller;

import com.classroom.tracker.entity.StudentGrades;
import com.classroom.tracker.service.StudentGradesService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequestMapping("/api/students-grades")
@RestController
public class StudentGradesController {
    private final StudentGradesService studentGradesService;

    public StudentGradesController(StudentGradesService studentGradesService) {
        this.studentGradesService = studentGradesService;
    }

    //fetch grades from courseId
    @GetMapping("/{courseId}")
    public ResponseEntity<List<StudentGrades>> getGrades(@PathVariable Long courseId) {
        List<StudentGrades> grades = studentGradesService.getGradesByCourseId(courseId);
        return ResponseEntity.ok(grades);
    }

}
