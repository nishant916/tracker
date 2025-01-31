package com.classroom.tracker.repository;

import com.classroom.tracker.entity.StudentGrades;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface StudentGradesRepository extends JpaRepository<StudentGrades, Long>{
    //find grades by courseId
    List<StudentGrades> findByCourseId(Long courseId);

    // Find a student's grade for a particular course
    Optional<StudentGrades> findByStudentIdAndCourseId(Long studentId, Long courseId);

}
