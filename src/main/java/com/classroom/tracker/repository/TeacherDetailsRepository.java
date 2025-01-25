package com.classroom.tracker.repository;

import com.classroom.tracker.entity.TeacherDetails;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TeacherDetailsRepository extends JpaRepository<TeacherDetails, Long> {
    // Find teacher by username
    TeacherDetails findByUsername(String username);
}
