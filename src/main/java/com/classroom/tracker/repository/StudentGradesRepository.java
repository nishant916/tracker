package com.classroom.tracker.repository;

import com.classroom.tracker.entity.StudentGrades;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentGradesRepository extends JpaRepository<StudentGrades, Long>{

}
