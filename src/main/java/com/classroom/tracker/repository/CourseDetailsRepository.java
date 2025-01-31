package com.classroom.tracker.repository;

import com.classroom.tracker.entity.CourseDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CourseDetailsRepository extends JpaRepository<CourseDetails, Long> {
    // Find courses by teacher ID
    List<CourseDetails> findByTeacherId(Long teacherId);

    // Find active courses by teacher ID
    List<CourseDetails> findByTeacherIdAndIsCourseActive(Long teacherId, Boolean isCourseActive);

    // Find courses by teacher ID and course ID
    CourseDetails findByTeacherIdAndCourseId(Long teacherId, Long courseId);

    //fetch exam names by course ID
    @Query("SELECT c.exam1Label, c.exam2Label, c.exam3Label, c.exam4Label, c.exam5Label, " +
            "c.exam6Label, c.exam7Label, c.exam8Label, c.exam9Label, c.exam10Label " +
            "FROM CourseDetails c WHERE c.courseId = :courseId")
    List<Object[]> findExamLabelsByCourseId(@Param("courseId") Long courseId);

    //fetch maximum marks for each exam by course ID
    @Query("SELECT c.exam1MaxMarks, c.exam2MaxMarks, c.exam3MaxMarks, c.exam4MaxMarks, c.exam5MaxMarks, " +
            "c.exam6MaxMarks, c.exam7MaxMarks, c.exam8MaxMarks, c.exam9MaxMarks, c.exam10MaxMarks " +
            "FROM CourseDetails c WHERE c.courseId = :courseId")
    List<Object[]> findMaxMarksByCourseId(@Param("courseId") Long courseId);

    //fetch weightage of each exam by course ID
    @Query("SELECT c.exam1Weightage, c.exam2Weightage, c.exam3Weightage, c.exam4Weightage, c.exam5Weightage, " +
            "c.exam6Weightage, c.exam7Weightage, c.exam8Weightage, c.exam9Weightage, c.exam10Weightage " +
            "FROM CourseDetails c WHERE c.courseId = :courseId")
    List<Object[]> findWeightagesByCourseId(@Param("courseId") Long courseId);

}
