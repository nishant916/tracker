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

    @GetMapping("/{teacherId}/{courseId}")
    public ResponseEntity<CourseDetails> getCourseDetails(@PathVariable Long teacherId, @PathVariable Long courseId) {
        CourseDetails courseDetails = courseDetailsService.getCourseDetailsByTeacherIdAndCourseId(teacherId, courseId);
        return ResponseEntity.ok(courseDetails);
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
}

