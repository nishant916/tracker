package com.classroom.tracker.service;

import com.classroom.tracker.entity.StudentGrades;
import com.classroom.tracker.repository.StudentGradesRepository;
import org.springframework.stereotype.Service;
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
}
