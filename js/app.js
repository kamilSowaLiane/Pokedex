const container = document.querySelector('#container');
var pagination = 8;
var page = 0;
var typesOut;
var out = '';
const loader = `<div class="loader-wrapper"><div class="loader-text">Loading...</div><span class="loader"><span class="loader-inner"></span></span></div>`;
printPage();
document.querySelector('#next').addEventListener('click', function () {
    container.innerHTML = loader;
    out = '';
    page++;
    printPage();
    showPageCounter();
})
document.querySelector('#prev').addEventListener('click', function () {
    if (page > 0) {
        container.innerHTML = loader;
        out = '';
        page--;
        printPage();
        showPageCounter();
    }
})
function printPage() {
    var url = "https://pokeapi.co/api/v2/pokemon/?limit=" + pagination + "&offset=" + page * pagination;
    fetch(url)
        .then(data => data.json())
        .then(jsonObject => {
            for (let i = 0; i < pagination; i++) {
                const promise = fetch(jsonObject.results[i].url);
                promise
                    .then(pokeData => pokeData.json())
                    .then(pokemon => {
                        typesOut = '';
                        for (let i = pokemon.types.length - 1; i >= 0; i--) {
                            createType(pokemon.types[i].type.name);
                        }
                        const pokeInfo = new Array(pokemon.species.name, pokemon.sprites.front_default, pokemon.stats[4].stat.name, pokemon.stats[4].base_stat, pokemon.stats[3].stat.name, pokemon.stats[3].base_stat, pokemon.stats[0].stat.name, pokemon.stats[0].base_stat, pokemon.stats[5].stat.name, pokemon.stats[5].base_stat, pokemon.height, pokemon.weight, pokemon.id);
                        createCard(pokeInfo);
                    })
                    .then(v => {
                        container.innerHTML = out;
                        checkType();
                    })
                    
                    .catch(err => console.error(err));
            }
        })
        .catch(err => console.error(err));
}
function createCard(pokeInfo) {
    out += `
        <div class="card">
            <h1>${pokeInfo[0]}</h1>
            <img src=${pokeInfo[1]}>
            <div class="stats">
                <div><img src="img/sword.png"><p>${pokeInfo[2]} ${pokeInfo[3]}</p></div>
                <div><img src="img/shield.png"><p>${pokeInfo[4]} ${pokeInfo[5]}</p></div>
                <div><img src="img/speed.png"><p>${pokeInfo[6]} ${pokeInfo[7]}</p></div>
                <div><img src="img/heart.png"><p>${pokeInfo[8]} ${pokeInfo[9]}</p></div>
            </div>
            <div class="types">
                <p>Type:</p>
                <div class="typeValues">${typesOut}</div>
            </div>
            <div class="misc">
                <img src="img/weight.png"><p>Weight: ${pokeInfo[11] / 10} kg</p>
                <img src="img/height.png"><p>Height: ${pokeInfo[10] / 10} m</p>
            </div>
            <div class="id">${pokeInfo[12]}</div>
        </div>
    `
}
function createType(pokeType) {
    typesOut += `
        <p class="${pokeType}">${pokeType}</p>
    `
}

function checkType() {
    var cards = document.querySelectorAll('.types');
    Array.from(cards).forEach(card => {
        var cardType = card.children[1].firstElementChild.textContent;
        var typeArr = ['bug', 'dark', 'normal', 'fire', 'dragon', 'flying', 'electric', 'fairy', 'fighting', 'ghost', 'poison', 'grass', 'ground', 'ice', 'steel', 'psychic', 'rock', 'water'];
        for (let i = 0; i < typeArr.length; i++) {
            if (cardType == typeArr[i]) {
                card.parentElement.firstElementChild.classList.add(typeArr[i]);
                card.parentElement.lastElementChild.classList.add(typeArr[i]);
                card.parentElement.classList.add(typeArr[i] + '2');
                break;
            }
        }
    })
}
function showPageCounter() {
    const pageCounter = document.querySelectorAll('#full-list p')[0];
    pageCounter.innerHTML = "Page: " + parseInt(page + 1);
}
showPageCounter();