package com.classroom.tracker.service;

import com.classroom.tracker.entity.StudentAttendance;
import com.classroom.tracker.repository.StudentAttendanceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.lang.reflect.Field;
import java.util.List;
import java.util.Optional;

@Service
public class StudentAttendanceService {
    private final StudentAttendanceRepository studentAttendanceRepository;

    public StudentAttendanceService(StudentAttendanceRepository studentAttendanceRepository) {
        this.studentAttendanceRepository = studentAttendanceRepository;
    }

    // Fetch attendance records by course ID
    public List<StudentAttendance> getAttendanceByCourseId(Long courseId) {
        return studentAttendanceRepository.findByCourseId(courseId);
    }

    @Transactional
    public void updateAttendance(Long studentId, Long courseId, int classNumber, String status) {
        Optional<StudentAttendance> optionalAttendance = Optional.ofNullable(studentAttendanceRepository.findByStudentIdAndCourseId(studentId, courseId));

        if (optionalAttendance.isPresent()) {
            StudentAttendance attendance = optionalAttendance.get();

            try {
                // Use Reflection to dynamically update the correct class column
                Field field = StudentAttendance.class.getDeclaredField("class" + classNumber);
                field.setAccessible(true);
                field.set(attendance, status);

                studentAttendanceRepository.save(attendance);
            } catch (NoSuchFieldException | IllegalAccessException e) {
                throw new RuntimeException("Error updating attendance field: class" + classNumber, e);
            }
        }
    }

}
