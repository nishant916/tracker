package com.classroom.tracker.controller;

import com.classroom.tracker.entity.StudentGrades;
import com.classroom.tracker.service.StudentGradesService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;

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

    @PatchMapping("/{courseId}/exam/{examIndex}/update")
    public ResponseEntity<?> updateGrades(
            @PathVariable Long courseId,
            @PathVariable int examIndex,
            @RequestBody List<Map<String, Object>> gradeUpdates) {
        for (Map<String, Object> record : gradeUpdates) {
            // Get the student ID from the record
            Long studentId = Long.parseLong(record.get("studentId").toString());

            // Construct the dynamic key based on examIndex (e.g., exam1Grades, exam2Grades, etc.)
            String gradeKey = "exam" + examIndex + "Grades";
            Integer newGrade = null;

            // Check if the grade exists for the key (in case it's null or missing)
            if (record.containsKey(gradeKey)) {
                newGrade = Integer.parseInt(record.get(gradeKey).toString());
            }

            // Proceed only if the newGrade is not null (i.e., grade exists)
            if (newGrade != null) {
                studentGradesService.updateGrades(studentId, courseId, examIndex, newGrade);
            } else {
                // Handle case when grade is missing or invalid if necessary
                System.out.println("Missing grade for student ID: " + studentId);
            }
        }
        return ResponseEntity.ok(Collections.singletonMap("message", "Grades updated successfully"));
    }

}
