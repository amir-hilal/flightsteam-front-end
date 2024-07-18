document.addEventListener('DOMContentLoaded', async function () {
    const token = getCookie('token');
    if (!token) {
        window.location.href = '/pages/admin/adminLogin.html';
        return;
    }

    const isValid = await validateAdminToken(token);
    if (!isValid) {
        window.location.href = '/pages/common/login.html';
        return;
    }


    const modal = document.getElementById('addModal');
    const addButton = document.querySelector('.add-button');
    const closeButton = document.querySelector('.close-button');

    // Function to open the modal
    function openModal() {
        modal.style.display = 'flex';
    }

    // Function to close the modal
    function closeModal() {
        modal.style.display = 'none';
    }

    // Initial hide modal
    modal.style.display = 'none';

    // Close the modal when clicking outside of the modal content
    window.onclick = function (event) {
        if (event.target === modal) {
            closeModal();
        }
    };

    addButton.addEventListener('click', openModal);
    closeButton.addEventListener('click', closeModal);

    // Function to toggle sidebar for smaller screens
    function toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.toggle('active');
    }

    // Function to fetch and display flights
    async function fetchAndDisplayFlights() {
        try {
            const response = await axios.get(
                'http://localhost/flightsteam-back-end/api/flights/getAll.php',
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // console.log(response.data.data.flights);
            const flights = response.data.data.flights;

            const table = document.querySelector('.flights-table tbody');
            table.innerHTML = ''; // Clear existing table rows

            flights.forEach((flight) => {
                // Loop through flights array and create table rows for each flight

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${flight.flight_number}</td>
                    <td>${flight.company_name}</td>
                    <td>${flight.departure_city}, ${flight.departure_country} (${flight.departure_city_code})</td>
                    <td>${flight.arrival_city}, ${flight.arrival_country} (${flight.arrival_city_code})</td>
                    <td>${flight.departure_time}</td>
                    <td>${flight.arrival_time}</td>
                    <td>${flight.price}</td>
                    <td>${flight.available_seats}</td>
                    <td><button class="del-button" data-id="${flight.flight_id}">DEL</button></td>
                `;
                table.appendChild(row);
            });

            // Add event listeners for delete buttons
            document.querySelectorAll('.del-button').forEach((button) => {
                button.addEventListener('click', async (event) => {
                    const flightId = event.target.getAttribute('data-id');
                    const confirmDelete = confirm(
                        'Are you sure you want to delete this flight?'
                    );

                    if (confirmDelete) {
                        try {
                            const deleteResponse = await axios.post(
                                'http://localhost/flightsteam-back-end/api/flights/delete.php',
                                { flight_id: flightId },
                                {
                                    headers: {
                                        'Content-Type': 'application/json',
                                        Authorization: `Bearer ${token}`,
                                    },
                                }
                            );
                            console.log(deleteResponse.data);
                            if (deleteResponse.data.status === 200) {
                                alert('Flight deleted successfully');
                                fetchAndDisplayFlights(); // Refresh the table after deletion
                            } else {
                                alert(
                                    'Failed to delete flight: ' + deleteResponse.data.message
                                );
                            }
                        } catch (error) {
                            console.error(
                                'An error occurred while deleting the flight:',
                                error
                            );
                            alert('An error occurred while deleting the flight');
                        }
                    }
                });
            });
        } catch (error) {
            console.error('An error occurred while fetching flights:', error);
            // Handle error, display message or retry
        }
    }

    // Fetch and populate location dropdowns
    async function fetchAndPopulateLocations() {
        try {
            const response = await axios.get(
                'http://localhost/flightsteam-back-end/api/locations/getAll.php',
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const locations = response.data.locations;
            console.log("responese:",response.data)
            console.log(locations);
            const departureSelect = document.getElementById('departure_airport_id');
            const arrivalSelect = document.getElementById('arrival_airport_id');

            locations.forEach((location) => {
                const departureOption = document.createElement('option');
                departureOption.value = location.location_id;
                departureOption.text = `${location.city_name} (${location.city_code})`;
                departureSelect.appendChild(departureOption);

                const arrivalOption = document.createElement('option');
                arrivalOption.value = location.location_id;
                arrivalOption.text = `${location.city_name} (${location.city_code})`;
                arrivalSelect.appendChild(arrivalOption);
            });
        } catch (error) {
            console.error('An error occurred while fetching locations:', error);
        }
    }

    // Fetch and populate company dropdown
    async function fetchAndPopulateCompanies() {
        try {
            const response = await axios.get(
                'http://localhost/flightsteam-back-end/api/companies/getAll.php',
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const companies = response.data.data.companies;

            console.log(companies);
            const companySelect = document.getElementById('company_id');

            companies.forEach((company) => {
                const companyOption = document.createElement('option');
                companyOption.value = company.company_id;
                companyOption.text = company.name;
                companySelect.appendChild(companyOption);
            });
        } catch (error) {
            console.error('An error occurred while fetching companies:', error);
        }
    }

    // Function to format date and time to 'Y-m-d H:i:s'
    function formatDateTimeToMySQL(datetime) {
        const date = new Date(datetime);
        const formattedDate =
            date.getFullYear() +
            '-' +
            ('0' + (date.getMonth() + 1)).slice(-2) +
            '-' +
            ('0' + date.getDate()).slice(-2) +
            ' ' +
            ('0' + date.getHours()).slice(-2) +
            ':' +
            ('0' + date.getMinutes()).slice(-2) +
            ':' +
            ('0' + date.getSeconds()).slice(-2);
        return formattedDate;
    }

    // Add event listeners for departure and arrival time validation
    const departureTimeInput = document.getElementById('departure_time');
    const arrivalTimeInput = document.getElementById('arrival_time');

    // Set the min value for departure time to the current date and time
    const now = new Date();
    const formattedNow = now.toISOString().slice(0, 16); // Get 'YYYY-MM-DDTHH:MM' format
    departureTimeInput.min = formattedNow;

    departureTimeInput.addEventListener('change', function () {
        arrivalTimeInput.min = departureTimeInput.value;
    });

    arrivalTimeInput.addEventListener('change', function () {
        if (arrivalTimeInput.value < departureTimeInput.value) {
            arrivalTimeInput.value = '';
            alert('Arrival time cannot be earlier than departure time');
        }
    });

    // Handle form submission for adding a new flight
    document
        .getElementById('addFlightForm')
        .addEventListener('submit', async (event) => {
            event.preventDefault();

            const flightData = {
                flight_number: document.getElementById('flight_number').value,
                company_id: document.getElementById('company_id').value,
                departure_airport_id: document.getElementById('departure_airport_id').value,
                arrival_airport_id: document.getElementById('arrival_airport_id').value,
                departure_time: formatDateTimeToMySQL(
                    document.getElementById('departure_time').value
                ),
                arrival_time: formatDateTimeToMySQL(
                    document.getElementById('arrival_time').value
                ),
                price: document.getElementById('price').value,
                available_seats: document.getElementById('available_seats').value,
            };

            try {
                const response = await axios.post(
                    'http://localhost/flightsteam-back-end/api/flights/create_or_update.php',
                    flightData,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                console.log(response.data); // Log the entire response

                if (response.data.status === 200) {
                    alert('Flight added successfully');
                    closeModal();
                    fetchAndDisplayFlights(); // Refresh the table after addition
                } else {
                    alert(
                        'Failed to add flight: ' +
                        (response.data.message || 'Unknown error')
                    );
                }
            } catch (error) {
                console.error('An error occurred while adding the flight:', error);
                alert('An error occurred while adding the flight');
            }
        });

    // Function to filter flights in the table
    function filterFlights(searchTerm) {
        const rows = document.querySelectorAll('.flights-table tbody tr');

        rows.forEach((row) => {
            const flightNumber = row.cells[0].textContent.toLowerCase();
            const company = row.cells[1].textContent.toLowerCase();
            const departureCity = row.cells[2].textContent.toLowerCase();
            const arrivalCity = row.cells[3].textContent.toLowerCase();

            if (
                flightNumber.includes(searchTerm) ||
                company.includes(searchTerm) ||
                departureCity.includes(searchTerm) ||
                arrivalCity.includes(searchTerm)
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
        filterFlights(searchTerm);
    });

    // Call fetchAndDisplayFlights, fetchAndPopulateLocations, and fetchAndPopulateCompanies functions on page load
    fetchAndDisplayFlights();
    fetchAndPopulateLocations();
    fetchAndPopulateCompanies();
});
