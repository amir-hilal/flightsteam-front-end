document.addEventListener('DOMContentLoaded', async function () {
    const token = getCookie('token');
    if (!token) {
        window.location.href = '/index.html';
        return;
    }

    const isValid = await validateAdminToken(token);
    if (!isValid) {
        window.location.href = '/pages/admin/adminLogin.html';
        return;
    }

    const modal = document.getElementById('addModal');

    // Function to open the modal
    function openModal() {
        modal.style.display = 'flex';
    }

    // Function to close the modal
    function closeModal() {
        modal.style.display = 'none';
    }

    // Initial hide modal
    if (modal) {
        modal.style.display = 'none';
    }

    // Close the modal when clicking outside of the modal content
    window.onclick = function (event) {
        if (event.target === modal) {
            closeModal();
        }
    };

    const addButton = document.querySelector('.add-button');
    const closeButton = document.querySelector('.close-button');

    if (addButton) {
        addButton.addEventListener('click', openModal);
    }

    if (closeButton) {
        closeButton.addEventListener('click', closeModal);
    }

    // Function to validate email format
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Function to validate password format
    function validatePassword(password) {
        const re = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return re.test(password);
    }

    // Function to fetch and display admin users
    async function fetchAndDisplayAdminUsers() {
        try {
            const response = await axios.get(
                'http://localhost/flightsteam-back-end/api/admins/getAll.php',
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const admins = response.data.data.admins;

            const table = document.querySelector('.admins-table tbody');
            table.innerHTML = ''; // Clear existing table rows

            admins.forEach((admin) => {
                // Loop through admins array and create table rows for each admin
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${admin.admin_id}</td>
                    <td>${admin.first_name}</td>
                    <td>${admin.middle_name}</td>
                    <td>${admin.last_name}</td>
                    <td>${admin.email}</td>
                    <td>${admin.role}</td>
                    <td>${admin.created_at}</td>
                    <td>${admin.updated_at}</td>
                    <td><button class="del-button" data-id="${admin.admin_id}">DEL</button></td>
                `;
                table.appendChild(row);
            });

            // Add event listeners for delete buttons
            document.querySelectorAll('.del-button').forEach((button) => {
                button.addEventListener('click', async (event) => {
                    const adminId = event.target.getAttribute('data-id');
                    console.log(adminId)
                    const confirmDelete = confirm(
                        'Are you sure you want to delete this admin?'
                    );

                    if (confirmDelete) {
                        try {
                            const deleteResponse = await axios.post(
                                'http://localhost/flightsteam-back-end/api/admins/delete.php',
                                { admin_id: adminId },
                                {
                                    headers: {
                                        'Content-Type': 'application/json',
                                        Authorization: `Bearer ${token}`,
                                    },
                                }
                            );
                            console.log(deleteResponse.data);
                            if (deleteResponse.data.status === 200) {
                                alert('Admin deleted successfully');
                                fetchAndDisplayAdminUsers(); // Refresh the table after deletion
                            } else {
                                alert(
                                    'Failed to delete admin: ' + deleteResponse.data.message
                                );
                            }
                        } catch (error) {
                            console.error('An error occurred while deleting the admin:', error);
                            alert('An error occurred while deleting the admin');
                        }
                    }
                });
            });
        } catch (error) {
            console.error('An error occurred while fetching admin users:', error);
            // Handle error, display message or retry
        }
    }

    // Function to filter admin users in the table
    function filterAdminUsers(searchTerm) {
        const rows = document.querySelectorAll('.admins-table tbody tr');

        rows.forEach((row) => {
            const firstName = row.cells[1].textContent.toLowerCase();
            const lastName = row.cells[3].textContent.toLowerCase();
            const email = row.cells[4].textContent.toLowerCase();

            if (
                firstName.includes(searchTerm) ||
                lastName.includes(searchTerm) ||
                email.includes(searchTerm)
            ) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }

    // Handle search input
    document.querySelector('.search-input').addEventListener('input', (event) => {
        const searchTerm = event.target.value.trim().toLowerCase();
        filterAdminUsers(searchTerm);
    });

    // Handle form submission for adding a new admin
    document.getElementById('addAdminForm').addEventListener('submit', async (event) => {
        event.preventDefault();

        const firstName = document.getElementById('first_name').value;
        const middleName = document.getElementById('middle_name').value;
        const lastName = document.getElementById('last_name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const role = document.getElementById('role').value;

        if (!validateEmail(email)) {
            alert('Please enter a valid email address');
            return;
        }

        if (!validatePassword(password)) {
            alert('Password must contain at least 8 characters, one number, and one special character');
            return;
        }

        const adminData = {
            first_name: firstName,
            middle_name: middleName,
            last_name: lastName,
            email: email,
            password: password,
            role: role,
        };

        try {
            const response = await axios.post(
                'http://localhost/flightsteam-back-end/api/admins/create_or_update.php',
                adminData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log(response.data); // Log the entire response

            if (response.data.status === 200) {
                alert('Admin added successfully');
                closeModal();
                fetchAndDisplayAdminUsers(); // Refresh the table after addition
            } else {
                alert('Failed to add admin: ' + (response.data.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('An error occurred while adding the admin:', error);
            alert('An error occurred while adding the admin');
        }
    });

    // Call fetchAndDisplayAdminUsers function on page load
    fetchAndDisplayAdminUsers();
});
