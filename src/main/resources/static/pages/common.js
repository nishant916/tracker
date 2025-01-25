// This Javascript file takes care of the links in the navigation bar

const urlParams = new URLSearchParams(window.location.search);
const teacherId = urlParams.get('teacherId');

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
