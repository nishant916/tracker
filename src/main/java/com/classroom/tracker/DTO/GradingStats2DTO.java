package com.classroom.tracker.DTO;

public class GradingStats2DTO {
    private String courseName;
    private long courseId;
    private int numOfExams;

    private int[] gradeCategories = new int[11]; // List to calculate no. of students across grade categories

    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public long getCourseId() {
        return courseId;
    }

    public void setCourseId(long courseId) {
        this.courseId = courseId;
    }

    public int getNumOfExams() {
        return numOfExams;
    }

    public void setNumOfExams(int numOfExams) {
        this.numOfExams = numOfExams;
    }

    public int[] getGradeCategories() {
        return gradeCategories;
    }

    public void setGradeCategories(int[] gradeCategories) {
        this.gradeCategories = gradeCategories;
    }
}
