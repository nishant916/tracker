package com.classroom.tracker.repository;

import com.classroom.tracker.entity.StudentDetails;
import com.classroom.tracker.entity.CourseDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentDetailsRepository extends JpaRepository<StudentDetails, Long>{
    List<StudentDetails> findByCourseId(Long courseId);

    // Query to return count of students by course name
    @Query("SELECT c.course, c.isCourseActive, COUNT(s.id) AS studentCount " +
            "FROM CourseDetails c " +
            "JOIN StudentDetails s ON c.courseId = s.courseId " +
            "WHERE c.teacherId = :teacherId " +
            "GROUP BY c.course, c.isCourseActive")
    List<Object[]> countStudentsPerCourseByTeacher(@Param("teacherId") Long teacherId);

}
