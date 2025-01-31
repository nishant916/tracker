package com.classroom.tracker.repository;

import com.classroom.tracker.entity.StudentAttendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public interface StudentAttendanceRepository extends JpaRepository<StudentAttendance, Long>{
    // Fetch attendance records by course ID
    List<StudentAttendance> findByCourseId(Long courseId);

    // Find attendance by studentId and courseId
    StudentAttendance findByStudentIdAndCourseId(Long studentId, Long courseId);


}
