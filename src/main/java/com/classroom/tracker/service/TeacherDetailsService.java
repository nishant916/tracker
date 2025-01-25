package com.classroom.tracker.service;

import com.classroom.tracker.entity.TeacherDetails;
import com.classroom.tracker.repository.TeacherDetailsRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class TeacherDetailsService {
    private final TeacherDetailsRepository teacherDetailsRepository;

    public TeacherDetailsService(TeacherDetailsRepository teacherDetailsRepository) {
            this.teacherDetailsRepository = teacherDetailsRepository;
    }
    public Optional<TeacherDetails> authenticateTeacher(String username, String password) {
        // Fetch the teacher from the database using the username
        TeacherDetails teacher = teacherDetailsRepository.findByUsername(username);

        // If the teacher exists and the password matches
        if (teacher != null && teacher.getPassword().equals(password)){
            return Optional.of(teacher); // Authentication successful
        }
        return Optional.empty();
    }
}
