package com.classroom.tracker.repository;

import com.classroom.tracker.entity.StudentAttendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentAttendanceRepository extends JpaRepository<StudentAttendance, Long>{
}
