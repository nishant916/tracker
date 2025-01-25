package com.classroom.tracker.repository;

import com.classroom.tracker.entity.CourseDetails;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CourseDetailsRepository extends JpaRepository<CourseDetails, Long> {
    // Find courses by teacher ID
    List<CourseDetails> findByTeacherId(Long teacherId);

    // Find courses by teacher ID and course ID
    CourseDetails findByTeacherIdAndCourseId(Long teacherId, Long courseId);

}
