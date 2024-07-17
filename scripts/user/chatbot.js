document.addEventListener('DOMContentLoaded', async function () {
  const token = getCookie('token');
  if (!token) {
      window.location.href = '/index.html';
      return;
  }

  const departureSelect = document.getElementById('departureLocation');
  const arrivalSelect = document.getElementById('arrivalLocation');
  const travelForm = document.getElementById('travelForm');
  const chatContainer = document.getElementById('chatContainer');

  let chatHistory = [];

  // Function to fetch locations and populate the select options
  async function fetchLocations() {
      try {
          const response = await axios.get(
              'http://localhost/flightsteam-back-end/api/locations/getAll.php',
              {
                  headers: {
                      Authorization: `Bearer ${token}`,
                  },
              }
          );

          const locations = response.data.data.locations;

          locations.forEach((location) => {
              const option = document.createElement('option');
              option.value = location.location_id;
              option.text = `${location.city_name} (${location.city_code})`;
              departureSelect.appendChild(option.cloneNode(true));
              arrivalSelect.appendChild(option);
          });
      } catch (error) {
          console.error('Error fetching locations:', error);
      }
  }

  // Function to fetch available hotels and taxis for the arrival location
  async function fetchAdditionalInfo(arrivalLocation) {
      try {
          const hotelsResponse = await axios.get(
              `http://localhost/flightsteam-back-end/api/hotels/getByLocationId.php?location_id=${arrivalLocation}`,
              {
                  headers: {
                      Authorization: `Bearer ${token}`,
                  },
              }
          );

          const taxisResponse = await axios.get(
              `http://localhost/flightsteam-back-end/api/taxis/getByLocationId.php?location_id=${arrivalLocation}`,
              {
                  headers: {
                      Authorization: `Bearer ${token}`,
                  },
              }
          );

          const hotels = hotelsResponse.data.data.hotels
              .map((hotel) => hotel.name)
              .join(', ');
          const taxis = taxisResponse.data.data.taxis
              .map((taxi) => taxi.name)
              .join(', ');

          return { hotels, taxis };
      } catch (error) {
          console.error('Error fetching additional info:', error);
          return { hotels: '', taxis: '' };
      }
  }

  // Function to update chat UI
  function updateChatUI() {
      chatContainer.innerHTML = '';
      chatHistory.forEach(chat => {
          const messageElement = document.createElement('div');
          messageElement.classList.add(chat.sender === 'user' ? 'user-message' : 'assistant-message');
          messageElement.textContent = chat.message;
          chatContainer.appendChild(messageElement);
      });
  }

  // Event listener for form submission
  travelForm.addEventListener('submit', async function (event) {
      event.preventDefault();

      const departureLocation =
          departureSelect.options[departureSelect.selectedIndex].text;
      const arrivalLocation =
          arrivalSelect.options[arrivalSelect.selectedIndex].text;
      const budget = document.getElementById('budget').value;
      const days = document.getElementById('days').value;

      const additionalInfo = await fetchAdditionalInfo(arrivalSelect.value);

      const message = `You are my tourist guide. Give me the best plan trip of my life with the following details:
      Departure Location: ${departureLocation}
      Arrival Location: ${arrivalLocation}
      Budget: ${budget}
      Number of Days: ${days}
      Available Hotels: ${additionalInfo.hotels}
      Available Taxis: ${additionalInfo.taxis}`;

      // Add user message to chat history and update UI
      chatHistory.push({ message, sender: 'user' });
      updateChatUI();

      // Send the message to the backend
      try {
          const response = await axios.post(
              'http://localhost/flightsteam-back-end/api/chatlogs/chat.php',
              { message },
              {
                  headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${token}`,
                  },
              }
          );

          // Add assistant response to chat history and update UI
          chatHistory.push({ message: response.data.response, sender: 'assistant' });
          updateChatUI();
      } catch (error) {
          console.error('Error sending message:', error);
      }
  });

  fetchLocations(); // Populate the select options with locations on page load
});

// Function to get a cookie value by name
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}
