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

window.onload = (event) => {
    let table = document.getElementById('member-table');

    // Retrieve member from API.
    fetch('http://localhost:8000/members/')
        .then(response => response.json())
        .then(data => {
            console.log("Data Loaded");

            data.forEach(element => {
                let row = document.createElement('tr');
                
                row.innerHTML = 
                    `<td>${element.id}</td>` + 
                    `<td>${element.firstName}</td>` + 
                    `<td>${element.lastName}</td>` + 
                    `<td>${element.rating}</td>` + 
                    `<td>${element.gamesPlayed}</td>` +
                    `<td>${element.dateJoined}</td>` +
                    `<td>${element.dateOfBirth}</td>`;

                table.appendChild(row);
            });
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}
