package com.classroom.tracker.service;

import com.classroom.tracker.entity.CourseDetails;
import com.classroom.tracker.repository.CourseDetailsRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CourseDetailsService {
    private final CourseDetailsRepository courseDetailsRepository;

    public CourseDetailsService(CourseDetailsRepository courseDetailsRepository) {
        this.courseDetailsRepository = courseDetailsRepository;
    }

    // Fetch all courses for a specific teacher
    public List<CourseDetails> getCoursesByTeacherId(Long teacherId) {
        return courseDetailsRepository.findByTeacherId(teacherId);
    }

    // Fetch the details for the selected course by a specific teacher
    public CourseDetails getCourseDetailsByTeacherIdAndCourseId(Long teacherId, Long courseId) {
        return courseDetailsRepository.findByTeacherIdAndCourseId(teacherId, courseId);
    }

/*  public List<Map<String, Object>> getAllCoursesByTeacherId(Long teacherId) {
        List<CourseDetails> byTeacherId = courseDetailsRepository.findByTeacherId(teacherId);

        return byTeacherId.stream()
                .map(course -> {
                    Map<String, Object> courseMap = new HashMap<>();
                    courseMap.put("courseId", course.getCourseId());
                    courseMap.put("course", course.getCourse());
                    return courseMap;
                })
                .collect(Collectors.toList());
    }
*/

    public CourseDetails updateCourseSettings(Long teacherId, Long courseId, CourseDetails updatedDetails) {
        // Verify that the course exists before updating
        CourseDetails existingCourse = courseDetailsRepository.findByTeacherIdAndCourseId(teacherId, courseId);

        if (existingCourse != null) {
            // Ensure the courseId and teacherId remain consistent
            updatedDetails.setCourseId(existingCourse.getCourseId());
            updatedDetails.setTeacherId(existingCourse.getTeacherId());

            // Save the updated record (overwrites the existing one)
            return courseDetailsRepository.save(updatedDetails);
        } else {
            // Handle the case where the course does not exist
            return null; // or throw an exception, if preferred
        }
    }





}
