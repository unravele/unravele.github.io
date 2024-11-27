// huh

const ravelWorks = [
    { title: "Boléro", url: "audio_files/bolero.mp3" },
    { title: "Daphnis et Chloé Suite No. 1", url: "audio_files/daphnis-et-chloe-suite-1.mp3" },
    { title: "Daphnis et Chloé Suite No. 2", url: "audio_files/daphnis-et-chloe-suite-2.mp3" },
    // { title: "Gaspard de la nuit", url: "audio_files/gaspard-de-la-nuit.mp3" },
    { title: "Left Hand Piano Concerto", url: "audio_files/left-hand-piano-concerto.mp3" },
    { title: "Ma mère l'Oye (Mother Goose) (orchestra)", url: "audio_files/ma-mer-lOye-mother-goose-orchestra.mp3" },
    { title: "Pavane pour une infante défunte (orchestra)", url: "audio_files/pavane-orchestra.mp3" },
    { title: "Pavane pour une infante défunte (piano)", url: "audio_files/pavane-pour-une-infante-defunte.mp3" },
    { title: "Piano Concerto in G major", url: "audio_files/piano-concerto-in-g-major.mp3" },
    { title: "Rapsodie espagnole", url: "audio_files/rapsodie-espagnole.mp3" },
    { title: "Sonatine", url: "audio_files/sonatine.mp3" },
    // { title: "String Quartet in F major", url: "audio_files/string-quartet-in-f-major.mp3" },
    { title: "Tzigane", url: "audio_files/tzigane.mp3" },
    { title: "Une barque sur l'océan (orchestral arrangement)", url: "audio_files/Une-barque-sur-locean-orchestral-arrangement.mp3" },
    { title: "Valses nobles et sentimentales", url: "audio_files/valses-nobles-et-sentimentales.mp3" },
    // Add more works here
];

let currentWork = null; // To store the currently playing work
let isGameRunning = false; // To track if the game is ongoing
let currentAudio = null; // To store the currently playing audio element
let score = 0; // Initialize the score counter
let timerInterval = null; // To store the timer interval
let timeRemaining = 60; // Start with 2 minutes (120 seconds)

function playRandom() {
    currentWork = ravelWorks[Math.floor(Math.random() * ravelWorks.length)];
    const outputDiv = document.getElementById("output");
    const feedbackDiv = document.getElementById("feedback");
    feedbackDiv.innerHTML = ""; // Clear previous feedback

    const audio = document.createElement("audio");
    audio.src = currentWork.url;
    audio.autoplay = true;

    audio.addEventListener("loadedmetadata", () => {
        const maxStart = Math.floor(audio.duration) - 10;
        const randomStart = Math.max(0, Math.floor(Math.random() * maxStart));
        audio.currentTime = randomStart;
    });

    if (currentAudio) currentAudio.pause(); // Stop any currently playing audio
    currentAudio = audio;

    outputDiv.innerHTML = `<h2>Now Playing...</h2>`;
    outputDiv.appendChild(audio);
}

function stopGame() {
    const startPauseButton = document.getElementById("startPauseButton");
    const outputDiv = document.getElementById("output");
    const feedbackDiv = document.getElementById("feedback");

    isGameRunning = false; // Update game status
    startPauseButton.textContent = "Start"; // Update button text
    clearInterval(timerInterval); // Stop the timer
    timeRemaining = 120; // Reset the timer
    updateTimer(); // Update the displayed timer
    outputDiv.innerHTML = ""; // Clear the playing message
    feedbackDiv.innerHTML = ""; // Clear feedback

    if (currentAudio) currentAudio.pause(); // Stop any audio playback
    currentAudio = null; // Clear the current audio reference
    currentWork = null; // Clear the current work
    score = 0; // Reset score when the game stops
    updateScore(); // Update the displayed score
}



function toggleGame() {
    const startPauseButton = document.getElementById("startPauseButton");
    if (isGameRunning) {
        // Pause the game
        isGameRunning = false;
        startPauseButton.textContent = "Start";
        if (currentAudio) currentAudio.pause();
        clearInterval(timerInterval); // Pause the timer
    } else {
        // Start the game
        isGameRunning = true;
        startPauseButton.textContent = "Pause";
        playRandom(); // Start playing
        startTimer(); // Start the timer
    }
}


