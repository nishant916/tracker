package com.classroom.tracker;

import com.classroom.tracker.entity.CourseDetails;
import com.classroom.tracker.entity.TeacherDetails;
import com.classroom.tracker.entity.StudentDetails;
import com.classroom.tracker.entity.StudentAttendance;
import com.classroom.tracker.repository.CourseDetailsRepository;
import com.classroom.tracker.repository.TeacherDetailsRepository;
import com.classroom.tracker.repository.StudentDetailsRepository;
import com.classroom.tracker.repository.StudentAttendanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

@Component
public class DataLoader {

    @Autowired
    private CourseDetailsRepository courseDetailsRepository;

    @Autowired
    private TeacherDetailsRepository teacherDetailsRepository;

    @Autowired
    private StudentDetailsRepository studentDetailsRepository;

    @Autowired
    private StudentAttendanceRepository studentAttendanceRepository;

    // Path to the CSV file (can be in resources folder or any desired location)
    @Value("${csv.course-details}")
    private String courseDetailsCsv;

    @Value("${csv.teacher-details}")
    private String teacherDetailsCsv;

    @Value("${csv.student-details}")
    private String studentDetailsCsv;

    @Value("${csv.student-attendance}")
    private String studentAttendanceCsv;


    public void loadData() {
        try {
            loadCourseDetails(courseDetailsCsv);
            loadTeacherDetails(teacherDetailsCsv);
            loadStudentDetails(studentDetailsCsv);
            loadStudentAttendance(studentAttendanceCsv);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private void loadCourseDetails(String csvFilePath) throws IOException {
        try (BufferedReader br = Files.newBufferedReader(Paths.get(csvFilePath))) {
            // Skip header row
            String line = br.readLine();

            // Read each line of the CSV file
            while ((line = br.readLine()) != null) {
                String[] values = line.split(",");

                CourseDetails courseDetails = new CourseDetails();

                // Mapping fields from CSV to CourseDetails entity
                courseDetails.setCourseId(parseLong(values[0])); // course_Id
                courseDetails.setTeacherId(parseLong(values[1])); // teacher_id
                courseDetails.setUsername(values[2]); // username
                courseDetails.setCourse(values[3]); // course
                courseDetails.setIsCourseActive(parseBoolean(values[4])); // is_course_active
                courseDetails.setIsAttendanceEnabled(parseBoolean(values[5])); // is_attendance_enabled
                courseDetails.setTotalClasses(parseInteger(values[6])); // total_classes
                courseDetails.setMinAttendance(parseDouble(values[7])); // min_attendance
                courseDetails.setNumOfExams(parseInteger(values[8])); // num_of_exams

                // Mapping exam fields
                courseDetails.setExam1Label(values[9]); // exam1_label
                courseDetails.setExam1MaxMarks(parseInteger(values[10])); // exam1_mm
                courseDetails.setExam1Weightage(parseDouble(values[11])); // exam1_weightage

                courseDetails.setExam2Label(values[12]); // exam2_label
                courseDetails.setExam2MaxMarks(parseInteger(values[13])); // exam2_mm
                courseDetails.setExam2Weightage(parseDouble(values[14])); // exam2_weightage

                courseDetails.setExam3Label(values[15]); // exam3_label
                courseDetails.setExam3MaxMarks(parseInteger(values[16])); // exam3_mm
                courseDetails.setExam3Weightage(parseDouble(values[17])); // exam3_weightage

                courseDetails.setExam4Label(values[18]); // exam4_label
                courseDetails.setExam4MaxMarks(parseInteger(values[19])); // exam4_mm
                courseDetails.setExam4Weightage(parseDouble(values[20])); // exam4_weightage

                courseDetails.setExam5Label(values[21]); // exam5_label
                courseDetails.setExam5MaxMarks(parseInteger(values[22])); // exam5_mm
                courseDetails.setExam5Weightage(parseDouble(values[23])); // exam5_weightage

                courseDetails.setExam6Label(values[24]); // exam6_label
                courseDetails.setExam6MaxMarks(parseInteger(values[25])); // exam6_mm
                courseDetails.setExam6Weightage(parseDouble(values[26])); // exam6_weightage

                courseDetails.setExam7Label(values[27]); // exam7_label
                courseDetails.setExam7MaxMarks(parseInteger(values[28])); // exam7_mm
                courseDetails.setExam7Weightage(parseDouble(values[29])); // exam7_weightage

                courseDetails.setExam8Label(values[30]); // exam8_label
                courseDetails.setExam8MaxMarks(parseInteger(values[31])); // exam8_mm
                courseDetails.setExam8Weightage(parseDouble(values[32])); // exam8_weightage

                courseDetails.setExam9Label(values[33]); // exam9_label
                courseDetails.setExam9MaxMarks(parseInteger(values[34])); // exam9_mm
                courseDetails.setExam9Weightage(parseDouble(values[35])); // exam9_weightage

                courseDetails.setExam10Label(values[36]); // exam10_label
                courseDetails.setExam10MaxMarks(parseInteger(values[37])); // exam10_mm
                courseDetails.setExam10Weightage(parseDouble(values[38])); // exam10_weightage

                // Save to the database
                courseDetailsRepository.save(courseDetails);
            }
        }
    }

    private void loadTeacherDetails(String csvFilePath) throws IOException {
        try (BufferedReader br = Files.newBufferedReader(Paths.get(csvFilePath))) {
            // Skip header row
            String line = br.readLine();

            // Read each line
            while ((line = br.readLine()) != null) {
                String[] values = line.split(",");

                TeacherDetails teacherDetails = new TeacherDetails();
                teacherDetails.setTeacherId(parseLong(values[0]));
                teacherDetails.setFirstName(values[1]);
                teacherDetails.setLastName(values[2]);
                teacherDetails.setEmailAddress(values[3]);
                teacherDetails.setUsername(values[4]);
                teacherDetails.setPassword(values[5]);

                // Save to repository
                teacherDetailsRepository.save(teacherDetails);
            }
        }
    }

    private void loadStudentDetails(String csvFilePath) throws IOException{
        try (BufferedReader br = Files.newBufferedReader(Paths.get(csvFilePath))) {
            String line = br.readLine(); // Skip header row

            while ((line = br.readLine()) != null) {
                String[] values = line.split(",");

                StudentDetails studentDetails = new StudentDetails();
                studentDetails.setId(parseLong(values[0]));
                studentDetails.setStudentId(parseLong(values[1]));
                studentDetails.setFirstName(values[2]);
                studentDetails.setLastName(values[3]);
                studentDetails.setEmailAddress(values[4]);
                studentDetails.setCourseId(parseLong(values[5]));

                studentDetailsRepository.save(studentDetails);
            }
        }
    }

    private void loadStudentAttendance(String csvFilePath) throws IOException {
        try (BufferedReader br = Files.newBufferedReader(Paths.get(csvFilePath))) {
            String line = br.readLine(); // Skip header row

            while ((line = br.readLine()) != null) {
                String[] values = line.split(",");

                StudentAttendance studentAttendance = new StudentAttendance();
                studentAttendance.setId(parseLong(values[0]));
                studentAttendance.setStudentId(parseLong(values[1]));
                studentAttendance.setCourseId(parseLong(values[2]));

                studentAttendance.setClass1(values[3]);
                studentAttendance.setClass2(values[4]);
                studentAttendance.setClass3(values[5]);
                studentAttendance.setClass4(values[6]);
                studentAttendance.setClass5(values[7]);
                studentAttendance.setClass6(values[8]);
                studentAttendance.setClass7(values[9]);
                studentAttendance.setClass8(values[10]);
                studentAttendance.setClass9(values[11]);
                studentAttendance.setClass10(values[12]);

                studentAttendanceRepository.save(studentAttendance);
            }
        }
    }

    // Helper methods to safely parse values from CSV
    private Long parseLong(String value) {
        return value != null && !value.isEmpty() ? Long.parseLong(value) : null;
    }

    private Boolean parseBoolean(String value) {
        return value != null && !value.isEmpty() ? Boolean.parseBoolean(value) : null;
    }

    private Integer parseInteger(String value) {
        return value != null && !value.isEmpty() ? Integer.parseInt(value) : null;
    }

    private Double parseDouble(String value) {
        return value != null && !value.isEmpty() ? Double.parseDouble(value) : null;
    }
}
