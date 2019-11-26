const container = document.querySelector('#container');
const generator = document.querySelector('#generator');
const fullList = document.querySelector('#full-list');
const loader = `<div class="loader-wrapper"><div class="loader-text">Loading...</div><span class="loader"><span class="loader-inner"></span></span></div>`;
var pagination = 8;
var page = 0;
var typesOut;
var out = '';
generatorInit();
document.querySelector('.full-list-btn').addEventListener('click', function() {
    fullListInit();
})
document.querySelector('.generator-btn').addEventListener('click', function() {
    generatorInit();
})
document.querySelector('#random').addEventListener('click', function() {
    container.innerHTML = loader;
    var searchPokemon = Math.floor(Math.random() * 807) + 1;
    typesOut = '';
    printSingleCard(searchPokemon);
})
document.querySelector('.search-btn').addEventListener('click', function() {
    if (fullList.style.display == 'flex') {
        generatorInit();
    }
    container.innerHTML = loader;
    var input = document.querySelector('.search-txt').value;
    var searchPokemon = input.toLowerCase();
    typesOut = '';
    printSingleCard(searchPokemon);
    document.querySelector('.search-txt').value = '';
})
document.querySelector('.move-btn').addEventListener('click', function() {
    var pageValue = document.querySelector('.page-value').value;
    if(pageValue < 102) {
        container.innerHTML = loader;
        out = '';
        page = parseInt(pageValue - 1);
        printPage();
        showPageCounter();
        document.querySelector('.page-value').value = '';
    }
})
document.querySelector('#next').addEventListener('click', function () {
    if (page < 100) {
        container.innerHTML = loader;
        out = '';
        page++;
        printPage();
        showPageCounter();
    }
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
                        if (pokemon.id < 808) {
                            typesOut = '';
                            for (let i = pokemon.types.length - 1; i >= 0; i--) {
                            createType(pokemon.types[i].type.name);
                            }
                            const pokeInfo = new Array(pokemon.species.name, pokemon.sprites.front_default, pokemon.stats[4].stat.name, pokemon.stats[4].base_stat, pokemon.stats[3].stat.name, pokemon.stats[3].base_stat, pokemon.stats[0].stat.name, pokemon.stats[0].base_stat, pokemon.stats[5].stat.name, pokemon.stats[5].base_stat, pokemon.height, pokemon.weight, pokemon.id);
                            createCard(pokeInfo);
                            
                            container.innerHTML = out;
                            checkType();
                        }
                    })
                .catch(err => console.error(err));
            }
        })
    .catch(err => console.error(err));
}
function printSingleCard(searchPokemon) {
    var url = "https://pokeapi.co/api/v2/pokemon/" + searchPokemon + "/";
    fetch(url)
        .then(data => data.json())
        .then(jsonObject => {
            const pokemon = jsonObject;
            for (let i = pokemon.types.length - 1; i >= 0; i--) {
                createType(pokemon.types[i].type.name);
            }
            const pokeInfo = new Array(pokemon.species.name, pokemon.sprites.front_default, pokemon.stats[4].stat.name, pokemon.stats[4].base_stat, pokemon.stats[3].stat.name, pokemon.stats[3].base_stat, pokemon.stats[0].stat.name, pokemon.stats[0].base_stat, pokemon.stats[5].stat.name, pokemon.stats[5].base_stat, pokemon.height, pokemon.weight, pokemon.id);
            createCard(pokeInfo);
            container.innerHTML = out;
            checkType();
        })
    .catch(e => {
        alert('Connection timed out or incorrect input. Error message: ' + e);
        generatorInit();
    })
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
function fullListInit() {
    generator.style.display = 'none';
    fullList.style.display = 'flex';
    out = '';
    printPage();
}
function generatorInit() {
    out = '';
    fullList.style.display = 'none';
    generator.style.display = 'flex';
    container.innerHTML = `<div class="info">
                        <h1>Pokemon card generator</h1>
                        <h3>Here you can draw a random pokemon by clicking 'random' button<br />
                        or<br />
                        you can use search box to type in any pokemon name you know or their id between 1 and 807</h3>
                        <h1>Full pokemon list</h1>
                        <h3>By clicking FULL LIST button you can see full pokemon list,<br /> it contains over 800 pokemons!
                        </div> 
    `;
}