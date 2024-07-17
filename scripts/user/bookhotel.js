document.addEventListener('DOMContentLoaded', () => {
  const hotelListElement = document.getElementById('hotel-list');
  const selectedHotelInfo = document.getElementById('selected-hotel-info');
  const bookingForm = document.getElementById('hotel-booking-form');
  const hotelNameFilter = document.getElementById('hotel-name-filter');
  const locationFilter = document.getElementById('location-filter');
  const skipButton = document.getElementById('skip-button');
  const checkInDateInput = document.getElementById('check-in-date');
  const checkOutDateInput = document.getElementById('check-out-date');
  let selectedHotelId = null;
  let hotelsData = [];

  // Fetch available hotels
  fetch('http://localhost/flightsteam-back-end/api/hotels/getAll.php')
    .then(response => response.json())
    .then(data => {
      if (data.status === 'success') {
        hotelsData = data.hotels;
        populateLocationFilter(hotelsData);
        renderHotels(hotelsData);
      } else {
        hotelListElement.innerHTML = '<p>No hotels found.</p>';
      }
    })
    .catch(error => {
      console.error('Error fetching hotels:', error);
      hotelListElement.innerHTML = '<p>Error loading hotels. Please try again later.</p>';
    });

  // Populate location filter
  function populateLocationFilter(hotels) {
    const locations = [...new Set(hotels.map(hotel => hotel.city_name))];
    locations.forEach(location => {
      const option = document.createElement('option');
      option.value = location;
      option.textContent = location;
      locationFilter.appendChild(option);
    });
  }

  // Render hotels
  function renderHotels(hotels) {
    hotelListElement.innerHTML = '';
    hotels.forEach(hotel => {
      const hotelElement = document.createElement('div');
      hotelElement.classList.add('hotel');
      hotelElement.innerHTML = `
        <h3>${hotel.name}</h3>
        <p>${hotel.city_name}, ${hotel.country} (${hotel.city_code})</p>
        <p>Price per night: $${hotel.price_per_night}</p>
        <p>Available rooms: ${hotel.available_rooms}</p>
        <button class="btn-select-hotel" data-hotel-id="${hotel.hotel_id}">Select Hotel</button>
      `;
      hotelListElement.appendChild(hotelElement);

      hotelElement.querySelector('.btn-select-hotel').addEventListener('click', () => {
        selectedHotelId = hotel.hotel_id;
        selectedHotelInfo.innerHTML = `
          <h3>Selected Hotel: ${hotel.name}</h3>
          <p>${hotel.city_name}, ${hotel.country} (${hotel.city_code})</p>
          <p>Price per night: $${hotel.price_per_night}</p>
          <p>Available rooms: ${hotel.available_rooms}</p>
        `;

        document.getElementById('hotel-booking-form').scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  // Filter hotels
  function filterHotels() {
    const filteredHotels = hotelsData.filter(hotel => {
      const matchesName = hotel.name.toLowerCase().includes(hotelNameFilter.value.toLowerCase());
      const matchesLocation = locationFilter.value === '' || hotel.city_name === locationFilter.value;
      return matchesName && matchesLocation;
    });
    renderHotels(filteredHotels);
  }

  hotelNameFilter.addEventListener('input', filterHotels);
  locationFilter.addEventListener('change', filterHotels);

  // Set minimum check-in date to today
  const today = new Date().toISOString().split('T')[0];
  checkInDateInput.setAttribute('min', today);

  checkInDateInput.addEventListener('change', () => {
    checkOutDateInput.setAttribute('min', checkInDateInput.value);
  });

  checkOutDateInput.addEventListener('change', () => {
    if (checkOutDateInput.value < checkInDateInput.value) {
      displayMessage('Check-out date cannot be earlier than check-in date.', 'error');
      checkOutDateInput.value = '';
    }
  });

  // Handle form submission
  bookingForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!selectedHotelId) {
      displayMessage('Please select a hotel first.', 'error');
      return;
    }

    const formData = new FormData(bookingForm);
    const checkInDate = formData.get('check-in-date');
    const checkOutDate = formData.get('check-out-date');

    if (checkInDate < today) {
      displayMessage('Check-in date cannot be earlier than today.', 'error');
      return;
    }

    if (checkOutDate < checkInDate) {
      displayMessage('Check-out date cannot be earlier than check-in date.', 'error');
      return;
    }

    const bookingData = {
      hotel_id: selectedHotelId,
      check_in_date: checkInDate,
      check_out_date: checkOutDate,
      status:"confirmed"
    };

    const token = getCookie('token');

    if (!token) {
      displayMessage('You must be logged in to book a hotel.', 'error');
      window.location.href = 'login.html';
      return;
    }

    fetch('http://localhost/flightsteam-back-end/api/hotelBookings/create.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(bookingData),
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 200) {
          displayMessage('Booking successful!', 'success');
          localStorage.setItem('hotelBookingDetails', JSON.stringify(data.bookingDetails));
          window.location.href = 'booktaxi.html';
        } else {
          displayMessage('Booking failed: ' + data.message, 'error');
        }
      })
      .catch(error => {
        console.error('Error booking hotel:', error);
        displayMessage('Booking failed. Please try again later.', 'error');
      });
  });

  // Handle skip button
  skipButton.addEventListener('click', () => {
    window.location.href = 'bookTaxi.html';
  });

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
