package com.classroom.tracker.DTO;

public class AttendanceStatsDTO {
    private String courseName;
    private int presentCount;
    private int absentCount;
    private int lateCount;
    private int studentCount;
    private long courseId;
    private double minAttendance;
    private int completedClasses;
    private int totalClasses;

    // Default Constructor
    public AttendanceStatsDTO() {
    }

    // Getters and Setters
    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public int getPresentCount() {
        return presentCount;
    }

    public void setPresentCount(int presentCount) {
        this.presentCount = presentCount;
    }

    public int getAbsentCount() {
        return absentCount;
    }

    public void setAbsentCount(int absentCount) {
        this.absentCount = absentCount;
    }

    public int getLateCount() {
        return lateCount;
    }

    public void setLateCount(int lateCount) {
        this.lateCount = lateCount;
    }

    public int getStudentCount() {
        return studentCount;
    }

    public void setStudentCount(int studentCount) {
        this.studentCount = studentCount;
    }

    public long getCourseId() {
        return courseId;
    }

    public void setCourseId(long courseId) {
        this.courseId = courseId;
    }

    public double getMinAttendance() {
        return minAttendance;
    }

    public void setMinAttendance(double minAttendance) {
        this.minAttendance = minAttendance;
    }

    public int getCompletedClasses() {
        return completedClasses;
    }

    public void setCompletedClasses(int completedClasses) {
        this.completedClasses = completedClasses;
    }

    public int getTotalClasses() {
        return totalClasses;
    }

    public void setTotalClasses(int totalClasses) {
        this.totalClasses = totalClasses;
    }
}
