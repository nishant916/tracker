package com.classroom.tracker.service;

import com.classroom.tracker.entity.StudentDetails;
import com.classroom.tracker.repository.StudentDetailsRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;


@Service
public class StudentDetailsService {
    private final StudentDetailsRepository studentDetailsRepository;

    public StudentDetailsService(StudentDetailsRepository studentDetailsRepository) {
        this.studentDetailsRepository = studentDetailsRepository;
    }

    // Fetch students by course ID
    public List<StudentDetails> getStudentsByCourseId(Long courseId) {
        return studentDetailsRepository.findByCourseId(courseId);
    }


}
