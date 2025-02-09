document.addEventListener('DOMContentLoaded', () => {
  // Redirect to login page if not logged in
  if (!teacherId) {
      window.location.href = "../index.html";
  }
  else {
      fetchActiveCourses();

      const courseDropdown = document.getElementById('activeCoursesList');
      const classDropdown = document.getElementById('classNumberList');
      const tableContainer = document.getElementById('studentsTableContainer'); // Table container reference

      // Track selected class number
      let selectedClassNumber = null;

      // Initially hide the table until a course and class are selected
      tableContainer.style.display = 'none';

      courseDropdown.addEventListener('change', () => {
        const selectedCourseId = courseDropdown.value;
        if (selectedCourseId) {
          fetchClassNumbers(selectedCourseId);
          // Hide the table when course is changed
          tableContainer.style.display = 'none';
          classDropdown.value = ""; // Reset class dropdown
        }
      });

    // added for fetching students of a particular course
      classDropdown.addEventListener('change', () => {
        const selectedCourseId = document.getElementById('activeCoursesList').value;
        selectedClassNumber = classDropdown.value;

        if (selectedCourseId && selectedClassNumber) {
          fetchStudentsForCourse(selectedCourseId, selectedClassNumber);
        } else {
          // Hide table if no class is selected
          tableContainer.style.display = 'none';
        }
      });

      const saveButton = document.getElementById('saveButton');
      if (saveButton) {
          saveButton.addEventListener('click',  () => saveAttendance(selectedClassNumber));
      }
  }

});

// Override the updateActiveCourseList function to add filtering logic
function updateActiveCourseList(courses) {
  const filteredCourses = courses.filter(course => course.isAttendanceEnabled);

  const courseSelect = document.getElementById('activeCoursesList');
  courseSelect.innerHTML = '<option selected disabled>select course</option>'; // Clear existing options

  // Populate the dropdown with the filtered courses
  filteredCourses.forEach(c => {
    const option = document.createElement('option');
    option.value = c.courseId;
    option.textContent = c.course;
    courseSelect.appendChild(option);
  });

  courseSelect.disabled = false;
}

// Function to fetch total classes for the selected course
function fetchClassNumbers(courseId) {
  const url = `/api/course-settings/${courseId}/total-classes`;

  fetch(url)
    .then(response => response.json())
    .then(data => {

      populateClassList(data);
    })
    .catch(error => console.error('Error fetching total classes:', error));
}

function populateClassList(totalClasses) {

  const classDropdown = document.getElementById('classNumberList');
  classDropdown.innerHTML = '<option selected disabled>Select class number</option>'; // Clear existing options

  if (totalClasses > 0) {
    for (let i = 1; i <= totalClasses; i++) {
      const option = document.createElement('option');
      option.value = i;
      option.textContent = `Class ${i}`;
      classDropdown.appendChild(option);
    }
    classDropdown.disabled = false;
    } else {
    // In case the totalClasses is 0 or undefined
    console.error('Total classes value is invalid');
    classDropdown.disabled = true;
  }
}

//fetch student details for the selected course
function fetchStudentsForCourse(courseId, selectedClassNumber) {
    const url = `/api/attendance/${courseId}/students`;

    fetch(url)
        .then(response => response.json())
        .then(studentDetails => {

        fetchStudentsAttendance(courseId, studentDetails, selectedClassNumber);

    })
        .catch(error => console.error('Error fetching students:', error));
}

function fetchStudentsAttendance(courseId, studentDetails, selectedClassNumber) {
    const url = `/api/students-attendance/${courseId}`;

    fetch(url)
        .then(response => response.json())
        .then(studentAttendance => {

        // Call populateStudentTable with attendance data
        populateStudentTable(studentDetails, studentAttendance, selectedClassNumber);
    })
        .catch(error => console.error('Error fetching students:', error));
}

// Function to populate the student table with studentId, firstName & lastName
function populateStudentTable(studentDetails, studentAttendance, selectedClassNumber) {
    const tableContainer = document.getElementById('studentsTableContainer');
    const tableHead = document.getElementById('studentsTableHead');
    const tableBody = document.getElementById('studentsTableBody');

    // Clear previous table rows and headers
    tableHead.innerHTML = `
        <tr>
            <th>Student ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Class ${selectedClassNumber}</th>
        </tr>
    `;
    tableBody.innerHTML = '';

    if (studentDetails && studentDetails.length > 0) {
        studentDetails.forEach(student => {
            const attendanceRecord = studentAttendance.find(att => att.studentId === student.studentId);
            const attendanceValue = attendanceRecord ? attendanceRecord[`class${selectedClassNumber}`] : "N/A";

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.studentId}</td>
                <td>${student.firstName}</td>
                <td>${student.lastName}</td>
                <td>
                    <select class="attendance-dropdown" data-student-id="${student.studentId}" data-class="${selectedClassNumber}" data-original-value="${attendanceValue}">
                        ${generateDropdownOptions(attendanceValue)}
                    </select>
                </td>
            `;


            tableBody.appendChild(row);
        });

        tableContainer.style.display = 'block';
    } else {
        console.warn('No students found for the selected course.');
        tableContainer.style.display = 'none';
    }
}

function generateDropdownOptions(attendanceValue) {
    const options = ["Present", "Absent", "Late"];

    if (attendanceValue === "N/A") {
        return `
            <option value="" selected>Select</option>
            ${options.map(opt => `<option value="${opt.toLowerCase()}">${opt}</option>`).join("")}
        `;
    } else {
        return options.map(opt => `
            <option value="${opt.toLowerCase()}" ${attendanceValue.toLowerCase() === opt.toLowerCase() ? 'selected' : ''}>
                ${opt}
            </option>
        `).join("");
    }
}

function saveAttendance(selectedClassNumber) {
    const courseId = document.getElementById('activeCoursesList').value;
    const dropdowns = document.querySelectorAll('.attendance-dropdown');

    const attendanceData = [];

    dropdowns.forEach(dropdown => {
        const studentId = dropdown.getAttribute('data-student-id');
        const originalValue = dropdown.getAttribute('data-original-value'); // Store original value
        let newValue = dropdown.value;
        const alertContainer = document.getElementById('alertContainer');

        // Only add to attendanceData if there's a change
        if (newValue !== originalValue) {
            attendanceData.push({
                studentId: studentId,
                courseId: courseId,
                [`class${selectedClassNumber}`]: newValue || "N/A" // Ensure "N/A" remains if no selection is made
            });
        }
    });

    // If no changes, return early
    if (attendanceData.length === 0) {
        console.log('No changes detected, skipping update.');
        showAlert('No attendance changes to save.', 'danger');
        return;
    }

    // Send only the changed records
    fetch(`/api/students-attendance/${courseId}/class/${selectedClassNumber}/update`, {
        method: 'PATCH', // Use PATCH instead of PUT
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(attendanceData)
    })
    .then(response => response.text())  // Read as text first
    .then(text => {
        try {
            return JSON.parse(text);  // Try parsing JSON
        } catch {
            return { message: text };  // If not JSON, wrap it in an object
        }
    })
    .then(result => {
        console.log('Attendance saved successfully:', result.message);
        showAlert(result.message, 'success');
    })
    .catch(error => {
        console.error('Error saving attendance:', error);
        showAlert('Server error. Please try again later.', 'warning');
    });
}



