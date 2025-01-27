
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
        populateStudentTable(studentDetails);
    })
        .catch(error => console.error('Error fetching students:', error));
}

// Function to populate the student table
function populateStudentTable(studentDetails) {
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
        addTableHeaders(totalClasses, studentAttendance);
    })
        .catch(error => console.error('Error fetching students:', error));
}

//add headers class1, class2, ...
function addTableHeaders(totalClasses, studentAttendance) {
    const tableContainer = document.getElementById('studentsTableContainer');
    const table = tableContainer.querySelector('view-attendance-table');
    const tableHead = table.querySelector('thead');
    const tableBody = table.querySelector('tbody');
    const headerRow = document.createElement('tr');

    // Clear previous table rows
    tableBody.innerHTML = '';
    tableHead.innerHTML = '';


    for (let i = 1; i <= totalClasses; i++) {
        const classHeader = document.createElement('th');
        classHeader.scope = 'col';
        classHeader.textContent = `Class ${i}`;
        headerRow.appendChild(classHeader);
    }

    tableHead.appendChild(headerRow);

//    if (studentAttendance && studentAttendance.length > 0) {
//        studentAttendance.forEach(student => {

            // Create cells for each class attendance
//            for (let i = 1; i <= totalClasses; i++) {
//                const attendanceCell = document.createElement('td');
//                attendanceCell.textContent = student.attendance && student.attendance[i - 1] ? 'Present' : 'Absent';
//                row.appendChild(attendanceCell);
//            }

            // Append the row to the table body
//            tableBody.appendChild(row);
//        });

        // Make the table visible if it has data
//        document.getElementById('studentsTableContainer').style.display = 'block';
//    } else {
//        console.warn('No students found for the selected course.');
//        document.getElementById('studentsTableContainer').style.display = 'none'; // Hide the table if no students
//    }
}










