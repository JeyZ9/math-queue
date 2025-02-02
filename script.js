let queue = [];
let customerImages = [];
const maxQueueSize = 7;

// Add to queue
document.getElementById("enqueueBtn").addEventListener("click", () => {
    const customerName = document.getElementById("customerName").value.trim();
    const customerImageInput = document.getElementById("customerImage");

    if (!customerName || !customerImageInput.files[0]) {
        alert("Please fill in the customer name and select an image.");
        return;
    }

    if (queue.length < maxQueueSize) {
        queue.push(customerName);
        customerImages.push(customerImageInput.files[0]);

        // Clear inputs
        document.getElementById("customerName").value = "";
        document.getElementById("customerImage").value = "";
        updateQueueDisplay();
    } else {
        alert("Queue is Full");
    }
});

// Call the next customer
document.getElementById("dequeueBtn").addEventListener("click", () => {
    if (queue.length > 0) {
        const nextCustomer = queue.shift();
        customerImages.shift();

        // ใช้ Web Speech API อ่านชื่อ
        if ("speechSynthesis" in window) {
            const synth = window.speechSynthesis;
            const utterance = new SpeechSynthesisUtterance();
            utterance.text = `ขอเชิญคุณ ${nextCustomer}`;
            utterance.lang = "th-TH";
            utterance.rate = 1;
            utterance.pitch = 1;
            synth.speak(utterance);
        } else {
            console.error("Web Speech API is not supported in this browser.");
        }

        alert(`Next Customer: ${nextCustomer}`);
        updateQueueDisplay();
    } else {
        alert("No more customers in the queue.");
    }
});

// Clear the queue
document.getElementById("cls").addEventListener("click", () => {
    if (queue.length > 0) {
        queue = [];
        customerImages = [];
        alert("Queue Cleared!");
        updateQueueDisplay();
    } else {
        alert("Queue is already empty.");
    }
});

// Update the queue display
function updateQueueDisplay() {
    const queueList = document.getElementById("queueList");
    queueList.innerHTML = ""; // Clear current display

    const status = document.createElement("h3");
    status.textContent =
        queue.length === 0
            ? "Queue : Queue is Empty"
            : queue.length === maxQueueSize
            ? "Queue : Queue is Full"
            : `Queue : ${queue.length} / ${maxQueueSize}`;
    queueList.appendChild(status);

    queue.forEach((customer, index) => {
        const div = document.createElement("div");
        div.className = "customer-item";

        // Create image container
        const imgContainer = document.createElement("div");
        imgContainer.className = "circle";

        // Create image element
        const imgElement = document.createElement("img");
        const customerImage = customerImages[index];
        if (customerImage) {
            const imageUrl = URL.createObjectURL(customerImage);
            imgElement.src = imageUrl;
            imgElement.className = "circle-img";
        }
        imgContainer.appendChild(imgElement);

        // Create name element
        const nameElement = document.createElement("p");
        nameElement.textContent = `${index + 1}. ${customer}`;
        nameElement.className = "customer-name";

        // Append elements to the customer item
        div.appendChild(imgContainer);
        div.appendChild(nameElement);

        // Append customer item to queue list
        queueList.appendChild(div);
    });
}

// Initialize the queue display
updateQueueDisplay();
