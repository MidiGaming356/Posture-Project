// Log to confirm that Teachable Machine library is available
console.log("Teachable Machine Library:", tmImage);

// Basic posture check function for initial testing
function checkPosture() {
    alert("Posture check initiated!");
}

// Confirm JavaScript is connected
console.log("JavaScript is connected and ready to go!");

let model, webcam, labelContainer, maxPredictions;

// Load the Teachable Machine model
async function init() {
    const modelURL = "https://teachablemachine.withgoogle.com/models/eLSXrnXL9/model.json";
    const metadataURL = "https://teachablemachine.withgoogle.com/models/eLSXrnXL9/metadata.json";

    try {
        // Load the model and metadata
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();
        console.log("Model loaded successfully:", model);
    } catch (error) {
        console.error("Model failed to load:", error);
        return; // Exit if model fails to load
    }

    // Initialize the webcam
    const flip = true;
    webcam = new tmImage.Webcam(200, 200, flip);
    try {
        await webcam.setup();
        await webcam.play();
        window.requestAnimationFrame(loop);
        console.log("Webcam setup successful");
    } catch (error) {
        console.error("Webcam failed to setup:", error);
        return;
    }

    // Append the webcam canvas to the body
    document.body.appendChild(webcam.canvas);
    labelContainer = document.createElement("div");
    document.body.appendChild(labelContainer);
}

// Loop to update the webcam and run predictions
async function loop() {
    webcam.update();
    await predict();
    window.requestAnimationFrame(loop);
}

// Prediction function
async function predict() {
    const prediction = await model.predict(webcam.canvas);
    labelContainer.innerHTML = ""; // Clear previous results

    // Log each prediction for debugging
    prediction.forEach((pred, i) => {
        console.log(`Prediction ${i}:`, pred.className, pred.probability);
    });

    // Display prediction labels and confidence
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction = `${prediction[i].className}: ${prediction[i].probability.toFixed(2)}`;
        labelContainer.innerHTML += classPrediction + "<br>";
    }

    // Check for poor posture based on model output
    if (prediction[0].className === "Poor Posture" && prediction[0].probability > 0.9) {
        alert("Please correct your posture!");
    }
}

// Initialize model and webcam on page load
init();
