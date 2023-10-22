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
