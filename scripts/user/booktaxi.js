document.addEventListener('DOMContentLoaded', () => {
  const taxiBookingForm = document.getElementById('taxi-booking-form');
  const skipButton = document.getElementById('skip-button');
  const pickupLocationSelect = document.getElementById('pickup-location');
  const dropoffLocationSelect = document.getElementById('dropoff-location');
  const pickupDateInput = document.getElementById('pickup-date');
  const taxiListElement = document.getElementById('taxi-list');
  const selectedTaxiInfo = document.getElementById('selected-taxi-info');
  const filterByNameInput = document.getElementById('filter-by-name');
  const today = new Date().toISOString().split('T')[0];
  let selectedTaxiId = null;
  let taxis = [];

  // Set minimum pickup date to today
  pickupDateInput.setAttribute('min', today);

  // Fetch available locations
  fetch('http://localhost/flightsteam-back-end/api/locations/getAll.php')
    .then(response => response.json())
    .then(data => {
      if (data.status === 'success') {
        const locations = data.locations;
        populateLocationOptions(locations);
      } else {
        displayMessage('Error loading locations.', 'error');
      }
    })
    .catch(error => {
      console.error('Error fetching locations:', error);
      displayMessage('Error loading locations. Please try again later.', 'error');
    });

  // Fetch available taxis
  fetch('http://localhost/flightsteam-back-end/api/taxis/getAll.php')
    .then(response => response.json())
    .then(data => {
      if (data.status === 'success') {
        taxis = data.taxis;
        renderTaxis(taxis);
      } else {
        displayMessage('Error loading taxis.', 'error');
      }
    })
    .catch(error => {
      console.error('Error fetching taxis:', error);
      displayMessage('Error loading taxis. Please try again later.', 'error');
    });

  // Populate location options
  function populateLocationOptions(locations) {
    locations.forEach(location => {
      const option = document.createElement('option');
      option.value = location.location_id;
      option.textContent = `${location.city_name}, ${location.country} (${location.city_code})`;
      pickupLocationSelect.appendChild(option);

      const optionClone = option.cloneNode(true);
      dropoffLocationSelect.appendChild(optionClone);
    });
  }

  // Render taxis
  function renderTaxis(taxis, disableButtons = true) {
    taxiListElement.innerHTML = '';
    taxis.forEach(taxi => {
      const taxiElement = document.createElement('div');
      taxiElement.classList.add('taxi');
      taxiElement.innerHTML = `
        <h3>${taxi.company_name}</h3>
        <p>Car type: ${taxi.car_type}</p>
        <p>Price per km: $${taxi.price_per_km}</p>
        <p>Pickup location: ${taxi.city_name}, ${taxi.country}</p>
        <button class="btn-select-taxi" data-taxi-id="${taxi.taxi_id}" ${disableButtons ? 'disabled' : ''}>Select Taxi</button>
      `;
      taxiListElement.appendChild(taxiElement);

      taxiElement.querySelector('.btn-select-taxi').addEventListener('click', () => {
        selectedTaxiId = taxi.taxi_id;
        selectedTaxiInfo.innerHTML = `
          <h3>Selected Taxi: ${taxi.company_name}</h3>
          <p>Car type: ${taxi.car_type}</p>
          <p>Price per km: $${taxi.price_per_km}</p>
          <p>Pickup location: ${taxi.city_name}, ${taxi.country}</p>
          <button class="btn-unselect">Deselect Taxi</button>
        `;
        selectedTaxiInfo.querySelector('.btn-unselect').addEventListener('click', deselectTaxi);
        document.getElementById('taxi-booking-form-section').scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  // Deselect taxi
  function deselectTaxi() {
    selectedTaxiId = null;
    selectedTaxiInfo.innerHTML = '';
  }

  // Handle form submission
  taxiBookingForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!selectedTaxiId) {
      displayMessage('Please select a taxi first.', 'error');
      return;
    }

    const formData = new FormData(taxiBookingForm);
    const bookingData = {
      taxi_id: selectedTaxiId,
      pickup_location_id: formData.get('pickup-location'),
      dropoff_location_id: formData.get('dropoff-location'),
      pickup_time: `${formData.get('pickup-date')} ${formData.get('pickup-time')}:00`,
      status: 'confirmed'
    };

    const token = getCookie('token');

    if (!token) {
      displayMessage('You must be logged in to book a taxi.', 'error');
      window.location.href = 'login.html';
      return;
    }

    fetch('http://localhost/flightsteam-back-end/api/taxiBookings/create.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(bookingData),
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 201) {
          displayMessage('Booking successful!', 'success');
          localStorage.setItem('taxiBookingDetails', JSON.stringify(data.booking));
          window.location.href = 'myBookings.html';

        } else {
          displayMessage('Booking failed: ' + data.message, 'error');
        }
      })
      .catch(error => {
        console.error('Error booking taxi:', error);
        displayMessage('Booking failed. Please try again later.', 'error');
      });
  });

  // Handle skip button
  skipButton.addEventListener('click', () => {
    window.location.href = 'nextPage.html'; // Replace with the actual next page
  });

  // Filter taxis by name and pickup location
  filterByNameInput.addEventListener('input', filterTaxis);
  pickupLocationSelect.addEventListener('change', filterTaxis);

  function filterTaxis() {
    const nameFilter = filterByNameInput.value.toLowerCase();
    const locationFilter = pickupLocationSelect.value;

    const filteredTaxis = taxis.filter(taxi => {
      return taxi.company_name.toLowerCase().includes(nameFilter) &&
             (!locationFilter || taxi.available_location_id === parseInt(locationFilter));
    });

    const disableButtons = locationFilter === '';
    renderTaxis(filteredTaxis, disableButtons);
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
