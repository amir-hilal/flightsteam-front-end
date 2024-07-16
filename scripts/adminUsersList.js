// Function to toggle sidebar visibility
function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("active");
}

// Function to fetch users and populate the table
document.addEventListener('DOMContentLoaded', function() {
    fetchAndDisplayUsers();
});
const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', function() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        filterUsers(searchTerm);});

async function fetchAndDisplayUsers() {
    try {
        const response = await axios.get('http://localhost/flightsteam-back-end/api/users/getAll.php');
        if (response.status === 200) {
            populateUserTable(response.data.data.users);
        } else {
            console.error('Failed to fetch users:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

function populateUserTable(users) {
    const tableBody = document.querySelector('.flights-table tbody');
    tableBody.innerHTML = ''; // Clear existing rows

    users.forEach(user => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${user.user_id}</td>
            <td>${user.first_name}</td>
            <td>${user.middle_name}</td>
            <td>${user.last_name}</td>
            <td>${user.email}</td>
            <td>######</td>
            <td>${user.phone_number}</td>
            <td><button class="del-button" data-user-id="${user.user_id}">DEL</button></td>
        `;

        row.querySelector('.del-button').addEventListener('click', deleteUser);
        tableBody.appendChild(row);
    });
}

async function deleteUser(event) {
    const userId = event.target.dataset.userId;
    
    const confirmDelete = confirm('Are you sure you want to delete this user?');

    if (confirmDelete) {
        try {
            const response = await axios.post(
                "http://localhost/flightsteam-back-end/api/users/delete.php", 
                { user_id: userId },
                { headers: { 'Content-Type': 'application/json' } }
            );

            if (response.status === 200) {
                alert('User deleted successfully');
                fetchAndDisplayUsers(); // Refresh the table after deletion
            } else {
                alert('Failed to delete user: ' + response.data.message);
            }
        } catch (error) {
            console.error('An error occurred while deleting the user:', error);
            alert('An error occurred while deleting the user');
        }
    }
}
function filterUsers(searchTerm) {
    const rows = document.querySelectorAll('.flights-table tbody tr');

    rows.forEach(row => {
        const fullName = `${row.cells[1].textContent} ${row.cells[3].textContent}`.toLowerCase();
        const email = row.cells[4].textContent.toLowerCase();

        if (fullName.includes(searchTerm) || email.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

