document.addEventListener('DOMContentLoaded', () => {
    // Redirect to login page if not logged in
    if (!teacherId) {
        window.location.href = "../index.html";
    }
    else {
        const courseDropdown = document.getElementById('CoursesList');
        document.getElementById('exportBtn').disabled = true;
        courseDropdown.addEventListener('change', () => {
            const selectedCourseId = courseDropdown.value;
            if (selectedCourseId) {
                fetchStudentsForCourse(selectedCourseId);
            }
        });
    }
});

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
    const table = document.getElementById('view-attendance-table');
    const tableHead = table.querySelector('thead');

    // Clear previous table rows
    tableBody.innerHTML = '';
    tableHead.innerHTML = '';

    // Create the header row
    const headerRow = document.createElement('tr');
    const headers = ['Student ID', 'First Name', 'Last Name'];

    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.scope = 'col';
        th.textContent = headerText;
        headerRow.appendChild(th);
    });

    tableHead.appendChild(headerRow); // Append headers to the table head


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
    document.getElementById('exportBtn').disabled = false;
}

