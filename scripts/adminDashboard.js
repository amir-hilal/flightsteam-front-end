document.addEventListener('DOMContentLoaded', function() {
    // Axios GET request to fetch stats from PHP
    axios.get('http://localhost/flightsteam-back-end/api/admins/getData.php')
        .then(function(response) {
            const stats = response.data;
            console.log(stats);

            // Update DOM elements with fetched data
            document.getElementById('totalBookingsCard').querySelector('.card-text').innerText = stats.totalBookings;
            document.getElementById('pendingBookingsCard').querySelector('.card-text').innerText = stats.pendingBookings;
            document.getElementById('totalUsersCard').querySelector('.card-text').innerText = stats.totalUsers;
        })
        .catch(function(error) {
            console.error('Error fetching stats:', error);
        });
})