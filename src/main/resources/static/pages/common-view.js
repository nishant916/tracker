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

        localStorage.setItem('activeCourses', JSON.stringify(activeCourses)); // Store in localStorage
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

        updateCourseList(activeCourses, inactiveCourses)
    })
        .catch(error => console.error('Error fetching completed courses:', error));
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
        inactiveHeader.label = 'Completed Courses';
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


document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('exportBtn').addEventListener('click', function () {
        exportTableToCSV();
    });
});


function exportTableToCSV() {
    // Try getting the table for view grades
    let table = document.getElementById('view-grades-table');

    // If view-grades-table is not found, check for view-attendance-table
    if (!table) {
        table = document.getElementById('view-attendance-table');
    }

    // If neither table exists, exit the function
    if (!table) {
        console.error('Error: No table found for exporting.');
        return;
    }

    let csv = [];

    // Get table headers (extract text without HTML tags)
    let headers = [];
    table.querySelectorAll('thead tr th').forEach(th => {
        let headerText = th.cloneNode(true); // Clone node to avoid modifying DOM
        headerText.querySelectorAll("span").forEach(span => span.remove()); // Remove span elements
        headers.push(headerText.textContent.trim()); // Get clean text
    });
    csv.push(headers.join(',')); // Convert array to CSV string

    // Get table rows
    table.querySelectorAll('tbody tr').forEach(row => {
        let rowData = [];
        row.querySelectorAll('td').forEach(td => rowData.push(td.textContent.trim()));
        csv.push(rowData.join(',')); // Convert array to CSV string
    });

    // Create and name a CSV file according to course name + grade or attendance
    let csvContent = "data:text/csv;charset=utf-8," + csv.join("\n");
    let encodedUri = encodeURI(csvContent);
    let link = document.createElement("a");
    const courseSelect = document.getElementById("CoursesList");
    const selectedCourse = courseSelect.options[courseSelect.selectedIndex]?.text || "UnknownCourse";
    const filename = `${selectedCourse.replace(/\s+/g, "_")}_${table.id.includes("grades") ? "grades" : "attendance"}.csv`;
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
