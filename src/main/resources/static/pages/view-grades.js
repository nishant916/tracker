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

// Function to check if a selected course is active
function isCourseActive(courseId) {
    const activeCourses = JSON.parse(localStorage.getItem('activeCourses')) || [];
    const isActive = activeCourses.some(course => course.courseId == courseId);
    return isActive;
}


// Fetch student details for the selected course
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

//add student headers and populate the student table with studentId, firstName & lastName
function populateStudentTable(studentDetails, courseId) {
    const tableContainer = document.getElementById('studentsTableContainer');
    const table = document.getElementById('view-grades-table');
    const tableHead = table.querySelector('thead');
    const tableBody = document.getElementById('studentsTableBody');

    // Clear previous table rows and headers
    tableHead.innerHTML = '';
    tableBody.innerHTML = '';

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
        fetchCourseDetails(courseId);
    } else {
        console.warn('No students found for the selected course.');
        tableContainer.style.display = 'none'; // Hide the table if no students
    }
}

// Function to fetch total no. of exams, exam names, max marks, and weightages
function fetchCourseDetails(courseId) {
    const examNumbersUrl = `/api/course-settings/${courseId}/total-exams`;
    const examNamesUrl = `/api/course-settings/${courseId}/exam-names`;
    const maxMarksUrl = `/api/course-settings/${courseId}/max-marks`;
    const weightagesUrl = `/api/course-settings/${courseId}/weightages`;

    // Fetch all course details concurrently
    Promise.all([
        fetch(examNumbersUrl).then(response => response.json()),
        fetch(examNamesUrl).then(response => response.json()),
        fetch(maxMarksUrl).then(response => response.json()),
        fetch(weightagesUrl).then(response => response.json())
    ])
        .then(([totalExams, examNames, maxMarks, weightages]) => {
        console.log('Fetched course details:', { totalExams, examNames, maxMarks, weightages });
        addTableHeaders(courseId, totalExams, examNames, maxMarks, weightages);
        fetchStudentsGrades(courseId, totalExams, examNames, maxMarks, weightages); // Fetch grades after course details
    })
        .catch(error => console.error('Error fetching course details:', error));
}

function addTableHeaders(courseId, totalExams, examNames, maxMarks, weightages) {
    const table = document.getElementById('view-grades-table');
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

    // Add dynamic headers for each exam
    for (let i = 0; i < totalExams; i++) {
        const classHeader = document.createElement('th');
        classHeader.scope = 'col';
        let percentage = Math.round(weightages[i] * 100);

        // Use innerHTML with span for styling
        classHeader.innerHTML = `
        ${examNames[i]}<br>
        <span style="font-size: 0.8em; color: grey; font-weight: normal;">
            ?/${maxMarks[i]} (${percentage}%)
        </span>
    `;

        headerRow.appendChild(classHeader);
    }

     console.log(`isCourseActive(${courseId}) =`, isCourseActive(courseId));
     if (!isCourseActive(courseId)) {
        console.log(`Adding Final Grade column for course ${courseId} (Inactive Course)`);
        // Add a header for the Final Grade column
        const finalGradeHeader = document.createElement('th');
        finalGradeHeader.scope = 'col';
        finalGradeHeader.textContent = 'Final Grade';
        headerRow.appendChild(finalGradeHeader);
    }  else {
              console.log(`Skipping Final Grade column for course ${courseId} (Active Course)`);
              }
}

function fetchStudentsGrades(courseId, totalExams, examNames, maxMarks, weightages) {
    const url = `/api/students-grades/${courseId}`;
    fetch(url)
        .then(response => response.json())
        .then(studentGrades => {
        console.log('Fetched students grades:', studentGrades);
        calculateFinalGrade(studentGrades,courseId, totalExams, examNames, maxMarks, weightages);
    })
        .catch(error => console.error('Error fetching student grades:', error));
}

function calculateFinalGrade(studentGrades, courseId, totalExams, examNames, maxMarks, weightages) {
        const finalGrades = studentGrades.map(student => {
            let weightedTotal = 0;
            let totalWeight = 0;

            for (let i = 0; i < totalExams; i++) {
                const examKey = `exam${i + 1}Grades`; // Construct the exam key dynamically
                const studentScore = student[examKey];

                if (studentScore !== undefined && studentScore !== null) {
                    weightedTotal += (studentScore / maxMarks[i]) * weightages[i]; // Convert to percentage and apply weight
                    totalWeight += weightages[i]; // Keep track of total weight
                }
            }

            const finalGrade = totalWeight > 0 ? (weightedTotal / totalWeight) * 100 : 0; // Normalize to percentage

            return {
                studentId: student.studentId,
                finalGrade: finalGrade.toFixed(2) // Round to 2 decimal places
            };
        });

        console.log('Calculated Final Grades:', finalGrades);
        populateGrades(totalExams, studentGrades, finalGrades, courseId);
    }

function populateGrades(totalExams, studentGrades, finalGrades, courseId) {
    const tableBody = document.getElementById('studentsTableBody');

    // Check if tableBody exists
    if (!tableBody) {
        console.error('Table body not found in the DOM.');
        return;
    }

    studentGrades.forEach(student => {
        const row = Array.from(tableBody.children).find(
            (tr) => tr.children[0].textContent === student.studentId.toString()
        );

        if (row) {
            // Add grade cells for each exam
            for (let i = 1; i <= totalExams; i++) {
                const cell = document.createElement('td');
                const examGradeKey = `exam${i}Grades`; // Dynamically generate the key
                cell.textContent = student[examGradeKey] !== undefined ? student[examGradeKey] : 'N/A'; // Handle missing keys
                row.appendChild(cell);
            }

             if (!isCourseActive(courseId)) {
                // Find the corresponding final grade for this student
                const finalGradeObj = finalGrades.find(fg => fg.studentId === student.studentId);
                const finalGradeCell = document.createElement('td');
                finalGradeCell.textContent = finalGradeObj ? `${finalGradeObj.finalGrade}%` : 'N/A';
                row.appendChild(finalGradeCell);
            }
        }
    });
    document.getElementById('exportBtn').disabled = false;

}
