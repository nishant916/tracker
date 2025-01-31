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
    // Fetch active and inactive courses on page load
    fetchActiveCourses();
});

//fetch list of active courses & their details from backend
function fetchActiveCourses() {
    const url = `/api/course-settings/${teacherId}/active-courses`;

    fetch(url)
        .then(response => response.json())
        .then(activeCourses => {
        console.log('Fetched active courses:', activeCourses);
        fetchInactiveCourses(activeCourses);
    })
        .catch(error => console.error('Error fetching active courses:', error));
}

//fetch list of inactive courses & their details from backend
function fetchInactiveCourses(activeCourses) {
    const url = `/api/course-settings/${teacherId}/inactive-courses`;

    fetch(url)
        .then(response => response.json())
        .then(inactiveCourses => {
        console.log('Fetched inactive courses:', inactiveCourses);
        updateCourseList(activeCourses, inactiveCourses)
    })
        .catch(error => console.error('Error fetching inactive courses:', error));
}

function updateCourseList(activeCourses, inactiveCourses) {
    document.getElementById('username').textContent = activeCourses.length > 0 ? activeCourses[0].username : 'Username';
    const courseSelect = document.getElementById('CoursesList');
    courseSelect.innerHTML = '<option selected disabled>select course</option>'; // Clear existing options

    // Add Active Courses Header
    if (activeCourses.length > 0) {
        const activeHeader = document.createElement('optgroup');
        activeHeader.label = 'Active Courses';
        courseSelect.appendChild(activeHeader);

        activeCourses.forEach(c => {
            const option = document.createElement('option');
            option.value = c.courseId;
            option.textContent = c.course;
            activeHeader.appendChild(option);
        });
    }

    // Add Inactive Courses Header
    if (inactiveCourses.length > 0) {
        const inactiveHeader = document.createElement('optgroup');
        inactiveHeader.label = 'Inactive Courses';
        courseSelect.appendChild(inactiveHeader);

        inactiveCourses.forEach(c => {
            const option = document.createElement('option');
            option.value = c.courseId;
            option.textContent = c.course;
            inactiveHeader.appendChild(option);
        });
    }

    courseSelect.disabled = false;
}

// Helper function to convert string to proper case
function toProperCase(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
