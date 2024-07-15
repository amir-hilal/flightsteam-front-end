const datepickerBtn = document.getElementById("date");
const passengerBtn = document.getElementById("passengers");
const datepicker = document.getElementById("date-input");
const passengerSelect = document.getElementById("select-passengers");
const closeMenuBtn = document.querySelector(".btn-close-menu");
const openMenuBtn = document.querySelector(".btn-open-menu");
const menu = document.querySelector(".menu");
const buySearchBtns = document.querySelectorAll(".btn-buy-search");

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
