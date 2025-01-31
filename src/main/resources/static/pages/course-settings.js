document.addEventListener('DOMContentLoaded', () => {
  
  // Generating exam fields on load
  generateExamFields();

  // Disable fields on load
  disableFields();

  // Fetch courses on page load
  fetchCourses();

  // Event listeners for radio buttons
  document.getElementById('activeCourses').addEventListener('change', fetchCourses);
  document.getElementById('allCourses').addEventListener('change', fetchCourses);

  // Event listener for course selection change
  document.getElementById('courseSelect').addEventListener('change', handleCourseSelection);

  // Event listener for course active checkbox change
  document.getElementById('isCourseActive').addEventListener('change', toggleLabel);
  
  // Event listener for the submit button to save the changes
  //document.getElementById('saveButton').addEventListener('click', saveCheck);
  document.getElementById('saveButton').addEventListener('click', handleSubmit);

  handleNumOfExamsChange();
});

function generateExamFields() {
  const examFieldsContainer = document.getElementById('examFields');
  for (let i = 1; i <= 10; i++) {
    const examFieldHTML = `
      <div class="exam-field d-flex align-items-center mb-3 gap-3">
        <div class="exam-field-group">
          <label for="exam${i}_label" class="form-label">Exam ${i} Name</label>
          <input type="text" id="exam${i}_label" class="form-control">
        </div>
        <div class="exam-field-group">
          <label for="exam${i}_mm" class="form-label">Maximum Marks</label>
          <input type="number" id="exam${i}_mm" class="form-control" min="0" step="1">
        </div>
        <div class="exam-field-group">
          <label for="exam${i}_weightage" class="form-label">Weightage% (in decimal)</label>
          <select id="exam${i}_weightage" class="form-select">
            <option value="" disabled selected>please select</option>
            <option value="0">0%</option>
            <option value="0.1">10%</option>
            <option value="0.2">20%</option>
            <option value="0.3">30%</option>
            <option value="0.4">40%</option>
            <option value="0.5">50%</option>
            <option value="0.6">60%</option>
            <option value="0.7">70%</option>
            <option value="0.8">80%</option>
            <option value="0.9">90%</option>
            <option value="1">100%</option>
          </select>
        </div>
      </div>
    `;
    examFieldsContainer.insertAdjacentHTML('beforeend', examFieldHTML);
  }
}


function fetchCourses() {

  // Fetch all courses once
  const url = `/api/course-settings/${teacherId}`;

  fetch(url)
    .then(response => response.json())
    .then(courses => {
      console.log('Fetched courses:', courses);
      updateCourseList(courses); // Populate dropdown
    })
    .catch(error => console.error('Error fetching courses:', error));
}

function updateCourseList(courses) {
  document.getElementById('username').textContent = courses[0].username;
  const isActive = document.getElementById('activeCourses').checked;
  const courseSelect = document.getElementById('courseSelect');
  courseSelect.innerHTML = '<option selected disabled>select course</option>'; // Clear existing options

  // Filter courses based on the selected radio button
  const filteredCourses = courses.filter(c => isActive ? c.isCourseActive : true);

  // Debugging the filtered courses
  console.log('Filtered Courses:', filteredCourses);

  filteredCourses.forEach(c => {
    console.log('Course:', c); // Debugging each course object
    const option = document.createElement('option');
    option.value = c.courseId;
    option.textContent = c.course;
    courseSelect.appendChild(option);
  });

  courseSelect.disabled = false;
}

function handleCourseSelection() {
  const courseId = document.getElementById('courseSelect').value;
  console.log('courseSelectValue:', courseId);
  if (courseId) {
    // Fetch data for selected course (attendance settings, grading, exams)
    fetchCourseDetails(courseId);
  } else {
    disableFields();
  }
}

function fetchCourseDetails(courseId) {
  fetch(`/api/course-settings/${teacherId}/${courseId}`)
    .then(response => response.json())
    .then(data => {
      // Populate fields with the fetched data
      console.log('Fetched data:', data);
      populateFields(data);
    })
    .catch(error => console.error('Error fetching course details:', error));
}

function populateFields(data) {
  console.log('Populating fields with data:', data);

  // Populate common course details
  document.getElementById('isCourseActive').checked = data.isCourseActive;
  document.getElementById('enableAttendance').checked = data.isAttendanceEnabled;
  document.getElementById('totalClasses').value = data.totalClasses || '';
  document.getElementById('minAttendance').value = data.minAttendance || '';
  document.getElementById('numOfExams').value = data.numOfExams;

  // Populate exam fields with backend-provided variables
  for (let i = 1; i <= 10; i++) {
    const examLabel = document.getElementById(`exam${i}_label`);
    const examMaxMarks = document.getElementById(`exam${i}_mm`);
    const examWeightage = document.getElementById(`exam${i}_weightage`);
    
    // Set the values from backend data
    examLabel.value = data[`exam${i}Label`] || '';      
    examMaxMarks.value = data[`exam${i}MaxMarks`] || '';           
    examWeightage.value = data[`exam${i}Weightage`] || ''; 

    // Disable exams that should not be used based on numOfExams
    if (i > data.numOfExams) {
      examLabel.disabled = true;
      examMaxMarks.disabled = true;
      examWeightage.disabled = true;
    } else {
      examLabel.disabled = false;
      examMaxMarks.disabled = false;
      examWeightage.disabled = false;
    }
  }

  enableFields(); // Enable other form fields
  // Adjust fields based on numOfExams selection
  handleNumOfExamsChange();
}


