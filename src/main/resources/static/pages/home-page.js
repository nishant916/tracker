document.addEventListener('DOMContentLoaded', () => {
  fetchAllCourses();
  createStudentsAcrossCoursesCharts();
  makeAttendanceChart();
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
              beginAtZero: true, // Ensure the X-axis starts at 0
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
          <div class="col-md-6 mb-4">
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
                <h6 class="mt-4 text-danger">Students Below Minimum Attendance (${(minAttendance * 100).toFixed(
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
            studentList.innerHTML = ""; // Clear the "Loading..." text
            console.log("Fetched students list: ", students);

            if (students.length === 0) {
              studentList.innerHTML = "<li class='list-group-item'>No students below minimum attendance.</li>";
              return;
            }

            students.forEach((student) => {
              const { firstName, lastName, attendancePercentage } = student;

              // Combine firstName, lastName, and attendance percentage
              const studentItem = `
                <li class="list-group-item">
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
