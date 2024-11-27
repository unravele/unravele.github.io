const ravelWorks = [
    { title: "Boléro", videoId: "cmNEvSFWftc", startTime: 0, endTime: 870 },
    { title: "Daphnis et Chloé", videoId: "O4lzPz3NnI0", startTime: 12, endTime: 3290 },
    { title: "Gaspard de la nuit", videoId: "TQSyRXRuk6Y", startTime: 17, endTime: 1250 },
    { title: "La Valse", videoId: "ghY2ak8YoBM", startTime: 1, endTime: 671 },
    { title: "Left Hand Piano Concerto", videoId: "dYURhyb5mCs", startTime: 36, endTime: 1110 },
    { title: "Ma Mère l'Oye (Mother Goose) (Orchestral)", videoId: "N_ENSdLOblk", startTime: 44, endTime: 1090 },
    { title: "Pavane pour une infante défunte (Orchestral)", videoId: "DVtNt-6OTM8", startTime: 20, endTime: 420 },
    { title: "Pavane pour une infante défunte (Piano)", videoId: "7ASYm3K_PwM", startTime: 5, endTime: 375 },
    { title: "Piano Concerto in G", videoId: "gAtzmCGMNfI", startTime: 2, endTime: 1230 },
    { title: "Rapsodie Espagnole", videoId: "KDUNEJTGmVU", startTime: 37, endTime: 950 },
    { title: "Sonatine", videoId: "uFLsJrQ-III", startTime: 4, endTime: 690 },
    { title: "String Quartet in F", videoId: "O4a-BNQgqqE", startTime: 7, endTime: 1780 },
    { title: "Tzigane", videoId: "t4tkjHFf2QE", startTime: 1, endTime: 570 },
    { title: "Valses nobles et sentimentales", videoId: "9cfIKdKVwb8", startTime: 7, endTime: 900 },
];

let currentWork = null; // To store the currently playing work
let isGameRunning = false; // To track if the game is ongoing
let score = 0; // Initialize the score counter
let timerInterval = null; // To store the timer interval
let timeRemaining = 60; // Start with 1 minute for the game
let audioPlayer; // YouTube Player reference
let player_ready = false;

function onYouTubeIframeAPIReady() {
    audioPlayer = new YT.Player('youtube-audio', {
        height: '0', // Hide the player
        width: '0',
        videoId: '', // No video loaded initially
        playerVars: {
            autoplay: 1, // Automatically play the video
            controls: 0, // Hide controls
            showinfo: 0, // Hide video info
        },
        events: {
            onReady: () => {
                console.log("YouTube Player Ready");
                player_ready = true;
            },
            onError: (event) => console.error("YouTube Player Error:", event.data),
        },
    });
}

// Function to check player readiness and reinitialize if necessary
function checkPlayerReady() {
    if (!player_ready) {
        console.log("Player not ready. Reinitializing...");
        onYouTubeIframeAPIReady(); // Reinitialize the player
    }
}

// Start checking every 3 seconds
setInterval(checkPlayerReady, 3000);


// function onYouTubeIframeAPIReady() {
//     audioPlayer = new YT.Player('youtube-player', {
//         height: '315',
//         width: '560',
//         videoId: '', // No video loaded initially
//         playerVars: {
//             autoplay: 1, // Automatically play the video
//             controls: 1, // Show player controls
//             modestbranding: 1, // Minimal YouTube branding
//             rel: 0, // Disable related videos at the end
//             showinfo: 0, // Hide video info
//         },
//         events: {
//             onReady: () => console.log("YouTube Player Ready"),
//             onError: (event) => console.error("YouTube Player Error:", event.data),
//         },
//     });
// }


function playRandom() {
    currentWork = ravelWorks[Math.floor(Math.random() * ravelWorks.length)];
    const outputDiv = document.getElementById("output");
    outputDiv.innerHTML = `<h2>Now Playing...</h2>`;
    
    if (audioPlayer) {
        let start = currentWork.startTime;
        let end = currentWork.endTime;
        let startSeconds = Math.floor(Math.random() * (end - start) + start);
        console.log("currentWork", currentWork);
        console.log("startSeconds", startSeconds);
        audioPlayer.loadVideoById({
            videoId: currentWork.videoId,
            startSeconds: startSeconds
        });
    }
}

// function playRandom() {
//     currentWork = ravelWorks[Math.floor(Math.random() * ravelWorks.length)];
//     const outputDiv = document.getElementById("output");
//     outputDiv.innerHTML = `<h2>Now Playing: ${currentWork.title}</h2>`;

//     if (audioPlayer) {
//         audioPlayer.loadVideoById({
//             videoId: currentWork.videoId,
//             startSeconds: Math.floor(Math.random() * audioPlayer.getDuration()), // Start at a random time
//         });
//     }
// }


function stopGame() {
    const startPauseButton = document.getElementById("startPauseButton");
    const outputDiv = document.getElementById("output");
    const feedbackDiv = document.getElementById("feedback");

    isGameRunning = false; // Update game status
    startPauseButton.textContent = "Start"; // Update button text
    clearInterval(timerInterval); // Stop the timer
    timeRemaining = 60; // Reset the timer
    updateTimer(); // Update the displayed timer
    outputDiv.innerHTML = ""; // Clear the playing message
    feedbackDiv.innerHTML = ""; // Clear feedback

    if (audioPlayer) {
        audioPlayer.stopVideo(); // Stop the YouTube video
    }
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

        if (audioPlayer) {
            audioPlayer.pauseVideo(); // Pause YouTube audio
        }

        clearInterval(timerInterval); // Pause the timer
    } else {
        // if player is not ready, don't do anything
        if (!player_ready) {
            console.log("player not ready");
            // onYouTubeIframeAPIReady();
            return;
        }
        // Start the game
        isGameRunning = true;
        startPauseButton.textContent = "Pause";

        if (audioPlayer && currentWork) {
            const currentTime = audioPlayer.getCurrentTime(); // Get current playback position
            audioPlayer.seekTo(currentTime, true); // Resume playback at the same position
            audioPlayer.playVideo(); // Resume video
        } else {
            playRandom(); // Start a new random video if none is currently playing
        }

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

            if (audioPlayer) {
                audioPlayer.stopVideo(); // Stop YouTube playback
            }

            isGameRunning = false; // Stop the game
            const startPauseButton = document.getElementById("startPauseButton");
            startPauseButton.style.display = "none"; // Hide the button

            // Show the correct answer if feedback is empty
            const feedbackDiv = document.getElementById("feedback");
            if (!feedbackDiv.textContent.trim()) {
                feedbackDiv.innerHTML = `<p style="color: #ff6f00;">The correct answer was: ${currentWork.title}</p>`;
            }
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
            playRandom(); // Play the next piece
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
