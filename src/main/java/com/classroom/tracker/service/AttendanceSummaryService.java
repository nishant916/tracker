package com.classroom.tracker.service;

import com.classroom.tracker.DTO.AttendanceStatsDTO;
import com.classroom.tracker.entity.CourseDetails;
import com.classroom.tracker.entity.StudentAttendance;
import com.classroom.tracker.entity.StudentDetails;
import com.classroom.tracker.repository.CourseDetailsRepository;
import com.classroom.tracker.repository.StudentAttendanceRepository;
import com.classroom.tracker.repository.StudentDetailsRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AttendanceSummaryService {
    private final CourseDetailsRepository courseDetailsRepository;
    private final StudentAttendanceRepository studentAttendanceRepository;
    private final StudentDetailsRepository studentDetailsRepository;

    public AttendanceSummaryService(CourseDetailsRepository courseDetailsRepository, StudentAttendanceRepository studentAttendanceRepository, StudentDetailsRepository studentDetailsRepository) {
        this.courseDetailsRepository = courseDetailsRepository;
        this.studentAttendanceRepository = studentAttendanceRepository;
        this.studentDetailsRepository = studentDetailsRepository;
    }

    public List<AttendanceStatsDTO> getAttendanceStatsForCourses(Long teacherId) {
        List<AttendanceStatsDTO> statsList = new ArrayList<>();

        // Fetch active courses for the teacher
        List<CourseDetails> courses = courseDetailsRepository.findByTeacherIdAndIsCourseActive(teacherId, true);

        for (CourseDetails course : courses) {
            AttendanceStatsDTO statsDTO = new AttendanceStatsDTO();
            statsDTO.setCourseName(course.getCourse());
            statsDTO.setCourseId(course.getCourseId());
            statsDTO.setMinAttendance(course.getMinAttendance());
            statsDTO.setTotalClasses(course.getTotalClasses());


            int present = 0;
            int absent = 0;
            int late = 0;
            int completedClasses = 0;
            int studentCount = 0;

            // Fetch attendance for the course
            List<StudentAttendance> studentAttendances = studentAttendanceRepository.findByCourseId(course.getCourseId());

            for (StudentAttendance studentAttendance : studentAttendances) {
                studentCount++;
                // For each student, check only completed classes (i.e., exclude N/A)
                for (int i = 1; i <= course.getTotalClasses(); i++) {
                    String attendance = getClassAttendance(studentAttendance, i);

                    // Only process if attendance is not "N/A"
                    if (!"N/A".equals(attendance)) {
                        if ("present".equals(attendance)) present++;
                        if ("absent".equals(attendance)) absent++;
                        if ("late".equals(attendance)) late++;
                        if (studentCount==1) completedClasses++; // check for first student only
                    }
                }
            }

            statsDTO.setPresentCount(present);
            statsDTO.setAbsentCount(absent);
            statsDTO.setLateCount(late);
            statsDTO.setStudentCount(studentCount);
            statsDTO.setCompletedClasses(completedClasses);

            statsList.add(statsDTO);
        }

        return statsList;
    }

    // Get a list of students below the minimum attendance threshold
    public List<Map<String, Object>> getStudentsBelowMinimumAttendance(Long teacherId, Long courseId, double minAttendance) {
        List<Map<String, Object>> lowAttendanceStudents = new ArrayList<>();

        // Fetch student attendance for the course
        List<StudentAttendance> studentAttendances = studentAttendanceRepository.findByCourseId(courseId);
        List<StudentDetails> studentDetailsList = studentDetailsRepository.findByCourseId(courseId);

        // Create a map for quick lookup of StudentDetails by studentId
        Map<Long, StudentDetails> studentDetailsMap = studentDetailsList.stream()
                .collect(Collectors.toMap(StudentDetails::getStudentId, student -> student));

        // Fetch completed classes for the course
        int completedClasses = getCompletedClassesForCourse(teacherId, courseId);

        // Iterate through each student attendance and calculate attendance percentage
        for (StudentAttendance studentAttendance : studentAttendances) {
            double attendedClasses = 0;

            // Loop through the completed classes, not totalClasses
            for (int i = 1; i <= completedClasses; i++) {
                String attendance = getClassAttendance(studentAttendance, i);

                if ("present".equals(attendance)) {
                    attendedClasses += 1.0;
                } else if ("late".equals(attendance)) {
                    attendedClasses += 0.5; // Increment by 0.5 for late attendance
                }
            }

            // Calculate individual attendance percentage based on completed classes
            double attendancePercentage = (attendedClasses / (double) completedClasses);

            // Add to the list if below the threshold
            if (attendancePercentage < minAttendance) {
                Map<String, Object> studentData = new HashMap<>();
                studentData.put("studentId", studentAttendance.getStudentId());
                studentData.put("attendancePercentage", attendancePercentage * 100); // Convert to percentage

                // Get student details if available
                StudentDetails details = studentDetailsMap.get(studentAttendance.getStudentId());
                if (details != null) {
                    studentData.put("firstName", details.getFirstName());
                    studentData.put("lastName", details.getLastName());
                } else {
                    studentData.put("firstName", "Unknown");
                    studentData.put("lastName", "Unknown");
                }

                lowAttendanceStudents.add(studentData);
            }
        }

        return lowAttendanceStudents;
    }


    // Helper method to get the completed classes for a course
    private int getCompletedClassesForCourse(Long teacherId, Long courseId) {
        List<AttendanceStatsDTO> attendanceStatsList = getAttendanceStatsForCourses(teacherId);

        // Find the course in the summary and get the completed classes
        for (AttendanceStatsDTO attendanceStatsDTO : attendanceStatsList) {
            if (attendanceStatsDTO.getCourseId() == courseId) {
                return attendanceStatsDTO.getCompletedClasses();
            }
        }

        return 0;
    }

    // Helper method to fetch attendance from the StudentAttendance entity based on the class number
    private String getClassAttendance(StudentAttendance studentAttendance, int classNumber) {
        switch (classNumber) {
            case 1: return studentAttendance.getClass1();
            case 2: return studentAttendance.getClass2();
            case 3: return studentAttendance.getClass3();
            case 4: return studentAttendance.getClass4();
            case 5: return studentAttendance.getClass5();
            case 6: return studentAttendance.getClass6();
            case 7: return studentAttendance.getClass7();
            case 8: return studentAttendance.getClass8();
            case 9: return studentAttendance.getClass9();
            case 10: return studentAttendance.getClass10();
            default: return "N/A";
        }
    }
}