function startTimer() {
    clearInterval(timerInterval); // Clear any existing timer interval
    timerInterval = setInterval(() => {
        if (timeRemaining > 0) {
            timeRemaining--;
            updateTimer(); // Update the displayed timer
        } else {
            clearInterval(timerInterval); // Stop the timer when time runs out
            const timerSpan = document.getElementById("timer");
            timerSpan.textContent = "Time's up!"; // Change the timer to "Time's up!"
            if (currentAudio) currentAudio.pause(); // Stop audio playback
            isGameRunning = false; // Stop the game
            const startPauseButton = document.getElementById("startPauseButton");
            startPauseButton.style.display = "none"; // Hide the button
        }
    }, 1000);
}



function updateTimer() {
    const timerSpan = document.getElementById("timer");
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    timerSpan.textContent = `${minutes.toString()}:${seconds
        .toString()
        .padStart(2, "0")}`;
}

function checkGuess() {
    const guessInput = document.getElementById("guess").value.trim();
    const feedbackDiv = document.getElementById("feedback");

    if (!currentWork) {
        feedbackDiv.innerHTML = `<p style="color: red;">No piece is currently playing. Play a piece first!</p>`;
        return;
    }

    if (guessInput.toLowerCase() === currentWork.title.toLowerCase()) {
        feedbackDiv.innerHTML = `<p style="color: lightgreen;">Correct! The piece is "${currentWork.title}".</p>`;
        score++; // Increment the score
        updateScore(); // Update the displayed score

        // Automatically play the next piece
        setTimeout(() => {
            if (isGameRunning) {
                playRandom(); // Start playing the next piece if the game is still running
                document.getElementById("guess").value = ""; // Clear the input box for the next guess
                feedbackDiv.innerHTML = ""; // Clear feedback for the next round
            }
        }, 1000); // Delay for 1 second to let the user see the feedback
    } else {
        feedbackDiv.innerHTML = `<p style="color: red;">Incorrect. Try again!</p>`;
    }
}

function updateSuggestions() {
    const guessInput = document.getElementById("guess").value.trim().toLowerCase();
    const suggestionsDiv = document.getElementById("suggestions");
    suggestionsDiv.innerHTML = ""; // Clear previous suggestions

    if (!guessInput) return; // Exit if input is empty

    const suggestions = ravelWorks
        .filter(work => work.title.toLowerCase().includes(guessInput))
        .map(work => work.title);

    suggestions.forEach(title => {
        const li = document.createElement("li");
        li.textContent = title;
        li.onclick = () => {
            document.getElementById("guess").value = title;
            suggestionsDiv.innerHTML = ""; // Clear suggestions when an item is clicked
            checkGuess(); // Automatically check the guess
        };
        suggestionsDiv.appendChild(li);
    });
}

function handleKeyDown(event) {
    if (event.key === "Enter") {
        const suggestionsDiv = document.getElementById("suggestions");
        const topSuggestion = suggestionsDiv.querySelector("li");

        if (topSuggestion) {
            // If suggestions exist, set the input to the top suggestion and clear suggestions
            document.getElementById("guess").value = topSuggestion.textContent;
            suggestionsDiv.innerHTML = "";
        }

        checkGuess(); // Submit the answer
    }
}

function skipGame() {
    if (isGameRunning && currentWork) {
        const feedbackDiv = document.getElementById("feedback");

        // Display the correct answer
        feedbackDiv.textContent = `The correct answer was: ${currentWork.title}`;
        feedbackDiv.style.color = "#ff6f00"; // Highlight the feedback

        // Pause for 1 second before skipping to the next piece
        setTimeout(() => {
            const startPauseButton = document.getElementById("startPauseButton");
            startPauseButton.click(); // Pause the game
            startPauseButton.click(); // Restart the game
            feedbackDiv.textContent = ""; // Clear the feedback
        }, 1000);
    }
}


function updateScore() {
    const scoreSpan = document.getElementById("score");
    scoreSpan.textContent = score; // Update the score display
}


function restartGame() {
    location.reload(); // Reload the current page
}
