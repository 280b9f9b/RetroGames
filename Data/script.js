fetch('Data/version.json')
        .then(function (response) {
        return response.json();
})
        .then(function (data) {
        appendData(data);
})
        .catch(function (err) {
        console.log('error: ' + err);
});

function gameTemplate(gamex) {
        return `
        <li><div class="GameBox"><a href="Data/Roms/${gamex.name}.html"><img class="GameCover" src="Data/Covers/${gamex.name}.jpg"></a>
        <div class="GameText">${gamex.name}</div></div></li>
        `;
}

function appendData(data) {
        var mainContainer = document.getElementById("app").innerHTML = `
        <h1 class="GameHeader">Sega Master System (${data.length})</h1>
        ${data.map(gameTemplate).join("")}
        <p class="GameFooter">These ${data.length} Games were added recently. Check back soon for updates.</p>
        `;
}
