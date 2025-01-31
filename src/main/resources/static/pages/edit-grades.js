document.addEventListener('DOMContentLoaded', () => {
    fetchActiveCourses();

    const courseDropdown = document.getElementById('activeCoursesList');
    const examDropdown = document.getElementById('examList');

    // Track selected class number
    let selectedExamIndex = 0;

    courseDropdown.addEventListener('change', () => {
        const selectedCourseId = courseDropdown.value;
        if (selectedCourseId) {
            fetchCourseDetails(selectedCourseId);
        }
    });

    examDropdown.addEventListener('change', () => {
        const selectedCourseId = courseDropdown.value;
        selectedExam = examDropdown.value;
        selectedExamIndex = parseInt(examDropdown.value, 10);  // Convert to integer
        if (selectedCourseId && selectedExamIndex >= 0) {
            fetchStudentsForCourse(selectedCourseId, selectedExamIndex);
        }
    });

    const saveButton = document.getElementById('saveButton');
          if (saveButton) {
              saveButton.addEventListener('click',  () => saveGrades(selectedExamIndex));
          }

});

// Function to fetch total no. of exams, exam names, max marks
function fetchCourseDetails(courseId) {
    const examNumbersUrl = `/api/course-settings/${courseId}/total-exams`;
    const examNamesUrl = `/api/course-settings/${courseId}/exam-names`;
    const maxMarksUrl = `/api/course-settings/${courseId}/max-marks`;

    // Fetch all course details concurrently
    Promise.all([
        fetch(examNumbersUrl).then(response => response.json()),
        fetch(examNamesUrl).then(response => response.json()),
        fetch(maxMarksUrl).then(response => response.json())
    ])
        .then(([totalExams, examNames, maxMarks]) => {
        console.log('Fetched course details:', { totalExams, examNames, maxMarks});
        // Populate the exam dropdown with the correct labels
        populateExamDropdown(totalExams, examNames);
    })
        .catch(error => console.error('Error fetching course details:', error));
}

function populateExamDropdown(totalExams, examNames) {
    const examDropdown = document.getElementById('examList');
    examDropdown.innerHTML = '<option value="">Select Exam</option>'; // Default option

    if (totalExams > 0) {
        examDropdown.disabled = false; // Enable dropdown if exams exist
    } else {
        examDropdown.disabled = true;  // Disable if no exams are available
    }
    for (let i = 0; i < totalExams; i++) {
        const option = document.createElement('option');
        option.value = i;  // Exam indices start from 0
        option.textContent = examNames[i]; // Use label
        examDropdown.appendChild(option);
    }
}

// Fetch student details for the selected course
function fetchStudentsForCourse(courseId, examIndex) {
    const url = `/api/attendance/${courseId}/students`;

    fetch(url)
        .then(response => response.json())
        .then(studentDetails => {
            // Get max marks for the selected exam
            fetch(`/api/course-settings/${courseId}/max-marks`)
                .then(response => response.json())
                .then(maxMarksArray => {
                    const maxMarks = maxMarksArray[examIndex]
                    //populateStudentTable(studentDetails, examIndex, maxMarks);
                    fetchStudentsGrades(courseId, studentDetails, examIndex, maxMarks)
                })
                .catch(error => console.error('Error fetching max marks:', error));
        })
        .catch(error => console.error('Error fetching students:', error));
}

function fetchStudentsGrades(courseId, studentDetails, examIndex, maxMarks) {
    const url = `/api/students-grades/${courseId}`;
    fetch(url)
        .then(response => response.json())
        .then(studentGrades => {
        console.log('Fetched students grades:', studentGrades);
        populateStudentTable(studentGrades, studentDetails, examIndex, maxMarks);
    })
        .catch(error => console.error('Error fetching student grades:', error));
}

