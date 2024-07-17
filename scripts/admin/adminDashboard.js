
document.addEventListener('DOMContentLoaded', async function () {
    const token = getCookie('token');
    if (!token) {
      window.location.href = '/index.html';
      return;
    }

    const isValid = await validateAdminToken(token);
    if (!isValid) {
      window.location.href = '/index.html';
      return;
    }

    const ctx = document.getElementById('roomsChart').getContext('2d');

    const roomsChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [],
        datasets: [
          {
            label: 'Available Rooms',
            data: [],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          x: {
            beginAtZero: true,
          },
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    try {
      const response = await axios.get(
        'http://localhost/flightsteam-back-end/api/hotels/getAll.php'
      );
      console.log('API Response:', response.data);

      if (response.data && response.data.hotels) {
        // Process response data
        const labels = [];
        const data = [];
        response.data.hotels.forEach((hotel) => {
          labels.push(hotel.name);
          data.push(hotel.available_rooms);
        });
        roomsChart.data.labels = labels;
        roomsChart.data.datasets[0].data = data;
        roomsChart.update();
      } else {
        console.error('Unexpected API response structure:', response.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  });
