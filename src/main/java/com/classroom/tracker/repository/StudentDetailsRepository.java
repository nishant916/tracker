package com.classroom.tracker.repository;

import com.classroom.tracker.entity.StudentDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentDetailsRepository extends JpaRepository<StudentDetails, Long>{
    List<StudentDetails> findByCourseId(Long courseId);
}
