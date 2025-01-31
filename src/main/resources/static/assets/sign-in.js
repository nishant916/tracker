document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
});

function handleLogin(event) {
    event.preventDefault();

    const username = document.getElementById('teacherUsername').value;
    const password = document.getElementById('teacherPassword').value;

    console.log(`${username} and ${password}`);

    if (!username || !password) {
        alert('Username and password are required');
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
                console.log(isAuthenticated.teacherId);
                console.log('Login successful');
                window.location.href = `/pages/home-page.html?teacherId=${isAuthenticated.teacherId}`;
            } else {
                alert('Wrong username or password');
                document.getElementById('teacherPassword').value = '';
            }
        })
        .catch(error => console.error('Error fetching login information', error));
}

