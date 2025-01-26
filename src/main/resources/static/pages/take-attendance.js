
document.addEventListener('DOMContentLoaded', () => {
  fetchActiveCourses();

  const courseDropdown = document.getElementById('activeCoursesList');
  const classDropdown = document.getElementById('classNumberList');

  courseDropdown.addEventListener('change', () => {
    const selectedCourseId = courseDropdown.value;
    if (selectedCourseId) {
      fetchClassNumbers(selectedCourseId);
    }
  });

// added for fetching students of a particular course
  classDropdown.addEventListener('change', () => {
    const selectedCourseId = document.getElementById('activeCoursesList').value;
    const selectedClassNumber = classDropdown.value;

    if (selectedCourseId && selectedClassNumber) {
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

// Function to fetch total classes for the selected course
function fetchClassNumbers(courseId) {
  const url = `/api/course-settings/${courseId}/total-classes`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      console.log('Fetched total classes:', data);
      populateClassList(data);
    })
    .catch(error => console.error('Error fetching total classes:', error));
}

function populateClassList(totalClasses) {
  console.log('Populating class list for totalClasses:', totalClasses); // Check if the value is correct
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
    // Update dropdown visibility and scrolling behavior
    const dropdownHeight = dropdown.scrollHeight;
    const visibleHeight = window.innerHeight * 0.4;
    if (dropdownHeight > visibleHeight) {
        dropdown.style.maxHeight = `${visibleHeight}px`;
        dropdown.style.overflowY = 'auto';
    } else {
        dropdown.style.maxHeight = 'none';
        dropdown.style.overflowY = 'visible';
    }

    // Check if the dropdown is overflowing the screen
    const rect = classDropdown.getBoundingClientRect();
    if (rect.bottom + dropdownHeight > window.innerHeight) {
    // Scroll the page down to make room for the dropdown
        window.scrollBy(0, rect.bottom + dropdownHeight - window.innerHeight);
    }

    classWrapper.classList.add('open');
    } else {
    // In case the totalClasses is 0 or undefined
    console.error('Total classes value is invalid');
    classDropdown.disabled = true;
  }
}

// Function to fetch students for the selected course
function fetchStudentsForCourse(courseId) {
  const url = `/api/attendance/${courseId}/students`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      console.log('Fetched students:', data);
      populateStudentTable(data);
    })
    .catch(error => console.error('Error fetching students:', error));
}


// Function to populate the student table
function populateStudentTable(students) {
  const tableContainer = document.getElementById('studentsTableContainer');
  const tableBody = document.getElementById('studentsTableBody');

  // Clear previous table rows
  tableBody.innerHTML = '';

  if (students && students.length > 0) {
    students.forEach(student => {
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