// Populate the student table
function populateStudentTable(studentGrades, studentDetails, examIndex, maxMarks) {
    const tableContainer = document.getElementById('studentsTableContainer');
    const tableHead = document.getElementById('studentsTableHead'); // Table header row
    const tableBody = document.getElementById('studentsTableBody');
    const examDropdown = document.getElementById('examList');
    const selectedExamLabel = examDropdown.options[examDropdown.selectedIndex].text;

    // Clear previous table rows
    tableHead.innerHTML = '';
    tableBody.innerHTML = '';

    // Set table header with exam name
    tableHead.innerHTML = `
        <tr>
            <th>Student ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>${selectedExamLabel} (Max: ${maxMarks})</th>
        </tr>
    `;

    if (studentDetails && studentDetails.length > 0) {
        studentDetails.forEach(student => {
            // Find student grade from fetched studentGrades
            const studentGrade = studentGrades.find(grade => grade.studentId === student.studentId);
            // Determine correct exam column dynamically
            const examColumn = `exam${parseInt(examIndex + 1)}Grades`;

            // Debugging Output
            console.log(`Student ID: ${student.studentId}`);
            console.log(`Found Student Grade:`, studentGrade);
            console.log(`Exam Column: ${examColumn}`);

            let studentMarks = studentGrade[examColumn];

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.studentId}</td>
                <td>${student.firstName}</td>
                <td>${student.lastName}</td>
                <td>
                    <input type="number" min="0" max="${maxMarks}" class="grade-input"
                           data-student-id="${student.studentId}" data-original-value="${studentMarks}" value="${studentMarks}"
                           oninput="validateGradeInput(this, ${maxMarks})"/>
                </td>
            `;
            tableBody.appendChild(row);
        });

        tableContainer.style.display = 'block'; // Show table
    } else {
        console.warn('No students found for the selected course.');
        tableContainer.style.display = 'none'; // Hide table
    }
}


function validateGradeInput(input, maxMarks) {
    let value = input.value.trim(); // Get trimmed input value

    // Remove any non-numeric characters except digits
    value = value.replace(/[^0-9]/g, '');

    // Allow empty input for backspacing
    if (value === '') {
        input.value = '';
        return;
    }

    // Convert to integer and check range
    let numValue = parseInt(value, 10);

    if (isNaN(numValue) || numValue < 0) {
        input.value = ''; // Allow empty input for backspacing
    } else if (numValue > maxMarks) {
        input.value = maxMarks; // Restrict to max value
    } else {
        input.value = numValue; // Remove leading zeros
    }
}


function saveGrades(selectedExamIndex) {
    const courseId = document.getElementById('activeCoursesList').value;
    const gradeInputs = document.querySelectorAll('.grade-input');
    console.log("exam idx", selectedExamIndex);
    const gradeData = [];

    gradeInputs.forEach(input => {
        const studentId = input.getAttribute('data-student-id');
        const originalValue = input.getAttribute('data-original-value'); // Store original value
        let newValue = input.value;

        // Only add to gradeData if there's a change
        if (newValue !== originalValue) {
            gradeData.push({
                studentId: studentId,
                courseId: courseId,
                [`exam${selectedExamIndex + 1}Grades`]: newValue // Default to 0 if no grade
            });
        }
    });

    // If no changes, return early
    if (gradeData.length === 0) {
        console.log('No changes detected, skipping update.');
        alert('No grade changes to save.');
        return;
    }

    // Send only the changed records
    fetch(`/api/students-grades/${courseId}/exam/${selectedExamIndex + 1}/update`, {
        method: 'PATCH', // Use PATCH to update only changed records
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(gradeData)
    })
    .then(response => response.text()) // Read as text first
    .then(text => {
        try {
            return JSON.parse(text); // Try parsing JSON
        } catch {
            return { message: text }; // If not JSON, wrap it in an object
        }
    })
    .then(result => {
        console.log('Grades saved successfully:', result.message);
        alert(result.message);
    })
    .catch(error => {
        console.error('Error saving grades:', error);
        alert('Failed to save grades. Please try again.');
    });
}





