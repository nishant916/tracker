
document.addEventListener('DOMContentLoaded', () => {
    fetchActiveCourses();

    const courseDropdown = document.getElementById('activeCoursesList');
    const classDropdown = document.getElementById('classNumberList');

    courseDropdown.addEventListener('change', () => {
        const selectedCourseId = courseDropdown.value;
        if (selectedCourseId) {
            fetchStudentsForCourse(selectedCourseId);
        }
    });
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

//fetch student details for the selected course
function fetchStudentsForCourse(courseId) {
    const url = `/api/attendance/${courseId}/students`;

    fetch(url)
        .then(response => response.json())
        .then(studentDetails => {
        console.log('Fetched students details:', studentDetails);
        populateStudentTable(studentDetails, courseId);
    })
        .catch(error => console.error('Error fetching students:', error));
}

// Function to populate the student table with studentId, firstName & lastName
function populateStudentTable(studentDetails, courseId) {
    const tableContainer = document.getElementById('studentsTableContainer');
    const tableBody = document.getElementById('studentsTableBody');

    // Clear previous table rows
    tableBody.innerHTML = '';

    if (studentDetails && studentDetails.length > 0) {
        studentDetails.forEach(student => {
            const row = document.createElement('tr');
            row.innerHTML = `
        <td>${student.studentId}</td>
        <td>${student.firstName}</td>
        <td>${student.lastName}</td>
      `;
            tableBody.appendChild(row);
        });

        tableContainer.style.display = 'block'; // Make the table visible
        fetchClassNumbers(courseId);
    } else {
        console.warn('No students found for the selected course.');
        tableContainer.style.display = 'none'; // Hide the table if no students
    }
}

// Function to fetch total classes for the selected course
function fetchClassNumbers(courseId) {
    const url = `/api/course-settings/${courseId}/total-classes`;

    fetch(url)
        .then(response => response.json())
        .then(totalClasses => {
        console.log('Fetched total classes:', totalClasses);
        fetchStudentsAttendance(courseId, totalClasses);
    })
        .catch(error => console.error('Error fetching total classes:', error));
}

function fetchStudentsAttendance(courseId, totalClasses) {
    const url = `/api/students-attendance/${courseId}`;

    fetch(url)
        .then(response => response.json())
        .then(studentAttendance => {
        console.log('Fetched students attendance:', studentAttendance);
        addTableHeadersAndPopulateAttendance(totalClasses, studentAttendance);
    })
        .catch(error => console.error('Error fetching students:', error));
}

// Add the class headers (Class 1, Class 2, Class 3 ...) & then populate the attendance information
function addTableHeadersAndPopulateAttendance(totalClasses, studentAttendance) {
    const table = document.getElementById('view-attendance-table');
    const tableHead = table.querySelector('thead');
    const tableBody = document.getElementById('studentsTableBody');

    // Check if tableHead and tableBody exist
    if (!tableHead || !tableBody) {
        console.error('Table head or body not found in the DOM.');
        return;
    }

    // Clear previous dynamic columns (keep static columns intact)
    const staticColumnsCount = 3; // Static columns: Student ID, First Name, Last Name
    const headerRow = tableHead.querySelector('tr');
    while (headerRow.children.length > staticColumnsCount) {
        headerRow.removeChild(headerRow.lastChild);
    }

    // Add dynamic headers for each class
    for (let i = 1; i <= totalClasses; i++) {
        const classHeader = document.createElement('th');
        classHeader.scope = 'col';
        classHeader.textContent = `Class ${i}`;
        headerRow.appendChild(classHeader);
    }

    // Populate attendance data into rows
    studentAttendance.forEach(student => {
        const row = Array.from(tableBody.children).find(
            (tr) => tr.children[0].textContent === student.studentId.toString()
        );

        if (row) {
            // Add attendance cells for each class
            for (let i = 1; i <= totalClasses; i++) {
                const attendanceCell = document.createElement('td');
                const attendanceKey = `class${i}`; // Assuming class1, class2, ...
                const attendanceValue = student[attendanceKey] || 'N/A'; // Default to 'N/A' if data is missing

                // Set text content for the attendance cell
                attendanceCell.textContent = attendanceValue;

                // Apply background color based on attendance value
                switch (attendanceValue) {
                    case 'absent':
                        attendanceCell.style.backgroundColor = '#ffcccc'; // Light red for absent
                        break;
                    case 'late':
                        attendanceCell.style.backgroundColor = '#ffffcc'; // Light yellow for late
                        break;
                    case 'present':
                        attendanceCell.style.backgroundColor = '#ccffcc'; // Light green for present
                        break;
                    default:
                        attendanceCell.style.backgroundColor = '#f8f9fa'; // Default background for 'N/A'
                        break;
                }

                row.appendChild(attendanceCell);
            }
        } else {
            console.warn(`Row not found for student ID: ${student.studentId}`);
        }
    });
}

