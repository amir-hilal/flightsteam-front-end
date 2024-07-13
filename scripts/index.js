const datepickerBtn = document.getElementById("date");
const passengerBtn = document.getElementById("passengers");
const datepicker = document.getElementById("date-input");
const passengerSelect = document.getElementById("select-passengers");

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
