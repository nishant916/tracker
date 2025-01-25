package com.classroom.tracker.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "course_details")
public class CourseDetails {

    @Id
    @Column(name = "course_Id")
    private Long courseId;

    @Column(name = "teacher_id")
    private Long teacherId;

    @Column(name = "username")
    private String username;

    @Column(name = "course")
    private String course;

    @Column(name = "is_course_active")
    private Boolean isCourseActive;

    @Column(name = "is_attendance_enabled")
    private Boolean isAttendanceEnabled;

    @Column(name = "total_classes")
    private Integer totalClasses;

    @Column(name = "min_attendance")
    private Double minAttendance;

    @Column(name = "num_of_exams")
    private Integer numOfExams;

    // Exam 1
    @Column(name = "exam1_label")
    private String exam1Label;

    @Column(name = "exam1_mm")
    private Integer exam1MaxMarks;

    @Column(name = "exam1_weightage")
    private Double exam1Weightage;

    // Exam 2
    @Column(name = "exam2_label")
    private String exam2Label;

    @Column(name = "exam2_mm")
    private Integer exam2MaxMarks;

    @Column(name = "exam2_weightage")
    private Double exam2Weightage;

    // Exam 3
    @Column(name = "exam3_label")
    private String exam3Label;

    @Column(name = "exam3_mm")
    private Integer exam3MaxMarks;

    @Column(name = "exam3_weightage")
    private Double exam3Weightage;

    // Exam 4
    @Column(name = "exam4_label")
    private String exam4Label;

    @Column(name = "exam4_mm")
    private Integer exam4MaxMarks;

    @Column(name = "exam4_weightage")
    private Double exam4Weightage;

    // Exam 5
    @Column(name = "exam5_label")
    private String exam5Label;

    @Column(name = "exam5_mm")
    private Integer exam5MaxMarks;

    @Column(name = "exam5_weightage")
    private Double exam5Weightage;

    // Exam 6
    @Column(name = "exam6_label")
    private String exam6Label;

    @Column(name = "exam6_mm")
    private Integer exam6MaxMarks;

    @Column(name = "exam6_weightage")
    private Double exam6Weightage;

    // Exam 7
    @Column(name = "exam7_label")
    private String exam7Label;

    @Column(name = "exam7_mm")
    private Integer exam7MaxMarks;

    @Column(name = "exam7_weightage")
    private Double exam7Weightage;

    // Exam 8
    @Column(name = "exam8_label")
    private String exam8Label;

    @Column(name = "exam8_mm")
    private Integer exam8MaxMarks;

    @Column(name = "exam8_weightage")
    private Double exam8Weightage;

    // Exam 9
    @Column(name = "exam9_label")
    private String exam9Label;

    @Column(name = "exam9_mm")
    private Integer exam9MaxMarks;

    @Column(name = "exam9_weightage")
    private Double exam9Weightage;

    // Exam 10
    @Column(name = "exam10_label")
    private String exam10Label;

    @Column(name = "exam10_mm")
    private Integer exam10MaxMarks;

    @Column(name = "exam10_weightage")
    private Double exam10Weightage;

    // Getters and Setters

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public Long getTeacherId() {
        return teacherId;
    }

