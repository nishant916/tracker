package com.classroom.tracker.service;

import com.classroom.tracker.entity.StudentGrades;
import com.classroom.tracker.repository.StudentGradesRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.lang.reflect.Field;
import java.util.List;

@Service
public class StudentGradesService {
    private final StudentGradesRepository studentGradesRepository;

    public StudentGradesService(StudentGradesRepository studentGradesRepository) {
        this.studentGradesRepository = studentGradesRepository;
    }

    public List<StudentGrades> getGradesByCourseId(Long courseId) {
        return studentGradesRepository.findByCourseId(courseId);
    }

    @Transactional
    public void updateGrades(Long studentId, Long courseId, int examIndex, Integer newGrade) {
        StudentGrades studentGrade = studentGradesRepository.findByStudentIdAndCourseId(studentId, courseId)
                .orElseThrow(() -> new RuntimeException("Grade not found for student"));

        // Dynamically update the exam grade using reflection
        String examField = "exam" + (examIndex) + "Grades"; // exam1Grades, exam2Grades, etc.
        try {
            Field field = StudentGrades.class.getDeclaredField(examField);
            field.setAccessible(true); // Make private field accessible
            field.set(studentGrade, newGrade); // Set the new grade
        } catch (NoSuchFieldException | IllegalAccessException e) {
            throw new RuntimeException("Error updating grade field: " + e.getMessage());
        }

        studentGradesRepository.save(studentGrade); // Save the updated student grade
    }

}
