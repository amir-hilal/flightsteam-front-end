// Get the modal
const modal = document.getElementById("addModal");
// Open the modal
function openModal() {
    modal.style.display = "flex"; // Changed to "flex" to align with modal styles
}

// Close the modal
function closeModal() {
    modal.style.display = "none";
}
modal.style.display = "none";

// Close the modal when clicking outside of the modal content
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Handle form submission
document.getElementById("addFlightForm").addEventListener("submit", function(event) {
    event.preventDefault();
    
    // Get form data
    const flightNumber = document.getElementById("flightNumber").value;
    const comp = document.getElementById("comp").value;
    const dep = document.getElementById("dep").value;
    const arr = document.getElementById("arr").value;
    const depTime = document.getElementById("depTime").value;
    const arrTime = document.getElementById("arrTime").value;
    const price = document.getElementById("price").value;
    const seats = document.getElementById("seats").value;
    
    // Add new row to the table
    const table = document.querySelector(".flights-table tbody");
    const newRow = document.createElement("tr");
    newRow.innerHTML = `
        <td>1</td>
        <td>${flightNumber}</td>
        <td>${comp}</td>
        <td>${dep}</td>
        <td>${arr}</td>
        <td>${depTime}</td>
        <td>${arrTime}</td>
        <td>${price}</td>
        <td>${seats}</td>
        <td><button class="del-button">DEL</button></td>
    `;
    table.appendChild(newRow);
    
    // Close the modal
    closeModal();
});

// Toggle sidebar for smaller screens
function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("active");
}
