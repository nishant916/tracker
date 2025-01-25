package com.classroom.tracker.controller;

import com.classroom.tracker.entity.TeacherDetails;
import com.classroom.tracker.service.TeacherDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class TeacherDetailsController {

    @Autowired
    private TeacherDetailsService teacherDetailsService;

    // Handle login form submission
    @PostMapping("/login")
    public ResponseEntity<Optional<TeacherDetails>> processLogin(@RequestBody Map<String, String> credentials) {
        // Extract username and password from the request body
        String username = credentials.get("username");
        String password = credentials.get("password");

        // Return authentication status as a response
        return ResponseEntity.ok(teacherDetailsService.authenticateTeacher(username, password));
    }
}
