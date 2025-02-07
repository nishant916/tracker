document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
});

function handleLogin(event) {
    event.preventDefault();

    const username = document.getElementById('teacherUsername').value;
    const password = document.getElementById('teacherPassword').value;
    const alertContainer = document.getElementById('alertContainer');

    if (!username || !password) {
        showAlert('Username and password are required', 'danger');
        return;
    }

    fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
        .then(response => response.json())
        .then(isAuthenticated => {
            if (isAuthenticated) {
                console.log('Login successful');

                // Store login details in sessionStorage
                sessionStorage.setItem('teacherId', isAuthenticated.teacherId);
                sessionStorage.setItem('username', username);

                showAlert('Login successful! Redirecting...', 'success');
                // Redirect after 1 second
                setTimeout(() => {
                                window.location.href = `/pages/home-page.html`;
                                /*window.location.href = `/pages/home-page.html?teacherId=${isAuthenticated.teacherId}`;*/
                            }, 1000);
            } else {
                showAlert('Wrong username or password, Please try again.', 'danger');
                document.getElementById('teacherPassword').value = '';
            }
        })
        .catch(error => {
                console.error('Error fetching login information', error);
                showAlert('Server error. Please try again later.', 'warning'); // Show server error
        });
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