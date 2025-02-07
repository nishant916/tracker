// Get teacherId from session storage
const teacherId = sessionStorage.getItem('teacherId');

// Following statements are for Navigation bar:

// When user clicks on home page button
document.getElementById("homePage").addEventListener("click", function() {
    const url = `home-page.html`;
    window.location.href = url;
});

// When user clicks on take attendance button
document.getElementById("takeAttendancePage").addEventListener("click", function() {
    const url = `take-attendance.html`;
    window.location.href = url;
});

// When user clicks on view attendance button
document.getElementById("viewAttendancePage").addEventListener("click", function() {
    const url = `view-attendance.html`;
    window.location.href = url;
});

// When user clicks on edit grades button
document.getElementById("editGradesPage").addEventListener("click", function() {
    const url = `edit-grades.html`;
    window.location.href = url;
});

// When user clicks on view grades button
document.getElementById("viewGradesPage").addEventListener("click", function() {
    const url = `view-grades.html`;
    window.location.href = url;
});

// When user clicks on course settings button
document.getElementById("courseSettingsPage").addEventListener("click", function() {
    const url = `course-settings.html`;
    window.location.href = url;
});

// When user clicks on logout button, it clears session storage & history and redirects to logout page
document.getElementById("logoutLink").addEventListener("click", function(event) {
    event.preventDefault();
    sessionStorage.clear();

    history.pushState(null, null, location.href);
    window.onpopstate = function () {
        history.go(1); // Forces forward navigation to the same page
    };

    window.location.href = `logout.html`;
});

// Helper function to convert string to proper case
function toProperCase(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
