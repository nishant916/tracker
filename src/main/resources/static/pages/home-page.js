document.addEventListener('DOMContentLoaded', () => {
  fetchAllCourses();
  createStudentsAcrossCoursesCharts();
  makeAttendanceChart();
  fetchGradingStats();
  fetchGradingStatsCompletedCourses();

  // Event listeners for radio buttons
  document.getElementById('viewPercentages').addEventListener('change', () => {
    if (currentViewType !== "percentages") {
      currentViewType = "percentages";
      fetchGradingStatsCompletedCourses();  // Re-fetch and update charts with percentages
    }
  });

  document.getElementById('viewGrades').addEventListener('change', () => {
    if (currentViewType !== "grades") {
      currentViewType = "grades";
      fetchGradingStatsCompletedCourses();  // Re-fetch and update charts with grades
    }
  });
});

  function fetchAllCourses() {

    // Fetch all courses once
    const url = `/api/course-settings/${teacherId}`;

    fetch(url)
      .then(response => response.json())
      .then(allCourses => {
        updateCourseTiles(allCourses);

        // Set welcome text
        const username = allCourses[0].username;
        const firstName = toProperCase(username.split('.')[0]);
        const welcomeText = document.getElementById('welcomeText');
        welcomeText.textContent = `Welcome ${firstName}! Here’s a snapshot of your courses.`;

      })
      .catch(error => console.error('Error fetching courses:', error));
  }


  function updateCourseTiles(allCourses) {
    // Count active and completed courses
    const activeCoursesCount = allCourses.filter(course => course.isCourseActive).length;
    const completedCoursesCount = allCourses.length - activeCoursesCount;

    // Update the tiles in the DOM
    document.getElementById('activeCoursesCount').textContent = activeCoursesCount;
    document.getElementById('completedCoursesCount').textContent = completedCoursesCount;
  }

function createStudentsAcrossCoursesCharts() {
  fetch(`/api/attendance/studentCounts/${teacherId}`)
    .then((response) => response.json())
    .then((data) => {
      // Filter data for active and completed courses
      const activeCourses = data.filter((course) => course.isCourseActive);
      const completedCourses = data.filter((course) => !course.isCourseActive);

      // Combine active and completed courses into a single dataset
      const labels = [...activeCourses.map((course) => course.course), ...completedCourses.map((course) => course.course)];
      const activeCourseData = activeCourses.map((course) => course.studentCount);
      const completedCourseData = completedCourses.map((course) => course.studentCount);
      const dataValues = [...activeCourseData, ...completedCourseData];

      // Generate background colors based on whether the course is active or completed
      const backgroundColors = [
        ...Array(activeCourses.length).fill('rgba(54, 162, 235, 0.7)'), // Light blue for active courses
        ...Array(completedCourses.length).fill('rgba(255, 99, 132, 0.7)'), // Light red for completed courses
      ];
      const borderColors = [
        ...Array(activeCourses.length).fill('rgba(54, 162, 235, 1)'), // Darker blue border for active courses
        ...Array(completedCourses.length).fill('rgba(255, 99, 132, 1)'), // Darker red border for completed courses
      ];

      // Create a single horizontal bar chart
      const chartCtx = document.getElementById('studentsAcrossCoursesChart').getContext('2d');
      new Chart(chartCtx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: '# of Students',
              data: dataValues,
              backgroundColor: backgroundColors,
              borderColor: borderColors,
              borderWidth: 1,
            },
          ],
        },
        options: {
          indexAxis: 'y', // Horizontal bar chart
          plugins: {
            legend: {
              display: false,
              position: 'top',
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  // Determine if the course is active or completed
                  const index = context.dataIndex;
                  const isActive = index < activeCourses.length;
                  return `${context.dataset.label}: ${context.raw} (${isActive ? 'Active' : 'Completed'})`;
                },
              },
            },
          },
          scales: {
            x: {
              beginAtZero: true,
               title: {
               display: true,
               text: 'Number of Students',
               font: {
                 size: 14 ,
                 weight: 'bold'
               }
             }
            },
          },
        },
      });

      // Update labels on the left side of the page
      const labelsContainer = document.getElementById('labelsContainer');

    })
    .catch((error) => console.error('Error fetching data:', error));
}

