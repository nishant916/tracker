document.addEventListener('DOMContentLoaded', () => {
  // Fetch active courses on page load
  fetchActiveCourses();
});

// Functions to fetch list of active courses & their details from backend
function fetchActiveCourses() {

  // Fetch a list of objects of active courses with details
  const url = `/api/course-settings/${teacherId}/active-courses`;

  fetch(url)
    .then(response => response.json())
    .then(courses => {
      console.log('Fetched active courses:', courses);
      updateActiveCourseList(courses); // Populate dropdown
    })
    .catch(error => console.error('Error fetching courses:', error));
}

function updateActiveCourseList(courses) {
  document.getElementById('username').textContent = courses[0].username;
  const courseSelect = document.getElementById('activeCoursesList');
  courseSelect.innerHTML = '<option selected disabled>select course</option>'; // Clear existing options

  courses.forEach(c => {
    const option = document.createElement('option');
    option.value = c.courseId;
    option.textContent = c.course;
    courseSelect.appendChild(option);
  });

  courseSelect.disabled = false;
}

// Function to display Bootstrap alerts
function showAlert(message, type) {
    const alertContainer = document.getElementById('alertContainer');

    const alertHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`;

    alertContainer.innerHTML = alertHTML;

    // Automatically hide the alert after 3 seconds
    setTimeout(() => {
        alertContainer.innerHTML = '';
    }, 3000);
}
