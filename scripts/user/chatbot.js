const chatInput = document.getElementById("chat-input");
const sendButton = document.getElementById("send-btn");
const chatContainer = document.getElementById("chat-container");
const tripForm = document.getElementById("trip-form");
const closeMenuBtn = document.querySelector(".btn-close-menu");
const openMenuBtn = document.querySelector(".btn-open-menu");
const menu = document.querySelector(".menu");

let inputContent = "";
let chat = [];
const userId = 12;

openMenuBtn.addEventListener("click", () => {
  menu.classList.remove("closed");
  closeMenuBtn.classList.remove("closed");
});
closeMenuBtn.addEventListener("click", () => {
  menu.classList.add("closed");
  closeMenuBtn.classList.add("closed");
});

chatInput.addEventListener("input", (e) => {
  inputContent = e.target.value;
});

sendButton.addEventListener("click", async () => {
  if (!inputContent.trim()) return;

  addMessageToChat("User", inputContent);

  chat.push({
    role: "user",
    content: inputContent,
  });

  // Save user message to the backend
  await saveChatLog("user", inputContent);

  try {
    const { data } = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [...chat],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: "Bearer key",
          "Content-Type": "application/json",
        },
      }
    );

    const assistantMessage = data.choices[0].message.content;

    addMessageToChat("Assistant", assistantMessage);

    chat.push({
      role: "assistant",
      content: assistantMessage,
    });

    // Save assistant message to the backend
    await saveChatLog("bot", assistantMessage);

    chatInput.value = "";
    inputContent = "";
  } catch (error) {
    console.error("An error occurred while calling the OpenAI API:", error);
  }
});

tripForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const arrivalAirport = document.getElementById("arrival_airport_id").value;
  const duration = document.getElementById("duration").value;
  const time = document.getElementById("time").value;

  const tripDetails = `give me a plan for my trip.Trip Details: Arrival Airport - ${arrivalAirport}, Duration - ${duration} days, Time of Year - ${time}`;

  addMessageToChat("User", tripDetails);

  chat.push({
    role: "user",
    content: tripDetails,
  });

  // Save trip details to the backend
  await saveChatLog("user", tripDetails);

  try {
    const { data } = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [...chat],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: "Bearer key",
          "Content-Type": "application/json",
        },
      }
    );

    const assistantMessage = data.choices[0].message.content;

    addMessageToChat("Assistant", assistantMessage);

    chat.push({
      role: "assistant",
      content: assistantMessage,
    });

    // Save assistant message to the backend
    await saveChatLog("bot", assistantMessage);
  } catch (error) {
    console.error("An error occurred while calling the OpenAI API:", error);
  }
});

const saveChatLog = async (sender, message) => {
  try {
    await axios.post(
      "http://localhost/flightsteam-back-end/api/chatlogs/create.php",
      {
        user_id: userId,
        message: message,
        sender: sender,
      }
    );
  } catch (error) {
    console.error("An error occurred while saving the chat log:", error);
  }
};

const loadMessages = async () => {
  try {
    const response = await axios.get(
      `http://localhost/flightsteam-back-end/api/chatlogs/get.php?user_id=${userId}`
    );
    const chatLogs = response.data.chatlogs;
    chatContainer.innerHTML = "";

    chatLogs.forEach((log) => {
      addMessageToChat(
        log.sender === "user" ? "User" : "Assistant",
        log.message
      );
    });
  } catch (error) {
    console.error("An error occurred while loading the chat logs:", error);
  }
};

const addMessageToChat = (role, message) => {
  chatContainer.innerHTML += `<div>
    <h4 >${role}:</h4>
    <p>${message}</p>
  </div>`;
};

loadMessages();

const fetchAndPopulateLocations = async () => {
  try {
    const response = await axios.get(
      "http://localhost/flightsteam-back-end/api/locations/getAll.php"
    );

    const locations = response.data.locations;

    const arrivalSelect = document.getElementById("arrival_airport_id");

    locations.forEach((location) => {
      const arrivalOption = document.createElement("option");
      arrivalOption.value = location.city_name;
      arrivalOption.text = `${location.city_name} (${location.city_code})`;
      arrivalSelect.appendChild(arrivalOption);
    });
  } catch (error) {
    console.error("An error occurred while fetching locations:", error);
  }
};

fetchAndPopulateLocations();
