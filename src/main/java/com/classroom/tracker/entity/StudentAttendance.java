package com.classroom.tracker.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "student_attendance")
public class StudentAttendance {

    @Id
    @Column(name = "id")
    private Long id;            // primary key

    @Column(name = "student_id")
    private Long studentId;     // unique student identifier

    @Column(name = "course_Id")
    private Long courseId;

    @Column(name = "class1")
    private String class1;

    @Column(name = "class2")
    private String class2;

    @Column(name = "class3")
    private String class3;

    @Column(name = "class4")
    private String class4;

    @Column(name = "class5")
    private String class5;

    @Column(name = "class6")
    private String class6;

    @Column(name = "class7")
    private String class7;

    @Column(name = "class8")
    private String class8;

    @Column(name = "class9")
    private String class9;

    @Column(name = "class10")
    private String class10;


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

    public String getClass1() {
        return class1;
    }

    public void setClass1(String class1) {
        this.class1 = class1;
    }

    public String getClass2() {
        return class2;
    }

    public void setClass2(String class2) {
        this.class2 = class2;
    }

    public String getClass3() {
        return class3;
    }

    public void setClass3(String class3) {
        this.class3 = class3;
    }

    public String getClass4() {
        return class4;
    }

    public void setClass4(String class4) {
        this.class4 = class4;
    }

    public String getClass5() {
        return class5;
    }

    public void setClass5(String class5) {
        this.class5 = class5;
    }

    public String getClass6() {
        return class6;
    }

    public void setClass6(String class6) {
        this.class6 = class6;
    }

    public String getClass7() {
        return class7;
    }

    public void setClass7(String class7) {
        this.class7 = class7;
    }

    public String getClass8() {
        return class8;
    }

    public void setClass8(String class8) {
        this.class8 = class8;
    }

    public String getClass9() {
        return class9;
    }

    public void setClass9(String class9) {
        this.class9 = class9;
    }

    public String getClass10() {
        return class10;
    }

    public void setClass10(String class10) {
        this.class10 = class10;
    }


}
