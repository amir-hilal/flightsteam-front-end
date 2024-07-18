
function isJWT(token) {
  const parts = token.split('.');
  if (parts.length !== 3) {
    return false;
  }

  try {
    const header = JSON.parse(atob(parts[0]));
    const payload = JSON.parse(atob(parts[1]));

    // Additional checks can be done here to ensure the payload contains expected fields
    return typeof header === 'object' && typeof payload === 'object';
  } catch (e) {
    return false;
  }
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}
document.addEventListener('DOMContentLoaded', () => {
  const bookingListElement = document.getElementById('booking-list');
  document.getElementById('back-button').addEventListener('click', () => {
    window.location.href = '/index.html';
  });

  const token = getCookie('token')

  // Fetch bookings
  if (!token || !isJWT(token)) {
    window.location.href = '/pages/common/login.html';
    return;
  }
  Promise.all([
    fetch(
      'http://localhost/flightsteam-back-end/api/users/getFlightBookings.php',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ).then((response) => response.json()),
    fetch(
      'http://localhost/flightsteam-back-end/api/users/getHotelBookings.php',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ).then((response) => response.json()),
    fetch(
      'http://localhost/flightsteam-back-end/api/users/getTaxiBookings.php',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ).then((response) => response.json()),
  ])
    .then(([flightsData, hotelsData, taxisData]) => {
      let bookings = [];
      console.log('data:', flightsData, hotelsData, taxisData);

      if (flightsData.status === 200 && flightsData.data.bookings) {
        bookings = bookings.concat(
          flightsData.data.bookings.map((booking) => ({
            ...booking,
            type: 'flight',
          }))
        );
      }

      if (hotelsData.status === 200 && hotelsData.data.bookings) {
        bookings = bookings.concat(
          hotelsData.data.bookings.map((booking) => ({
            ...booking,
            type: 'hotel',
          }))
        );
      }

      if (taxisData.status === 200 && taxisData.data.bookings) {
        bookings = bookings.concat(
          taxisData.data.bookings.map((booking) => ({
            ...booking,
            type: 'taxi',
          }))
        );
      }

      renderBookings(bookings);
    })
    .catch((error) => {
      console.error('Error fetching bookings:', error);
      displayMessage(
        'Error loading bookings. Please try again later.',
        'error'
      );
    });

  // Render bookings
  function renderBookings(bookings) {
    if (!bookingListElement) {
      console.error('Booking list element not found');
      return;
    }
    bookingListElement.innerHTML = '';
    console.log(bookings);
    if (bookings.length === 0) {
      bookingListElement.innerHTML = '<p>No bookings found.</p>';
      return;
    }

    bookings.forEach((booking) => {
      const bookingElement = document.createElement('div');
      bookingElement.classList.add('booking');
      let bookingDetails = '';

      if (booking.type === 'flight') {
        bookingDetails = `
          <h3>Flight Booking</h3>
          <p>Flight Number: ${booking.flight_number}</p>
          <p>Departure: ${booking.departure_city}, ${
          booking.departure_country
        } (${booking.departure_city_code})</p>
          <p>Arrival: ${booking.arrival_city}, ${booking.arrival_country} (${
          booking.arrival_city_code
        })</p>
          <p>Departure Time: ${new Date(
            booking.departure_time
          ).toLocaleString()}</p>
          <p>Arrival Time: ${new Date(
            booking.arrival_time
          ).toLocaleString()}</p>
          <p>Status: ${booking.status}</p>
        `;
      } else if (booking.type === 'hotel') {
        bookingDetails = `
          <h3>Hotel Booking</h3>
          <p>Hotel Name: ${booking.hotel_name}</p>
          <p>Location: ${booking.city_name}, ${booking.country} (${
          booking.city_code
        })</p>
          <p>Check-in Date: ${new Date(
            booking.check_in_date
          ).toLocaleDateString()}</p>
          <p>Check-out Date: ${new Date(
            booking.check_out_date
          ).toLocaleDateString()}</p>
          <p>Status: ${booking.status}</p>
        `;
      } else if (booking.type === 'taxi') {
        bookingDetails = `
          <h3>Taxi Booking</h3>
          <p>Company: ${booking.company_name}</p>
          <p>Car Type: ${booking.car_type}</p>
          <p>Pickup Location: ${booking.pickup_city}, ${
          booking.pickup_country
        } (${booking.pickup_city_code})</p>
          <p>Dropoff Location: ${booking.dropoff_city}, ${
          booking.dropoff_country
        } (${booking.dropoff_city_code})</p>
          <p>Pickup Time: ${new Date(booking.pickup_time).toLocaleString()}</p>
          <p>Status: ${booking.status}</p>
        `;
      }

      bookingElement.innerHTML = bookingDetails;
      bookingListElement.appendChild(bookingElement);
    });
  }

  // Helper function to display messages
  function displayMessage(message, type) {
    const messageElement = document.createElement('div');
    messageElement.className = `message ${type}`;
    messageElement.textContent = message;
    document.body.appendChild(messageElement);
    setTimeout(() => {
      document.body.removeChild(messageElement);
    }, 3000);
  }

  // Helper function to get the value of a specific cookie
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }
});