    public void setTeacherId(Long teacherId) {
        this.teacherId = teacherId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getCourse() {
        return course;
    }

    public void setCourse(String course) {
        this.course = course;
    }

    public Boolean getIsCourseActive() {
        return isCourseActive;
    }

    public void setIsCourseActive(Boolean courseActive) {
        isCourseActive = courseActive;
    }

    public Boolean getIsAttendanceEnabled() {
        return isAttendanceEnabled;
    }

    public void setIsAttendanceEnabled(Boolean attendanceEnabled) {
        isAttendanceEnabled = attendanceEnabled;
    }

    public Integer getTotalClasses() {
        return totalClasses;
    }

    public void setTotalClasses(Integer totalClasses) {
        this.totalClasses = totalClasses;
    }

    public Double getMinAttendance() {
        return minAttendance;
    }

    public void setMinAttendance(Double minAttendance) {
        this.minAttendance = minAttendance;
    }

    public Integer getNumOfExams() {
        return numOfExams;
    }

    public void setNumOfExams(Integer numOfExams) {
        this.numOfExams = numOfExams;
    }

    public String getExam1Label() {
        return exam1Label;
    }

    public void setExam1Label(String exam1Label) {
        this.exam1Label = exam1Label;
    }

    public Integer getExam1MaxMarks() {
        return exam1MaxMarks;
    }

    public void setExam1MaxMarks(Integer exam1MaxMarks) {
        this.exam1MaxMarks = exam1MaxMarks;
    }

    public Double getExam1Weightage() {
        return exam1Weightage;
    }

    public void setExam1Weightage(Double exam1Weightage) {
        this.exam1Weightage = exam1Weightage;
    }

    public String getExam2Label() {
        return exam2Label;
    }

    public void setExam2Label(String exam2Label) {
        this.exam2Label = exam2Label;
    }

    public Integer getExam2MaxMarks() {
        return exam2MaxMarks;
    }

    public void setExam2MaxMarks(Integer exam2MaxMarks) {
        this.exam2MaxMarks = exam2MaxMarks;
    }

    public Double getExam2Weightage() {
        return exam2Weightage;
    }

    public void setExam2Weightage(Double exam2Weightage) {
        this.exam2Weightage = exam2Weightage;
    }

    public String getExam3Label() {
        return exam3Label;
    }

    public void setExam3Label(String exam3Label) {
        this.exam3Label = exam3Label;
    }

    public Integer getExam3MaxMarks() {
        return exam3MaxMarks;
    }

    public void setExam3MaxMarks(Integer exam3MaxMarks) {
        this.exam3MaxMarks = exam3MaxMarks;
    }

    public Double getExam3Weightage() {
        return exam3Weightage;
    }

    public void setExam3Weightage(Double exam3Weightage) {
        this.exam3Weightage = exam3Weightage;
    }

    public String getExam4Label() {
        return exam4Label;
    }

    public void setExam4Label(String exam4Label) {
        this.exam4Label = exam4Label;
    }

    public Integer getExam4MaxMarks() {
        return exam4MaxMarks;
    }

    public void setExam4MaxMarks(Integer exam4MaxMarks) {
        this.exam4MaxMarks = exam4MaxMarks;
    }

    public Double getExam4Weightage() {
        return exam4Weightage;
    }

    public void setExam4Weightage(Double exam4Weightage) {
        this.exam4Weightage = exam4Weightage;
    }

    public String getExam5Label() {
        return exam5Label;
    }

    public void setExam5Label(String exam5Label) {
        this.exam5Label = exam5Label;
    }

    public Integer getExam5MaxMarks() {
        return exam5MaxMarks;
    }

    public void setExam5MaxMarks(Integer exam5MaxMarks) {
        this.exam5MaxMarks = exam5MaxMarks;
    }

    public Double getExam5Weightage() {
        return exam5Weightage;
    }

    public void setExam5Weightage(Double exam5Weightage) {
        this.exam5Weightage = exam5Weightage;
    }

    public String getExam6Label() {
        return exam6Label;
    }

    public void setExam6Label(String exam6Label) {
        this.exam6Label = exam6Label;
    }

    public Integer getExam6MaxMarks() {
        return exam6MaxMarks;
    }

    public void setExam6MaxMarks(Integer exam6MaxMarks) {
        this.exam6MaxMarks = exam6MaxMarks;
    }

    public Double getExam6Weightage() {
        return exam6Weightage;
    }

    public void setExam6Weightage(Double exam6Weightage) {
        this.exam6Weightage = exam6Weightage;
    }

    public String getExam7Label() {
        return exam7Label;
    }

    public void setExam7Label(String exam7Label) {
        this.exam7Label = exam7Label;
    }

    public Integer getExam7MaxMarks() {
        return exam7MaxMarks;
    }

    public void setExam7MaxMarks(Integer exam7MaxMarks) {
        this.exam7MaxMarks = exam7MaxMarks;
    }

    public Double getExam7Weightage() {
        return exam7Weightage;
    }

    public void setExam7Weightage(Double exam7Weightage) {
        this.exam7Weightage = exam7Weightage;
    }

    public String getExam8Label() {
        return exam8Label;
    }

    public void setExam8Label(String exam8Label) {
        this.exam8Label = exam8Label;
    }

    public Integer getExam8MaxMarks() {
        return exam8MaxMarks;
    }

    public void setExam8MaxMarks(Integer exam8MaxMarks) {
        this.exam8MaxMarks = exam8MaxMarks;
    }

    public Double getExam8Weightage() {
        return exam8Weightage;
    }

    public void setExam8Weightage(Double exam8Weightage) {
        this.exam8Weightage = exam8Weightage;
    }

    public String getExam9Label() {
        return exam9Label;
    }

    public void setExam9Label(String exam9Label) {
        this.exam9Label = exam9Label;
    }

    public Integer getExam9MaxMarks() {
        return exam9MaxMarks;
    }

    public void setExam9MaxMarks(Integer exam9MaxMarks) {
        this.exam9MaxMarks = exam9MaxMarks;
    }

    public Double getExam9Weightage() {
        return exam9Weightage;
    }

    public void setExam9Weightage(Double exam9Weightage) {
        this.exam9Weightage = exam9Weightage;
    }

    public String getExam10Label() {
        return exam10Label;
    }

    public void setExam10Label(String exam10Label) {
        this.exam10Label = exam10Label;
    }

    public Integer getExam10MaxMarks() {
        return exam10MaxMarks;
    }

    public void setExam10MaxMarks(Integer exam10MaxMarks) {
        this.exam10MaxMarks = exam10MaxMarks;
    }

    public Double getExam10Weightage() {
        return exam10Weightage;
    }

    public void setExam10Weightage(Double exam10Weightage) {
        this.exam10Weightage = exam10Weightage;
    }
}

