// Name variables for html elements.
const form = document.getElementById("form");
const datePlayed = document.getElementById("datePlayed");
const whiteId = document.getElementById("whiteId");
const blackId = document.getElementById("blackId");
const pgn = document.getElementById("pgn");
const submit = document.getElementById("submit");

form.addEventListener('submit', addGame);

// Add new game to games table using API.
function addGame(e) {
    e.preventDefault();

    // Fetch user ratings from API.
    let whiteOldRating;
    let blackOldRating;
    
    fetch(`http://localhost:8000/members/${whiteId.value}`)
        .then(response => response.json())
        .then(data => {
            whiteOldRating = data.rating;

            fetch(`http://localhost:8000/members/${blackId.value}`)
            .then(response => response.json())
            .then(data => {
                blackOldRating = data.rating;

                // Calls function to post new game once API calls have succeeded.
                postGame(whiteOldRating, blackOldRating);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    
}

// Function which posts new game to the database.
function postGame(wRating, bRating) {
    const result = document.querySelector('input[name="result"]:checked');

    let whiteScore;
    let blackScore;
    let newRatings;
    let whiteNewRating;
    let blackNewRating;
    let gameResult = result.value;
    if (gameResult === 'white') {
        whiteScore = 1;
        blackScore = 0;
        newRatings = ratingCalc(wRating, bRating);
        whiteNewRating = newRatings[0];
        blackNewRating = newRatings[1];
    } else if (gameResult === 'black') {
        whiteScore = 0;
        blackScore = 1;
        newRatings = ratingCalc(bRating, wRating);
        whiteNewRating = newRatings[1];
        blackNewRating = newRatings[0];
    } else {
        // Game is a draw.
        whiteScore = 0.5;
        blackScore = 0.5;
        newRatings = ratingCalc(wRating, bRating, draw=true);
        whiteNewRating = newRatings[0];
        blackNewRating = newRatings[1];
    }
    // New game object to be added.
    newGame = {
        datePlayed: datePlayed.value,
        whiteId: whiteId.value,
        blackId: blackId.value,
        whiteScore: whiteScore, 
        blackScore: blackScore, 
        whiteOldRating: wRating, 
        whiteNewRating: whiteNewRating, 
        blackOldRating: bRating, 
        blackNewRating: blackNewRating, 
        pgn: pgn.value,
    }

    // Convert the data to JSON
    let game = JSON.stringify(newGame);

    // Send a POST request
    fetch('http://localhost:8000/games/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: game,
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        datePlayed.value = '';
        whiteId.value = '';
        blackId.value = '';
        pgn.value = '';
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

// Calculate new ratings after a game.
function ratingCalc(winnerRating, loserRating, draw=false) {
    // K-factor for calculating new ratings.
    const k = 32;
    let winnerScore;
    let loserScore;

    if (draw) {
        winnerScore = 0.5;
        loserScore = 0.5;
    } else {
        winnerScore = 1;
        loserScore = 0;
    }

    let Qw = 10 ** (winnerRating / 400);
    let Ql = 10 ** (loserRating / 400); 

    let Ew = Qw / (Qw + Ql);
    let El = Ql / (Qw + Ql);

    winnerNew = winnerRating + k * (winnerScore - Ew);
    loserNew = loserRating + k * (loserScore - El);

    // Round results to 2 decimal places. 
    winnerNew = Math.round(winnerNew * 100) / 100;
    loserNew = Math.round(loserNew * 100) / 100;
    
    return [winnerNew, loserNew];
}

