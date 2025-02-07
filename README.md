# Classroom Attendance and Performance Tracker
A web application for teachers to efficiently manage student attendance, track academic performance, and generate reports. <br><br>

## Table of Contents
1. [Features](#1-features)
    - Attendance Management
    - Performance Tracking
    - Course Management
    - Reporting
2. [Technologies Used](#2-technologies-used)
3. [Getting Started](#getting-started)
4. [User Guide](#user-guide)
5. [Contributing](#contributing)
6. [License](#license)
<br><br>

## 1. Features
### 📚 Attendance Management
**Take Attendance**: Mark students as present, absent, or late for a particular class. If attendance data is populated in database, then drop-down label shows that value.  

**View Attendance**: Active & completed courses in sections in drop-down. Viewing attendance is for an entire course. Cells in display table have present, absent or late colour-coded values.  

### 📝 Performance Tracking
**Edit Grades**: Input grades for a particular exam. If grades data is populated in database, input field label shows that value. Oninput validation is used.  

**View Grades**: Viewing grades is for an entire course. Displays all the exams in a chosen course and calculated final grade in percentage.

### 🗂️ Course Management
Settings can be modified for active or all courses. A course can be toggled active or completed. Attendance can be enabled or disabled. Total number of classes and minimum attendance percentage is available.
Total number of exams, the name of each exam, maximum grades and weightage can be modified. Oninput validation is used.

### 📊 Reporting
**All Charts can be exported to PDF**  
Dashboard: Interactive Tooltip with Highlighting when hovering over a column (bar graph) or a section (pie chart).  

**Courses Overview**: Displays total number of active & completed courses. Bar graph for number of students in each course.   

**Attendance Summary (Active Courses)**: Shows the name of course, total number of students in each course, percentage of classes completed in each of active courses. Pie chart for percentage of students who were present, absent or late. Gives a list of students whose attendance is below minimum requirement.  

**Performance Summary**: (Active Courses) Bar graphs display all exams in each active course. Highest, lowest, average & median grades are shown.   
(Completed Courses) Bar graph shows number of students corresponding to score ranges in both percentage & German grading format.  
<br>
**All Views can exported to CSV**  
View Attendance & View Grades: Display table is converted to CSV file. CSV file is named according to selected course name.  
<br>

## 2. Technologies Used  







