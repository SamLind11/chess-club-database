// Name variables for html elements.
const form = document.querySelector('#form');
const firstName = document.querySelector('#firstName');
const lastName = document.querySelector('#lastName');
const dob = document.querySelector('#dob');
const submit = document.querySelector('button');

// Initial rating for a new player.
const initRating = 1000;

// Read in data from the form and add member.
form.addEventListener('submit', addMember);

function addMember(e) {
    e.preventDefault();

    // Find today's date, convert to YYYY-MM-DD format.
    let date = new Date();

    // Convert to EST
    let estDate = new Date(date.toLocaleString("en-US", {timeZone: "America/New_York"}));

    // Get the day, month, and year
    let day = estDate.getDate();
    let month = estDate.getMonth() + 1; // Months are zero-based
    let year = estDate.getFullYear();

    // Create a formatted string
    let formattedDate = year + '-' + month + '-' + day;

    // Create new member record from form fields.
    let newMember = {
        firstName: firstName.value,
        lastName: lastName.value,
        rating: initRating,
        gamesPlayed: 0,
        dateOfBirth: dob.value,
        dateJoined: formattedDate
    };

    // Convert the data to JSON
    let data = JSON.stringify(newMember);

    // Send a POST request
    fetch('http://localhost:8000/members/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: data,
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        firstName.value = '';
        lastName.value = '';
        dob.value = '';
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}



// Add member data to the table on members.html.
function loadMembers() {
    let table = document.getElementById('member-table');

    const transaction = db.transaction(['members_tb'], 'readonly');
    const objectStore = transaction.objectStore('members_tb');

    const request = objectStore.openCursor();

    request.onsuccess = () => {
        const cursor = request.result;

        if (cursor) {   
            let row = document.createElement('tr');
            
            row.innerHTML = 
                `<td>${cursor.value.id}</td>` + 
                `<td>${cursor.value.firstName}</td>` + 
                `<td>${cursor.value.lastName}</td>` + 
                `<td>${cursor.value.rating}</td>` + 
                `<td>${cursor.value.dob}</td>`;

            table.appendChild(row);

            cursor.continue();
        } else {
            console.log("Entries all displayed.");
        }
        
    };
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
    return [winnerNew, loserNew];
}

