document.addEventListener('DOMContentLoaded', () => {
  const flightDetailsElement = document.getElementById('flight-details');
  const bookingForm = document.getElementById('booking-form');

  // Fetch flight details based on URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const flightId = urlParams.get('flight_id');

  if (flightId) {
    fetch(`http://localhost/flightsteam-back-end/api/flights/get.php?id=${flightId}`)
      .then(response => response.json())
      .then(data => {
        if (data.status === 200) {
          const flight = data.data.flight;
          console.log("flights:", flight);
          flightDetailsElement.innerHTML = `
            <h2>Flight ${flight.flight_number}</h2>
            <p><strong>Departure:</strong> ${new Date(flight.departure_time).toLocaleString()}</p>
            <p><strong>Arrival:</strong> ${new Date(flight.arrival_time).toLocaleString()}</p>
            <p><strong>From:</strong> ${flight.departure_city} (${flight.departure_city_code})</p>
            <p><strong>To:</strong> ${flight.arrival_city} (${flight.arrival_city_code})</p>
            <p><strong>Price:</strong> $${flight.price}</p>
          `;
        } else {
          flightDetailsElement.innerHTML = '<p>Flight details not found.</p>';
        }
      })
      .catch(error => {
        console.error('Error fetching flight details:', error);
        flightDetailsElement.innerHTML = '<p>Error loading flight details. Please try again later.</p>';
      });
  } else {
    flightDetailsElement.innerHTML = '<p>Flight ID not specified.</p>';
  }

  // Helper function to get the value of a specific cookie
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }

  // Handle form submission
  bookingForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(bookingForm);
    const bookingData = {
      seats: formData.get('seats'),
      flight_id: flightId,
    };

    const token = getCookie('token');

    if (!token) {
      alert('You must be logged in to book a flight.');
      window.location.href = 'login.html';
      return;
    }

    fetch('http://localhost/flightsteam-back-end/api/flightsBookings/create.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(bookingData),
    })
      .then(response => response.json())
      .then(data => {
        if (data.data.status === 'success') {
          alert('Booking successful!');
          window.location.href = 'bookhotel.html';
        } else {
          alert('Booking failed: ' + data.message);
        }
      })
      .catch(error => {
        console.error('Error booking flight:', error);
        alert('Booking failed. Please try again later.');
      });
  });
});
