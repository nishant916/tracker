package com.classroom.tracker.DTO;

public class GradingStatsDTO {
    private String courseName;
    private long courseId;
    private int studentCount;
    private int numOfCompletedExams;
    private int numOfExams;
    // Arrays for exams as there could be multiple exams (upto 10) in each course
    private String[] examLabel = new String[10];
    private int[] maxMarks = new int[10];
    private int[] highestScore = new int[10];
    private int[] lowestScore = new int[10];
    private double[] averageScore = new double[10];
    private double[] medianScore = new double[10];

    // Getters and Setters
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

    public int getStudentCount() {
        return studentCount;
    }

    public void setStudentCount(int studentCount) {
        this.studentCount = studentCount;
    }

    public int getNumOfCompletedExams() {
        return numOfCompletedExams;
    }

    public void setNumOfCompletedExams(int numOfCompletedExams) {
        this.numOfCompletedExams = numOfCompletedExams;
    }

    public int getNumOfExams() {
        return numOfExams;
    }

    public void setNumOfExams(int numOfExams) {
        this.numOfExams = numOfExams;
    }

    public String[] getExamLabel() {
        return examLabel;
    }

    public void setExamLabel(String[] examLabel) {
        this.examLabel = examLabel;
    }

    public int[] getMaxMarks() {
        return maxMarks;
    }

    public void setMaxMarks(int[] maxMarks) {
        this.maxMarks = maxMarks;
    }

    public int[] getHighestScore() {
        return highestScore;
    }

    public void setHighestScore(int[] highestScore) {
        this.highestScore = highestScore;
    }

    public int[] getLowestScore() {
        return lowestScore;
    }

    public void setLowestScore(int[] lowestScore) {
        this.lowestScore = lowestScore;
    }

    public double[] getAverageScore() {
        return averageScore;
    }

    public void setAverageScore(double[] averageScore) {
        this.averageScore = averageScore;
    }

    public double[] getMedianScore() {
        return medianScore;
    }

    public void setMedianScore(double[] medianScore) {
        this.medianScore = medianScore;
    }
}

