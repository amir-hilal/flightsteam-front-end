const datepickerBtn = document.getElementById("date");
const passengerBtn = document.getElementById("passengers");
const datepicker = document.getElementById("date-input");
const passengerSelect = document.getElementById("select-passengers");
const closeMenuBtn = document.querySelector(".btn-close-menu");
const openMenuBtn = document.querySelector(".btn-open-menu");
const menu = document.querySelector(".menu");
const buySearchBtns = document.querySelectorAll(".btn-buy-search");
const searchBtn = document.querySelector(".btn-search");
const ticketContainer = document.querySelector(".tickets");

let flights = [];

const getFlights = async () => {
  try {
    const { data } = await axios.get(
      "http://localhost/flightsteam-back-end/api/flights/getAll.php"
    );

    flights = data.data.flights;

    const flightsList = document.querySelector(".flights-list");

    flights.forEach((flight) => {
      flightsList.innerHTML += ` <li>
            <p>${flight.flight_number}</p>
            <p>${
              new Date(flight.arrival_Time) < new Date()
                ? "Arrived"
                : new Date(flight.departure_Time) > new Date()
                ? "Departed"
                : "In Progress"
            }</p>
            <p>${flight.departure_city} - ${flight.arrival_city}</p>
            <p>${flight.departure_time} - ${flight.arrival_time}</p>
          </li>`;
    });
  } catch (err) {
    console.error(err);
  }
};

getFlights();

const picker = new Pikaday({
  field: datepicker,
  format: "DD/MM/YYYY",
  minDate: new Date(),
  onSelect: function (date) {
    console.log(date);
  },
});

datepickerBtn.addEventListener("click", () => {
  picker.show();
});

openMenuBtn.addEventListener("click", () => {
  menu.classList.remove("closed");
  closeMenuBtn.classList.remove("closed");
});
closeMenuBtn.addEventListener("click", () => {
  menu.classList.add("closed");
  closeMenuBtn.classList.add("closed");
});

buySearchBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (!btn.classList.contains("active")) {
      const shownSection = document.querySelectorAll(".show");
      const hiddenSection = document.querySelectorAll(".hide");

      Array.from(buySearchBtns)
        .find((btn) => btn.classList.contains("active"))
        .classList.remove("active");
      btn.classList.add("active");

      shownSection.forEach((sec) => sec.classList.remove("show"));
      shownSection.forEach((sec) => sec.classList.add("hide"));
      hiddenSection.forEach((sec) => sec.classList.add("show"));
      hiddenSection.forEach((sec) => sec.classList.remove("hide"));
    }
  });
});

searchBtn.addEventListener("click", () => {
  const departureCity = document.getElementById("select-departure").value;
  const destination = document.getElementById("select-destination").value;
  const departureDate = document.getElementById("date-input").value;
  const passengers = document.getElementById("select-passengers").value;

  const filteredFlights = flights.filter(
    (flight) =>
      flight.departure_city === departureCity &&
      flight.arrival_city === destination
  );

  if (filteredFlights.length == 0) return;

  document.getElementById("empty").style.display = "none";

  ticketContainer.innerHTML = "";
  filteredFlights.forEach((flight) => {
    ticketContainer.innerHTML += `
    <div class="ticket">
          <div class="company">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-tower-control"
            >
              <path
                d="M18.2 12.27 20 6H4l1.8 6.27a1 1 0 0 0 .95.73h10.5a1 1 0 0 0 .96-.73Z"
              />
              <path d="M8 13v9" />
              <path d="M16 22v-9" />
              <path d="m9 6 1 7" />
              <path d="m15 6-1 7" />
              <path d="M12 6V2" />
              <path d="M13 2h-2" />
            </svg>
            <p>${flight.company}</p>
          </div>

          <div>Departure day</div>
          <div class="duration">Duration</div>
          <div>Arrival day</div>
          <div>Price</div>
          <span>${flight.hour}</span>
          <div class="duration">
            <p>
              ⚫ •••••••••

              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.9285714285714286"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-plane-takeoff"
              >
                <path d="M2 22h20" />
                <path
                  d="M6.36 17.4 4 17l-2-4 1.1-.55a2 2 0 0 1 1.8 0l.17.1a2 2 0 0 0 1.8 0L8 12 5 6l.9-.45a2 2 0 0 1 2.09.2l4.02 3a2 2 0 0 0 2.1.2l4.19-2.06a2.41 2.41 0 0 1 1.73-.17L21 7a1.4 1.4 0 0 1 .87 1.99l-.38.76c-.23.46-.6.84-1.07 1.08L7.58 17.2a2 2 0 0 1-1.22.18Z"
                />
              </svg>

              ••••••••• ◯
            </p>
          </div>
          <span>6:00 PM</span>
          <span>$${flight.price}.00</span>
          <p>${flight.from}</p>
          <p class="duration">${flight.duration}</p>
          <p>${flight.to}</p>
          <button class="btn-info">More info</button>
          <button class="btn-book">Book this flight</button>
      </div>
    `;
  });
});