// Fetches attendance summary and low attendance student list for active courses & make visualizations
function makeAttendanceChart() {
  const attendanceSummaryContainer = document.getElementById("attendanceSummaryContainer");

  // Fetch attendance stats for the active courses
  fetch(`/api/attendance-summary/${teacherId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Attendance data received:", data);

      if (data.length === 0) {
        attendanceSummaryContainer.innerHTML = "<p>No active courses found.</p>";
        return;
      }

      attendanceSummaryContainer.innerHTML = ""; // Clear existing content

      data.forEach((course, index) => {
        const {
          courseName,
          presentCount,
          absentCount,
          lateCount,
          totalClasses,
          courseId,
          minAttendance,
          completedClasses,
          studentCount,
        } = course;

        // Calculate the course completion percentage
        const completionPercentage = ((completedClasses / totalClasses) * 100).toFixed(1);

        // Generate the course card
        const courseCard = `
          <div class="col-md-4 mb-4">
            <div class="card shadow-sm">
              <div class="card-body">
                <h5 class="card-title text-center text-primary">${courseName}</h5>
                <h6 class="text-center text-secondary mb-3">Total Students: ${studentCount}</h6>
                <h6 class="text-center text-success">Course Completion</h6>
                <div class="progress mb-3" style="height: 20px;">
                  <div class="progress-bar bg-success" style="width: ${completionPercentage}%"
                       aria-valuenow="${completedClasses}" aria-valuemin="0" aria-valuemax="${totalClasses}">
                    ${completionPercentage}%
                  </div>
                </div>
                <div class="text-center">
                  <canvas id="attendancePieChart-${index}" class="attendancePieChart" width="150" height="150"></canvas>
                </div>
                <h6 class="mt-4 text-danger text-center">Students Below Minimum Attendance (${(minAttendance * 100).toFixed(
                  1
                )}%)</h6>
                <ul class="list-group" id="studentList-${index}">
                  <li class="list-group-item text-center">Loading...</li>
                </ul>
              </div>
            </div>
          </div>
        `;

        // Append course card to the container
        attendanceSummaryContainer.insertAdjacentHTML("beforeend", courseCard);

        // Render the pie chart for the course
        const pieChartCanvas = document.getElementById(`attendancePieChart-${index}`);
        renderPieChart(pieChartCanvas, presentCount, absentCount, lateCount);

        // Fetch and populate the list of students below minimum attendance
        fetch(`/api/attendance-summary/students-below-minimum/${teacherId}/${courseId}/${minAttendance}`)
          .then((studentResponse) => {
            if (!studentResponse.ok) {
              throw new Error(`Student API Error: ${studentResponse.statusText}`);
            }
            return studentResponse.json();
          })
          .then((students) => {
            const studentList = document.getElementById(`studentList-${index}`);
            studentList.innerHTML = "";
            console.log("Fetched students list: ", students);

            if (students.length === 0) {
              studentList.innerHTML = "<li class='list-group-item'>No students below minimum attendance.</li>";
              return;
            }

            students.forEach((student) => {
              const { firstName, lastName, attendancePercentage } = student;

              // Combine firstName, lastName, and attendance percentage
              const studentItem = `
                <li class="list-group-item text-center text-muted small">
                  ${firstName} ${lastName} (${attendancePercentage.toFixed(1)}%)
                </li>
              `;
              studentList.insertAdjacentHTML("beforeend", studentItem);
            });
          })
          .catch((studentError) => {
            console.error("Error fetching student data:", studentError);
            const studentList = document.getElementById(`studentList-${index}`);
            studentList.innerHTML = "<li class='list-group-item text-danger'>Error loading student data.</li>";
          });
      });
    })
    .catch((error) => {
      console.error("Error fetching attendance data:", error);
      attendanceSummaryContainer.innerHTML = "<p class='text-danger'>Error loading attendance data. Please try again later.</p>";
    });
}

const chartInstances = new Map(); // Map to store chart instances by canvas element

// Helper function to create PieCharts for attendance
function renderPieChart(canvas, present, absent, late) {
  if (!canvas) {
    console.error("Canvas element not found or is null.");
    return;
  }

  if (chartInstances.has(canvas)) {
    console.log("Destroying existing chart for canvas:", canvas);
    chartInstances.get(canvas).destroy();
  }

  const total = present + absent + late;

  const chart = new Chart(canvas, {
    type: "pie",
    data: {
      labels: ["Present", "Absent", "Late"],
      datasets: [
        {
          data: [present, absent, late],
          backgroundColor: ["#28a745", "#dc3545", "#ffc107"],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom",
        },
        tooltip: {
          callbacks: {
            label: function (tooltipItem) {
              const data = tooltipItem.dataset.data;
              const value = data[tooltipItem.dataIndex];
              const percentage = ((value / total) * 100).toFixed(2); // Calculate percentage
              return `${tooltipItem.label}: ${percentage}%`;
            },
          },
        },
      },
    },
  });

  chartInstances.set(canvas, chart);
}

function fetchGradingStats() {
  fetch(`/api/grading-summary/${teacherId}`)
    .then((response) => response.json())
    .then((data) => {
      console.log('Fetched Grading stats:', data);
      populateGradingOfActiveCourses(data);
    })
    .catch((error) => console.error("Error fetching grading stats:", error));
}

function populateGradingOfActiveCourses(gradingStats) {
  const container = document.getElementById("performanceActiveCoursesSummaryContainer");
  container.innerHTML = ""; // Clear previous content

  gradingStats.forEach((course) => {
    const courseCard = document.createElement("div");
    courseCard.classList.add("col-md-6", "mb-4");

    let examsHtml = "";
    for (let i = 0; i < course.numOfCompletedExams; i++) {
      examsHtml += `
        <h6 class="text-center">${course.examLabel[i]}</h6>
        <p class="text-muted text-center" style="font-size: 12px;">(Maximum Marks: ${course.maxMarks[i]})</p>
        <canvas id="examChart-${course.courseId}-${i}" class="exam-chart"></canvas>
      `;
      if (i<(course.numOfCompletedExams-1)){
        examsHtml += `
          <hr>
        `;
      }
    }

    courseCard.innerHTML = `
      <div class="card shadow-sm">
        <div class="card-body">
          <h5 class="card-title text-center" style="color:rgba(54, 162, 235, 1.0)">${course.courseName}</h5>
          ${examsHtml}
        </div>
      </div>
    `;

    container.appendChild(courseCard);

    // Generate charts for each exam
    for (let i = 0; i < course.numOfCompletedExams; i++) {
      createExamChart(`examChart-${course.courseId}-${i}`, course, i,course.maxMarks[i]);
    }
  });
}

function createExamChart(canvasId, course, examIndex, examMaxMarks) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;

  //const Color1 = "rgba(33, 139, 191, 1.0)"; // Darker shade for highest
  //const Color2 = "rgba(104, 186, 255, 1.0)"; // Lighter shade for lowest
  const Color1 = "#28a745"; // green
  const Color2 = "#dc3545"; // red
  const averagePattern = "rgba(54, 162, 235, 0.5)";  // Transparent light blue for average
  const medianPattern = "rgba(54, 162, 235, 0.3)";  // More transparent blue for median

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Highest", "Lowest", "Average", "Median"],
      datasets: [
        {
          label: course.examLabel[examIndex],
          data: [
            course.highestScore[examIndex],
            course.lowestScore[examIndex],
            course.averageScore[examIndex],
            course.medianScore[examIndex],
          ],
          backgroundColor: [Color1,Color2,averagePattern,medianPattern],
          borderWidth: 1,
        },
      ],
    },
    options: {
      indexAxis: 'y', // Horizontal bar chart
      scales: {
        x: {
          beginAtZero: true, // Ensures scores start from 0
          max: examMaxMarks,
          title: {
            display: true,
            text: "Grades", // X-axis label
            font: {
              size: 14,
              weight: 'bold'
            }
          }
        },
      },
      plugins: {
        legend: { display: false }, // Removes legend
      },
    },
  });
}

let currentViewType = "percentages";  // Default view type
const charts = {};

function fetchGradingStatsCompletedCourses() {
  fetch(`/api/grading-summary/completed/${teacherId}`)
    .then((response) => response.json())
    .then((gradingStats) => {
      console.log('Fetched Grading stats completed courses:', gradingStats);
      populateGradingOfCompletedCourses(gradingStats);
    })
    .catch((error) => console.error("Error fetching grading stats:", error));
}

function populateGradingOfCompletedCourses(gradingStats) {
  const container = document.getElementById("performanceCompletedCoursesSummaryContainer");
  const radioButtonsContainer = document.getElementById("radio-buttons-container");

  container.innerHTML = "";  // Clear previous content

  if (gradingStats.length > 0) {
    radioButtonsContainer.style.display = "block";  // Show radio buttons container

    // Update radio button states based on current view type
    const percentagesRadioButton = document.getElementById("viewPercentages");
    const gradesRadioButton = document.getElementById("viewGrades");

    if (currentViewType === "percentages") {
      percentagesRadioButton.checked = true;
    } else {
      gradesRadioButton.checked = true;
    }

    gradingStats.forEach((course) => {
      const courseColumn = document.createElement("div");
      courseColumn.classList.add("col-md-12", "mb-4");

      // Create chart card structure
      const chartId = `gradeCompleteChart-${course.courseId}`;
      courseColumn.innerHTML = `
        <div class="card shadow-sm" style="max-height: 500px; overflow: auto;">
          <div class="card-body" style="overflow-y: hidden;">
            <h5 class="card-title text-center" style="color:rgba(255, 99, 132, 0.8)">${course.courseName}</h5>
            <canvas id="${chartId}" class="grade-chart"></canvas>
          </div>
        </div>
      `;
      container.appendChild(courseColumn);

      // Apply styles
      const gradeChart = courseColumn.querySelector(".grade-chart");
      gradeChart.style.height = "250px";  // Set chart height
      gradeChart.style.width = "100%";    // Ensure full width

      // Set container overflow behavior
      container.style.maxHeight = "100vh";
      container.style.overflowY = "auto";

      // Create or update the chart based on the current view type
      createGradingForCompletedCoursesChart(chartId, course.gradeCategories, currentViewType);
    });
  } else {
    radioButtonsContainer.style.display = "none";  // Hide radio buttons if no completed courses
  }
}

function createGradingForCompletedCoursesChart(canvasId, gradeCategories, viewType) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;

  // Destroy the existing chart if it exists
  if (charts[canvasId]) {
    console.log('Destroying existing chart for canvasId:', canvasId);
    charts[canvasId].destroy();
  }

  // Define chart labels based on view type (grades or percentages)
  const labels = viewType === "grades"
    ? ["5", "4.0", "3.7", "3.3", "3.0", "2.7", "2.3", "2.0", "1.7", "1.3", "1.0"]
    : ["<50%", "50-55%", "55-60%", "60-65%", "65-70%", "70-75%", "75-80%", "80-85%", "85-90%", "90-95%", ">95%"];

  const xAxisLabel = viewType === "grades" ? 'Grades' : 'Percentage';

  // Log the label type for debugging
  console.log('Chart labels:', labels);

  // Create a new chart instance
  const chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{
        label: "Grade Distribution",
        data: gradeCategories.map(num => Number(num) || 0),
        backgroundColor: [
          "#D84F6B", "#FF80A1", "#FF80A1", "#FF80A1", "#FF80A1",
          "#FF80A1", "#FF80A1", "#FF80A1", "#FF80A1", "#FF80A1", "#FF80A1"
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: { stepSize: 1 },
          title: {
            display: true,
            text: 'Number of Students',
            font: {
              size: 14,
              weight: 'bold'
            }
          }
        },
        x: {
          title: {
            display: true,
            text: xAxisLabel,
            font: {
              size: 14,
              weight: 'bold'
            }
          }
        }
      },
      plugins: {
        legend: { display: false }
      }
    }
  });

  // Store the chart instance
  charts[canvasId] = chart;
}

// Export functions linked to the respective buttons for each section

function exportToPDFCourseOverview() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF('p', 'mm', 'a4'); // Portrait mode, millimeters, A4 size

  const element = document.getElementById("coursesOverviewSection");

  // scale 2 for better resolution
  html2canvas(element, { scale: 2 }).then(canvas => {
    const imgData = canvas.toDataURL("image/jpeg"); // Convert canvas to image

    const imgWidth = 190;  // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio

    doc.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
    doc.save("CoursesOverview.pdf");
  });
}

function exportToPDFAttendanceSummary() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF('p', 'mm', 'a4'); // Portrait mode, millimeters, A4 size

  const element = document.getElementById("attendanceSummaryContainer");

  // scale 2 for better resolution
  html2canvas(element, { scale: 2 }).then(canvas => {
    const imgData = canvas.toDataURL("image/jpeg"); // Convert canvas to image

    const imgWidth = 190;  // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio

    doc.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
    doc.save("AttendanceSummary-Active.pdf");
  });
}

function exportToPDFPerformanceSummary() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF('p', 'mm', 'a4'); // Portrait mode, millimeters, A4 size

  const element = document.getElementById("performanceSummaryContainer");

  // scale sets resolution
  html2canvas(element, { scale: 2 }).then(canvas => {
    const imgData = canvas.toDataURL("image/jpeg"); // Convert canvas to jpeg image (jpeg has way lower size than png)

    const imgWidth = 190;  // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio

    doc.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
    doc.save("PerformanceSummary.pdf");
  });
}
