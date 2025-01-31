package com.classroom.tracker.service;

import com.classroom.tracker.DTO.AttendanceStatsDTO;
import com.classroom.tracker.DTO.GradingStats2DTO;
import com.classroom.tracker.DTO.GradingStatsDTO;
import com.classroom.tracker.entity.CourseDetails;
import com.classroom.tracker.entity.StudentGrades;
import com.classroom.tracker.repository.CourseDetailsRepository;
import com.classroom.tracker.repository.StudentGradesRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class GradingSummaryService {
    private final CourseDetailsRepository courseDetailsRepository;
    private final StudentGradesRepository studentGradesRepository;

    public GradingSummaryService(CourseDetailsRepository courseDetailsRepository, StudentGradesRepository studentGradesRepository) {
        this.courseDetailsRepository = courseDetailsRepository;
        this.studentGradesRepository = studentGradesRepository;
    }

    public List<GradingStatsDTO> getGradingStatsForCourses(Long teacherId) {
        List<GradingStatsDTO> statsList = new ArrayList<>();

        // Fetch active courses for the teacher
        List<CourseDetails> courses = courseDetailsRepository.findByTeacherIdAndIsCourseActive(teacherId, true);


        for (CourseDetails course : courses) {
            GradingStatsDTO statsDTO = new GradingStatsDTO();
            statsDTO.setCourseName(course.getCourse());
            statsDTO.setCourseId(course.getCourseId());
            statsDTO.setNumOfExams(course.getNumOfExams());

            List<StudentGrades> gradesList = studentGradesRepository.findByCourseId(course.getCourseId());

            String[] examLabels = new String[10];
            int[] maxMarks = new int[10];
            int[] highestScore = new int[10];
            int[] lowestScore = new int[10];
            double[] averageScore = new double[10];
            double[] medianScore = new double[10];

            int completedExams = 0;

            for (int i = 0; i < course.getNumOfExams(); i++) {
                // Get exam label and max marks dynamically
                examLabels[i] = getExamLabel(course, i + 1);
                maxMarks[i] = getExamMaxMarks(course, i + 1);

                // Collect student scores for this exam
                List<Integer> scores = new ArrayList<>();
                for (StudentGrades grade : gradesList) {
                    Integer score = getExamGrade(grade, i + 1);
                    if (score != null) {
                        scores.add(score);
                    }
                }

                if (scores.stream().noneMatch(score -> score > 0)) {
                    // If all scores are 0, the exam was not completed
                    highestScore[i] = 0;
                    lowestScore[i] = 0;
                    averageScore[i] = 0;
                    medianScore[i] = 0;
                } else {
                    completedExams++;
                    highestScore[i] = Collections.max(scores);
                    lowestScore[i] = Collections.min(scores);
                    averageScore[i] = scores.stream().mapToInt(Integer::intValue).average().orElse(0);
                    medianScore[i] = calculateMedian(scores);
                }

            }

            statsDTO.setExamLabel(examLabels);
            statsDTO.setMaxMarks(maxMarks);
            statsDTO.setHighestScore(highestScore);
            statsDTO.setLowestScore(lowestScore);
            statsDTO.setAverageScore(averageScore);
            statsDTO.setMedianScore(medianScore);
            statsDTO.setNumOfCompletedExams(completedExams);
            statsDTO.setStudentCount(gradesList.size());

            statsList.add(statsDTO);
        }

        return statsList;
    }

    private String getExamLabel(CourseDetails course, int index) {
        try {
            return (String) CourseDetails.class.getMethod("getExam" + index + "Label").invoke(course);
        } catch (Exception e) {
            return "Exam " + index;
        }
    }

    private int getExamMaxMarks(CourseDetails course, int index) {
        try {
            return (int) CourseDetails.class.getMethod("getExam" + index + "MaxMarks").invoke(course);
        } catch (Exception e) {
            return 100; // Default max marks if not set
        }
    }

    private Integer getExamGrade(StudentGrades grades, int index) {
        try {
            return (Integer) StudentGrades.class.getMethod("getExam" + index + "Grades").invoke(grades);
        } catch (Exception e) {
            return null;
        }
    }

    private double calculateMedian(List<Integer> scores) {
        Collections.sort(scores);
        int size = scores.size();
        if (size % 2 == 0) {
            return (scores.get(size / 2 - 1) + scores.get(size / 2)) / 2.0;
        } else {
            return scores.get(size / 2);
        }
    }

    public List<GradingStats2DTO> getGradingStatsForCompletedCourses(Long teacherId) {
        List<GradingStats2DTO> statsList = new ArrayList<>();

        // Fetch completed courses for the teacher
        List<CourseDetails> courses = courseDetailsRepository.findByTeacherIdAndIsCourseActive(teacherId, false);

        for (CourseDetails course : courses) {
            GradingStats2DTO statsDTO = new GradingStats2DTO();
            statsDTO.setCourseName(course.getCourse());
            statsDTO.setCourseId(course.getCourseId());
            statsDTO.setNumOfExams(course.getNumOfExams());

            List<StudentGrades> gradesList = studentGradesRepository.findByCourseId(course.getCourseId());

            // Store max marks and weightages
            int numExams = course.getNumOfExams();
            int[] maxMarks = new int[numExams];
            double[] weightages = new double[numExams];

            // Loop to update maxMarks and weightages arrays
            for (int i = 0; i < numExams; i++) {
                try {
                    // Using reflection to get exam max marks and weightage dynamically
                    maxMarks[i] = (int) CourseDetails.class.getMethod("getExam" + (i + 1) + "MaxMarks").invoke(course);
                    weightages[i] = (double) CourseDetails.class.getMethod("getExam" + (i + 1) + "Weightage").invoke(course);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }

            // Initialize grade category counters
            int[] gradeCategories = new int[11];

            for (StudentGrades grade : gradesList) {
                double totalObtained = 0;
                double totalMax = 0;

                for (int i = 0; i < numExams; i++) {
                    try {
                        // Use reflection to get exam grades dynamically
                        Integer examGrade = (Integer) StudentGrades.class.getMethod("getExam" + (i + 1) + "Grades").invoke(grade);
                        if (examGrade != null) {
                            totalObtained += examGrade * weightages[i];
                            totalMax += maxMarks[i] * weightages[i];
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }

                // Avoid division by zero
                if (totalMax > 0) {
                    double percentage = (totalObtained / totalMax) * 100;

                    // Determine the grade category
                    int categoryIndex = getCategoryIndex(percentage);
                    gradeCategories[categoryIndex]++;
                }
            }

            statsDTO.setGradeCategories(gradeCategories);
            statsList.add(statsDTO);
        }
        return statsList;
    }

    /**
     * Determines the category index based on the percentage.
     */
    private int getCategoryIndex(double percentage) {
        if (percentage < 50) return 0;
        if (percentage < 55) return 1;
        if (percentage < 60) return 2;
        if (percentage < 65) return 3;
        if (percentage < 70) return 4;
        if (percentage < 75) return 5;
        if (percentage < 80) return 6;
        if (percentage < 85) return 7;
        if (percentage < 90) return 8;
        if (percentage < 95) return 9;
        return 10; // Above 95%
    }

}