package com.classroom.tracker.service;

import com.classroom.tracker.entity.StudentAttendance;
import com.classroom.tracker.repository.StudentAttendanceRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentAttendanceService {
    private final StudentAttendanceRepository studentAttendanceRepository;

    public StudentAttendanceService(StudentAttendanceRepository studentAttendanceRepository) {
        this.studentAttendanceRepository = studentAttendanceRepository;
    }

    public List<StudentAttendance> getAttendanceByCourseId(Long courseId) {
        return studentAttendanceRepository.findByCourseId(courseId);
    }


}