// Enable/disable exam fields based on the selected number of exams
function handleNumOfExamsChange() {
  const numOfExams = parseInt(document.getElementById('numOfExams').value, 10);
  const examFields = document.querySelectorAll('#examFields .exam-field');

  examFields.forEach((field, index) => {
    const inputs = field.querySelectorAll('input');
    const select = field.querySelector('select');

    if (index < numOfExams) {
      inputs.forEach(input => (input.disabled = false)); // Enable input fields
      if (select) select.disabled = false; // Enable select dropdown
    } else {
      inputs.forEach(input => {
        input.value = ""; // Clear input field values
        input.disabled = true; // Disable input fields
      });
      if (select) {
        select.value = "0"; // Set dropdown to 0%
        select.disabled = true; // Disable select dropdown
      }
    }
  });
}

function enableFields() {
  document.getElementById('isCourseActive').disabled = false;
  toggleLabel();
  document.getElementById('enableAttendance').disabled = false;
  document.getElementById('totalClasses').disabled = false;
  document.getElementById('minAttendance').disabled = false;
  document.getElementById('numOfExams').disabled = false;
  document.querySelector('button[type="submit"]').disabled = false;
}

function disableFields() {
  document.getElementById('isCourseActive').disabled = true;
  document.getElementById('enableAttendance').disabled = true;
  document.getElementById('totalClasses').disabled = true;
  document.getElementById('minAttendance').disabled = true;
  document.getElementById('numOfExams').disabled = true;
  document.querySelector('button[type="submit"]').disabled = true;
}

// Toggle course active label based on selection
function toggleLabel() {
    const courseActiveCheckbox = document.getElementById('isCourseActive');
    const courseActiveLabel = document.getElementById('isCourseActiveLabel');
    courseActiveLabel.textContent = courseActiveCheckbox.checked ? 'Course is active' : 'Course is inactive';
  }

// Handle submit button click to update the course settings
function handleSubmit(event) {
  event.preventDefault(); // Prevent default form submission

  const courseId = document.getElementById('courseSelect').value;
  const data = {
    teacherId: teacherId,
    courseId: parseInt(courseId),
    course: document.getElementById('courseSelect').selectedOptions[0].textContent,
    username: document.getElementById('username').textContent,
    totalClasses: parseInt(document.getElementById('totalClasses').value || 10,10), //convert to int
    minAttendance: parseFloat(document.getElementById('minAttendance').value || 0.75), //convert to float
    isCourseActive: document.getElementById('isCourseActive').checked,
    isAttendanceEnabled: document.getElementById('enableAttendance').checked || false,
    numOfExams: parseInt(document.getElementById('numOfExams').value,10) //convert to int
  };

  // Add exam data to the update object
  for (let i = 1; i <= 10; i++) {
    data[`exam${i}Label`] = document.getElementById(`exam${i}_label`).value || `Exam ${i}`;
    data[`exam${i}MaxMarks`] = parseInt(document.getElementById(`exam${i}_mm`).value || 0,10); //convert to int
    data[`exam${i}Weightage`] = parseFloat(document.getElementById(`exam${i}_weightage`).value || 0); //convert to float
  }

  // Send the updated data to the backend
  if (courseId) {
    updateCourseSettings(courseId, data);
  }
}

// Update course settings on the backend
function updateCourseSettings(courseId, data) {
  fetch(`/api/course-settings/${teacherId}/${courseId}/update`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(updatedData => {
      console.log('Updated course settings:', updatedData);
    })
    .catch(error => console.error('Error updating course settings:', error));
}


/*// TO BE DELETED LATER:
function saveCheck(event) {
  event.preventDefault(); // Prevent default form submission

  const courseId = document.getElementById('courseSelect').value;
  const data = {
    teacherId: teacherId,
    courseId: parseInt(courseId),
    course: document.getElementById('courseSelect').selectedOptions[0].textContent,
    username: document.getElementById('username').textContent,
    totalClasses: parseInt(document.getElementById('totalClasses').value || 10,10), //convert to int
    minAttendance: parseFloat(document.getElementById('minAttendance').value || 0.75), //convert to float
    isCourseActive: document.getElementById('isCourseActive').checked,
    enableAttendance: document.getElementById('enableAttendance').checked,
    numOfExams: parseInt(document.getElementById('numOfExams').value,10) //convert to int
  };

  // Add exam data to the update object
  for (let i = 1; i <= 10; i++) {
    data[`exam${i}Label`] = document.getElementById(`exam${i}_label`).value || '';
    data[`exam${i}MaxMarks`] = parseInt(document.getElementById(`exam${i}_mm`).value || 0,10); //convert to int
    data[`exam${i}Weightage`] = parseFloat(document.getElementById(`exam${i}_weightage`).value || 0);
  }

  console.log('Data being sent to backend: ', data);
}*/
