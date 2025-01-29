package com.classroom.tracker.service;

import com.classroom.tracker.entity.StudentDetails;
import com.classroom.tracker.repository.StudentDetailsRepository;
import org.springframework.stereotype.Service;

import java.util.*;


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

    // Fetch student count by course name along with the course active status
    public List<Map<String, Object>> getStudentsPerCourseByTeacher(Long teacherId) {
        List<Object[]> results = studentDetailsRepository.countStudentsPerCourseByTeacher(teacherId);

        // Map the results into a list of maps for easier handling
        List<Map<String, Object>> studentCounts = new ArrayList<>();
        for (Object[] result : results) {
            Map<String, Object> courseData = new HashMap<>();
            courseData.put("course", result[0]);
            courseData.put("isCourseActive", result[1]);
            courseData.put("studentCount", result[2]);
            studentCounts.add(courseData);
        }
        return studentCounts;
    }

}
