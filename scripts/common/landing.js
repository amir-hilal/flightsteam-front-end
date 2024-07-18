document.addEventListener('DOMContentLoaded', () => {
  const datepickerBtn = document.getElementById('date');
  const passengerBtn = document.getElementById('passengers');
  const datepicker = document.getElementById('date-input');
  const passengerSelect = document.getElementById('select-passengers');
  const closeMenuBtn = document.querySelector('.btn-close-menu');
  const openMenuBtn = document.querySelector('.btn-open-menu');
  const menu = document.querySelector('.menu');
  const buySearchBtns = document.querySelectorAll('.btn-buy-search');
  const navbarLinks = document.querySelector('.navbar-links');
  const btnSearch = document.getElementById('btn-search');
  const flightsSection = document.getElementById('tickets-section');
  const flightsContainer = document.getElementById('flights-container');
  const flightsList = document.getElementById('flights-list');
  let flightsData = [];

  // Check for authentication token
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  function updateNavbar() {
    const token = getCookie('token');
    if (token) {
      // User is logged in
      navbarLinks.innerHTML = `
        <a href="/index.html" class="active-link">Home</a>
        <a href="/pages/common/chatbot.html">Flightsteam AI</a>
        <a href = "/pages/user/myBookings.html">My Bookings</a>
        <a href="#" id="logout">Log out</a>
      `;
      document.getElementById('logout').addEventListener('click', () => {
        document.cookie =
          'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        window.location.href = '/index.html';
      });
    } else {
      // User is not logged in
      navbarLinks.innerHTML = `
        <a href="/index.html" class="active-link">Home</a>
        <a href="/pages/common/chatbot.html">Flightsteam AI</a>
        <a href="/pages/common/login.html">Log in</a>
        <a href="/pages/common/register.html">Sign up</a>
      `;
    }
  }

  // Call the function to update the navbar on page load
  updateNavbar();

  const picker = new Pikaday({
    field: datepicker,
    format: 'DD/MM/YYYY',
    minDate: new Date(),
    onSelect: function (date) {
      console.log(date);
    },
  });

  datepickerBtn.addEventListener('click', () => {
    picker.show();
  });

  openMenuBtn.addEventListener('click', () => {
    menu.classList.remove('closed');
    closeMenuBtn.classList.remove('closed');
  });
  closeMenuBtn.addEventListener('click', () => {
    menu.classList.add('closed');
    closeMenuBtn.classList.add('closed');
  });

  buySearchBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (!btn.classList.contains('active')) {
        const shownSection = document.querySelectorAll('.show');
        const hiddenSection = document.querySelectorAll('.hide');

        Array.from(buySearchBtns)
          .find((btn) => btn.classList.contains('active'))
          .classList.remove('active');
        btn.classList.add('active');

        shownSection.forEach((sec) => sec.classList.remove('show'));
        shownSection.forEach((sec) => sec.classList.add('hide'));
        hiddenSection.forEach((sec) => sec.classList.add('show'));
        hiddenSection.forEach((sec) => sec.classList.remove('hide'));
      }
    });
  });

  // Function to check if search button should be enabled
  function checkSearchButton() {
    const departureCity = document
      .getElementById('departure-city-input')
      .value.trim();
    const arrivalCity = document
      .getElementById('arrival-city-input')
      .value.trim();
    const passengers = document
      .getElementById('select-passengers')
      .value.trim();
    btnSearch.disabled = !(departureCity || arrivalCity || passengers);
    btnSearch.disabled ? fetchFlights() : console.log('no data');
  }

  document
    .getElementById('departure-city-input')
    .addEventListener('input', checkSearchButton);
  document
    .getElementById('arrival-city-input')
    .addEventListener('input', checkSearchButton);
  document
    .getElementById('select-passengers')
    .addEventListener('input', checkSearchButton);

  function fetchFlights() {
    fetch('http://localhost/flightsteam-back-end/api/flights/getAll.php')
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 200) {
          flightsData = data.data.flights;
          renderFlights(flightsData);
          renderFlightsList(flightsData);
        } else {
          flightsContainer.innerHTML = '<p>No flights found.</p>';
        }
      })
      .catch((error) => {
        console.error('Error fetching flights:', error);
        flightsContainer.innerHTML =
          '<p>Error loading flights. Please try again later.</p>';
      });
    populateCityDatalists(flightsData); // Populate datalists with cities
  }

  function populateCityDatalists(flights) {
    const departureCities = new Set();
    const arrivalCities = new Set();

    flights.forEach((flight) => {
      departureCities.add(flight.departure_city);
      arrivalCities.add(flight.arrival_city);
    });

    const departureDatalist = document.getElementById('departure-cities');
    const arrivalDatalist = document.getElementById('arrival-cities');

    departureDatalist.innerHTML = '';
    arrivalDatalist.innerHTML = '';

    departureCities.forEach((city) => {
      const option = document.createElement('option');
      option.value = city;
      departureDatalist.appendChild(option);
    });

    arrivalCities.forEach((city) => {
      const option = document.createElement('option');
      option.value = city;
      arrivalDatalist.appendChild(option);
    });
  }

  function renderFlights(flights) {
    flightsContainer.innerHTML = '';

    flights.forEach((flight) => {
      const flightElement = document.createElement('div');
      flightElement.classList.add('ticket');
      flightElement.innerHTML = `
        <div class="company">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-tower-control">
            <path d="M18.2 12.27 20 6H4l1.8 6.27a1 1 0 0 0 .95.73h10.5a1 1 0 0 0 .96-.73Z" />
            <path d="M8 13v9" />
            <path d="M16 22v-9" />
            <path d="m9 6 1 7" />
            <path d="m15 6-1 7" />
            <path d="M12 6V2" />
            <path d="M13 2h-2" />
          </svg>
          <p>${flight.flight_number}</p>
        </div>
        <div>${new Date(flight.departure_time).toLocaleDateString()}</div>
        <div class="duration">Duration</div>
        <div>${new Date(flight.arrival_time).toLocaleDateString()}</div>
        <div>Price</div>
        <span>${new Date(flight.departure_time).toLocaleTimeString()}</span>
        <div class="duration">
          <p>
            ⚫ •••••••••
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9285714285714286" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plane-takeoff">
              <path d="M2 22h20" />
              <path d="M6.36 17.4 4 17l-2-4 1.1-.55a2 2 0 0 1 1.8 0l.17.1a2 2 0 0 0 1.8 0L8 12 5 6l.9-.45a2 2 0 0 1 2.09.2l4.02 3a2 2 0 0 0 2.1.2l4.19-2.06a2.41 2.41 0 0 1 1.73-.17L21 7a1.4 1.4 0 0 1 .87 1.99l-.38.76c-.23.46-.6.84-1.07 1.08L7.58 17.2a2 2 0 0 1-1.22.18Z" />
            </svg>
            ••••••••• ◯
          </p>
        </div>
        <span>${new Date(flight.arrival_time).toLocaleTimeString()}</span>
        <span>$${flight.price}</span>
        <p>${flight.departure_city_code}</p>
        <p class="duration">${Math.round(
          (new Date(flight.arrival_time) - new Date(flight.departure_time)) /
            (1000 * 60 * 60)
        )} hours</p>
        <p>${flight.arrival_city_code}</p>
        <button class="btn-info">More info</button>
        <button class="btn-book">Book this flight</button>
      `;
      flightsContainer.appendChild(flightElement);

      // Add event listener to the "Book this flight" button
      flightElement.querySelector('.btn-book').addEventListener('click', () => {
        const token = getCookie('token');
        if (token) {
          // User is logged in, redirect to bookflight page
          window.location.href = `/pages/user/bookflight.html?flight_id=${flight.flight_id}`;
        } else {
          // User is not logged in, redirect to login page
          window.location.href = '/pages/common/login.html';
        }
      });
    });
  }
  function renderFlightsList(flights) {
    flightsList.innerHTML = `
      <li class="list-titles">
        <p>Flight number</p>
        <p>Status</p>
        <p>Departure city - Arrival city</p>
        <p>Departure time - Arrival time</p>
      </li>
    `;

    flights.forEach((flight) => {
      const flightElement = document.createElement('li');
      flightElement.innerHTML = `
        <p>${flight.flight_number}</p>
        <p>${flight.status || 'Scheduled'}</p>
        <p>${flight.departure_city} - ${flight.arrival_city}</p>
        <p>${new Date(flight.departure_time).toLocaleString()} - ${new Date(
        flight.arrival_time
      ).toLocaleString()}</p>
      `;
      flightsList.appendChild(flightElement);
    });
  }

  function filterFlightsByNumber() {
    const searchInput = document
      .getElementById('search-input')
      .value.trim()
      .toLowerCase();
    const filteredFlights = flightsData.filter((flight) =>
      flight.flight_number.toLowerCase().includes(searchInput)
    );
    renderFlightsList(filteredFlights);
  }

  document
    .querySelector('.btn-search-flight')
    .addEventListener('click', filterFlightsByNumber);
  document
    .getElementById('search-input')
    .addEventListener('input', filterFlightsByNumber);

  function filterFlights() {
    const departureCity = document
      .getElementById('departure-city-input')
      .value.trim()
      .toLowerCase();
    const arrivalCity = document
      .getElementById('arrival-city-input')
      .value.trim()
      .toLowerCase();
    const passengers = document
      .getElementById('select-passengers')
      .value.trim();

    const filteredFlights = flightsData.filter((flight) => {
      // Convert flight data to lowercase for case-insensitive comparison
      const flightDepartureCity = flight.departure_city.toLowerCase();
      const flightArrivalCity = flight.arrival_city.toLowerCase();

      // Check conditions only if respective parameters are provided
      const matchesDepartureCity =
        !departureCity || flightDepartureCity.includes(departureCity);
      const matchesArrivalCity =
        !arrivalCity || flightArrivalCity.includes(arrivalCity);
      const matchesPassengers =
        !passengers || flight.available_seats >= parseInt(passengers);

      // Include the flight if all provided conditions are met
      return matchesDepartureCity && matchesArrivalCity && matchesPassengers;
    });

    renderFlights(filteredFlights);
  }

  btnSearch.addEventListener('click', () => {
    filterFlights();
    flightsSection.scrollIntoView({ behavior: 'smooth' });
  });

  // Call the function to fetch flights on page load
  fetchFlights();
});
