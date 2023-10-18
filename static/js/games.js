// Name variables for html elements.
const form = document.getElementById("form");
const datePlayed = document.getElementById("datePlayed");
const whiteId = document.getElementById("whiteID");
const blackId = document.getElementById("blackID");
const result = document.querySelector('input[name="result"]:checked');
const pgn = document.getElementById("pgn");
const submit = document.getElementById("submit");

form.addEventListener('submit', addGame);

// Add new game to games table using API.
function addGame(e) {
    e.preventDefault();

    let whiteScore = 1;
    let blackScore = 0;
    let gameResult = result.value;
    if (gameResult === 'black') {
        whiteScore = 0;
        blackScore = 1;
    } else if (gameResult === 'draw') {
        whiteScore = 0.5;
        blackScore = 0.5;
    }

    newGame = {
        datePlayed: datePlayed.value,
        whiteId: whiteId.value,
        blackId: blackId.value,
        whiteScore: whiteScore, //TODO
        blackScore: blackScore, //TODO
        whiteOldRating: whiteOldRating, //TODO
        whiteNewRating: whiteNewRating, //TODO
        blackOldRating: blackOldRating, //TODO
        blackNewRating: blackNewRating, //TODO
        pgn: pgn.value,
    }
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