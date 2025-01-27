package com.classroom.tracker.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "student_grades")
public class StudentGrades {

    @Id
    @Column(name = "id")
    private Long id;            // primary key

    @Column(name = "student_id")
    private Long studentId;     // unique student identifier

    @Column(name = "course_Id")
    private Long courseId;

    @Column(name = "exam1_grades")
    private Integer exam1Grades;

    @Column(name = "exam2_grades")
    private Integer exam2Grades;

    @Column(name = "exam3_grades")
    private Integer exam3Grades;

    @Column(name = "exam4_grades")
    private Integer exam4Grades;

    @Column(name = "exam5_grades")
    private Integer exam5Grades;

    @Column(name = "exam6_grades")
    private Integer exam6Grades;

    @Column(name = "exam7_grades")
    private Integer exam7Grades;

    @Column(name = "exam8_grades")
    private Integer exam8Grades;

    @Column(name = "exam9_grades")
    private Integer exam9Grades;

    @Column(name = "exam10_grades")
    private Integer exam10Grades;

    @Column(name = "total_grades")
    private Integer totalGrades;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public Integer getExam1Grades() {
        return exam1Grades;
    }

    public void setExam1Grades(Integer exam1Grades) {
        this.exam1Grades = exam1Grades;
    }

    public Integer getExam2Grades() {
        return exam2Grades;
    }

    public void setExam2Grades(Integer exam2Grades) {
        this.exam2Grades = exam2Grades;
    }

    public Integer getExam3Grades() {
        return exam3Grades;
    }

    public void setExam3Grades(Integer exam3Grades) {
        this.exam3Grades = exam3Grades;
    }

    public Integer getExam4Grades() {
        return exam4Grades;
    }

    public void setExam4Grades(Integer exam4Grades) {
        this.exam4Grades = exam4Grades;
    }

    public Integer getExam5Grades() {
        return exam5Grades;
    }

    public void setExam5Grades(Integer exam5Grades) {
        this.exam5Grades = exam5Grades;
    }

    public Integer getExam6Grades() {
        return exam6Grades;
    }

    public void setExam6Grades(Integer exam6Grades) {
        this.exam6Grades = exam6Grades;
    }

    public Integer getExam7Grades() {
        return exam7Grades;
    }

    public void setExam7Grades(Integer exam7Grades) {
        this.exam7Grades = exam7Grades;
    }

    public Integer getExam8Grades() {
        return exam8Grades;
    }

    public void setExam8Grades(Integer exam8Grades) {
        this.exam8Grades = exam8Grades;
    }

    public Integer getExam9Grades() {
        return exam9Grades;
    }

    public void setExam9Grades(Integer exam9Grades) {
        this.exam9Grades = exam9Grades;
    }

    public Integer getExam10Grades() {
        return exam10Grades;
    }

    public void setExam10Grades(Integer exam10Grades) {
        this.exam10Grades = exam10Grades;
    }

    public Integer getTotalGrades() {
        return totalGrades;
    }

    public void setTotalGrades(Integer totalGrades) {
        this.totalGrades = totalGrades;
    }

}
