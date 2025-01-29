package com.classroom.tracker.controller;

import com.classroom.tracker.entity.CourseDetails;
import com.classroom.tracker.service.CourseDetailsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/course-settings")
public class CourseDetailsController {
    private final CourseDetailsService courseDetailsService;

    public CourseDetailsController(CourseDetailsService courseDetailsService) {
        this.courseDetailsService = courseDetailsService;
    }

    // Fetch all courses for a specific teacher
    @GetMapping("/{teacherId}")
    public ResponseEntity<List<CourseDetails>> getAllCourses(@PathVariable Long teacherId) {
        List<CourseDetails> courses = courseDetailsService.getCoursesByTeacherId(teacherId);
        return ResponseEntity.ok(courses);
    }

    // Fetch course details using courseId for a specific teacher
    @GetMapping("/{teacherId}/{courseId}")
    public ResponseEntity<CourseDetails> getCourseDetails(@PathVariable Long teacherId, @PathVariable Long courseId) {
        CourseDetails courseDetails = courseDetailsService.getCourseDetailsByTeacherIdAndCourseId(teacherId, courseId);
        return ResponseEntity.ok(courseDetails);
    }

    // Fetch active courses for a specific teacher
    @GetMapping("/{teacherId}/active-courses")
    public ResponseEntity<List<CourseDetails>> getActiveCourses(@PathVariable Long teacherId) {
        List<CourseDetails> courses = courseDetailsService.getCoursesByTeacherIdAndIsCourseActive(teacherId, true);
        return ResponseEntity.ok(courses);
    }

    // Fetch total classes for a specific course
    @GetMapping("/{courseId}/total-classes")
    public ResponseEntity<Integer> getTotalClasses(@PathVariable Long courseId) {
        int totalClasses = courseDetailsService.getTotalClassesByCourseId(courseId);
        return ResponseEntity.ok(totalClasses);
    }

    // Update settings of a specific course (attendance, exams, etc.)
    @PutMapping("/{teacherId}/{courseId}/update")
    public ResponseEntity<CourseDetails> updateCourseSettings(
            @PathVariable Long teacherId,
            @PathVariable Long courseId,
            @RequestBody CourseDetails updatedDetails) {

        CourseDetails updatedCourse = courseDetailsService.updateCourseSettings(teacherId, courseId, updatedDetails);
        if (updatedCourse != null) {
            return ResponseEntity.ok(updatedCourse);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    //fetch total no. of exams for a specific course
    @GetMapping("/{courseId}/total-exams")
    public ResponseEntity<Integer> getNumOfExams(@PathVariable Long courseId) {
        int totalExams = courseDetailsService.getNumOfExamsByCourseId(courseId);
        return ResponseEntity.ok(totalExams);
    }

    // Fetch exam names for a specific course
    @GetMapping("/{courseId}/exam-names")
    public ResponseEntity<List<String>> getExamNames(@PathVariable Long courseId) {
        List<String> examNames = courseDetailsService.getExamNamesByCourseId(courseId);
        return ResponseEntity.ok(examNames);
    }

    //fetch max marks for a specific course
    @GetMapping("/{courseId}/max-marks")
    public ResponseEntity<List<Integer>> getMaxMarks(@PathVariable Long courseId) {
        List<Integer> maxMarks = courseDetailsService.getMaxMarksByCourseId(courseId);
        return ResponseEntity.ok(maxMarks);
    }

    //fetch weightage of each exam of a specific course
    @GetMapping("/{courseId}/weightages")
    public ResponseEntity<List<Double>> getWeightages(@PathVariable Long courseId) {
        List<Double> weightages = courseDetailsService.getWeightagesByCourseId(courseId);
        return ResponseEntity.ok(weightages);
    }



}

//TODO: remove this commented code

/*

    @PutMapping("/${teacherId}/${courseId}/update")
    public ResponseEntity<CourseDetails> updateCourseSettings(@PathVariable Long teacherId, @PathVariable Long courseId, @RequestBody CourseDetails courseDetails) {
        Optional<CourseDetails> existingCourseDetails = courseDetailsService.getCourseDetailsById(courseId);
        if (existingCourseDetails.isPresent()) {
            CourseDetails updatedCourseDetails = existingCourseDetails.get();
            updatedCourseDetails.setTotalClasses(courseDetails.getTotalClasses());
            updatedCourseDetails.setMinAttendance(courseDetails.getMinAttendance());
            updatedCourseDetails.setIsAttendanceEnabled(courseDetails.getIsAttendanceEnabled());
            updatedCourseDetails.setNumOfExams(courseDetails.getNumOfExams());
            // Update any other necessary fields
            courseDetailsService.saveCourseDetails(updatedCourseDetails);
            return ResponseEntity.ok(updatedCourseDetails);
        } else {
            return ResponseEntity.notFound().build();
        }
    }*/


