package com.classroom.tracker.service;

import com.classroom.tracker.entity.CourseDetails;
import com.classroom.tracker.repository.CourseDetailsRepository;
import org.springframework.stereotype.Service;

import java.util.*;
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

    // Fetch active courses for a specific teacher
    public List<CourseDetails> getCoursesByTeacherIdAndIsCourseActive(Long teacherId, Boolean isCourseActive) {
        return courseDetailsRepository.findByTeacherIdAndIsCourseActive(teacherId, isCourseActive);
    }

    // Fetch total class for a specific course
    public int getTotalClassesByCourseId(Long courseId) {
        return courseDetailsRepository.findById(courseId).get().getTotalClasses();
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

    //fetch total exams for a specific course
    public int getNumOfExamsByCourseId(Long courseId) {
        return courseDetailsRepository.findById(courseId).get().getNumOfExams();
    }

    // Fetch exam names for a specific course
    public List<String> getExamNamesByCourseId(Long courseId) {
        List<Object[]> examLabels = courseDetailsRepository.findExamLabelsByCourseId(courseId);

        if (!examLabels.isEmpty()) {
            // Extract the first (and only) row from the result
            Object[] row = examLabels.get(0);
            return Arrays.stream(row)
                    .filter(label -> label != null)  // Filter out null labels
                    .map(Object::toString)          // Convert to string
                    .collect(Collectors.toList());
        }

        return Collections.emptyList(); // Return an empty list if no exams found
    }

    //fetch maximum marks of each exam by course ID
    public List<Integer> getMaxMarksByCourseId(Long courseId) {
        List<Object[]> maxMarks = courseDetailsRepository.findMaxMarksByCourseId(courseId);

        if (!maxMarks.isEmpty()) {
            // Extract the first (and only) row from the result
            Object[] row = maxMarks.get(0);
            return Arrays.stream(row)
                    .filter(Objects::nonNull)  // Filter out null values
                    .map(value -> (Integer) value) // Cast to Double
                    .collect(Collectors.toList());
        }

        return Collections.emptyList(); // Return an empty list if no exams found
    }

    // Fetch weightage of each exam by course ID
    public List<Double> getWeightagesByCourseId(Long courseId) {
        List<Object[]> weightages = courseDetailsRepository.findWeightagesByCourseId(courseId);

        if (!weightages.isEmpty()) {
            // Extract the first (and only) row from the result
            Object[] row = weightages.get(0);
            return Arrays.stream(row)
                    .filter(Objects::nonNull)  // Filter out null values
                    .map(value -> (Double) value) // Cast to Double
                    .collect(Collectors.toList());
        }

        return Collections.emptyList(); // Return an empty list if no exams found
    }


}
