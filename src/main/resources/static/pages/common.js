// This Javascript file takes care of the links in the navigation bar

const urlParams = new URLSearchParams(window.location.search);
const teacherId = urlParams.get('teacherId');

// Following statements are for Navigation bar:

// When user clicks on home page button
document.getElementById("homePage").addEventListener("click", function() {
    const url = `home-page.html?teacherId=${teacherId}`;
    window.location.href = url;
});

// When user clicks on take attendance button
document.getElementById("takeAttendancePage").addEventListener("click", function() {
    const url = `take-attendance.html?teacherId=${teacherId}`;
    window.location.href = url;
});

// When user clicks on view attendance button
document.getElementById("viewAttendancePage").addEventListener("click", function() {
    const url = `view-attendance.html?teacherId=${teacherId}`;
    window.location.href = url;
});

// When user clicks on edit grades button
document.getElementById("editGradesPage").addEventListener("click", function() {
    const url = `edit-grades.html?teacherId=${teacherId}`;
    window.location.href = url;
});

// When user clicks on view grades button
document.getElementById("viewGradesPage").addEventListener("click", function() {
    const url = `view-grades.html?teacherId=${teacherId}`;
    window.location.href = url;
});

// When user clicks on course settings button
document.getElementById("courseSettingsPage").addEventListener("click", function() {
    const url = `course-settings.html?teacherId=${teacherId}`;
    window.location.href = url;
});

// When user clicks on logout button, tab closes
document.getElementById("logoutLink").addEventListener("click", function(event) {
    event.preventDefault();
    window.location.href = `logout.html`;
});

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
