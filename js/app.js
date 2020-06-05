const container = document.querySelector('#container');
const generator = document.querySelector('#generator');
const fullList = document.querySelector('#full-list');
const loader = `<div class="loader-wrapper"><div class="loader-text">Loading...</div><span class="loader"><span class="loader-inner"></span></span></div>`;
var pagination = 8;
var page = 0;
var out = '';
generatorInit();
document.querySelector('.full-list-btn').addEventListener('click', fullListInit);
document.querySelector('.generator-btn').addEventListener('click', generatorInit);
document.querySelector('#random').addEventListener('click', function () {
    container.innerHTML = loader;
    var searchPokemon = Math.floor(Math.random() * 807) + 1;
    printSingleCard(searchPokemon);
})
document.querySelector('.search-btn').addEventListener('click', function () {
    if (fullList.style.display == 'flex') {
        generatorInit();
    }
    var input = document.querySelector('.search-txt').value;
    if (checkPresent(input) !== true ) {
        container.innerHTML = loader;  
        var searchPokemon = input.toLowerCase();
        printSingleCard(searchPokemon);
        document.querySelector('.search-txt').value = '';
    } else {
        document.querySelector('.search-error').style.display = 'block';
        setTimeout(function () { document.querySelector('.search-error').style.display = 'none' }, 4000);
    }
})
document.querySelector('.move-btn').addEventListener('click', function () {
    var pageValue = document.querySelector('.page-value').value;
    if (pageValue < 102) {
        container.innerHTML = loader;
        page = parseInt(pageValue - 1);
        printPage();
        showPageCounter();
        document.querySelector('.page-value').value = '';
    } else {
        document.querySelector('.error-msg').style.display = 'block';
        setTimeout(function () { document.querySelector('.error-msg').style.display = 'none' }, 4000);
    }
})
document.querySelector('#next').addEventListener('click', function () {
    if (page < 100) {
        container.innerHTML = loader;
        page++;
        printPage();
        showPageCounter();
    }
})
document.querySelector('#prev').addEventListener('click', function () {
    if (page > 0) {
        container.innerHTML = loader;
        page--;
        printPage();
        showPageCounter();
    }
})
function printPage() {
    var url = "https://pokeapi.co/api/v2/pokemon/?limit=" + pagination + "&offset=" + page * pagination;
    fetch(url).then(data => data.json())
        .then(jsonObject => {
            pokemonsArr = jsonObject.results;
            return Promise.all(pokemonsArr.map(rawPokemon => {
                return fetch(rawPokemon.url).then(pokeData => pokeData.json())
                    .then(pokeInfo => {
                        return createPokeObject(pokeInfo)
                    })
            })).then(pokemons => {
                out = '';
                createCards(pokemons);
                checkType();
            })
        })
}
function printSingleCard(searchPokemon) {
    var url = "https://pokeapi.co/api/v2/pokemon/" + searchPokemon + "/";
    fetch(url)
        .then(data => data.json())
        .then(pokeInfo => {
            return createPokeObject(pokeInfo)
        }).then(pokemon => {
            createCard(pokemon);
            checkType();
        })
        .catch(e => {
            alert(`Connection timed out or incorrect input. Error message: ` + e);
            generatorInit();
        })
}
function createPokeObject(pokeInfo) {
    pokeInfo.types.sort((a, b) => (a.slot > b.slot) ? 1 : -1)
    typesOut = ''
    for (let i = 0; i < pokeInfo.types.length; i++) {
        typesOut += createType(pokeInfo.types[i].type.name);
    }
    pokemon = {
        name: pokeInfo.species.name,
        imgUrl: pokeInfo.sprites.front_default,
        attack: pokeInfo.stats[1].stat.name,
        attackValue: pokeInfo.stats[1].base_stat,
        defense: pokeInfo.stats[2].stat.name,
        defenseValue: pokeInfo.stats[2].base_stat,
        speed: pokeInfo.stats[5].stat.name,
        speedValue: pokeInfo.stats[5].base_stat,
        hp: pokeInfo.stats[0].stat.name,
        hpValue: pokeInfo.stats[0].base_stat,
        height: pokeInfo.height,
        weight: pokeInfo.weight,
        id: pokeInfo.id,
        typesOut: typesOut
    }
    return pokemon
}
function createCard(pokemon) {
    out += `
        <div class="card">
            <h1>${pokemon.name}</h1>
            <img src=${pokemon.imgUrl}>
            <div class="stats">
                <div><img src="img/sword.png"><p>${pokemon.attack} ${pokemon.attackValue}</p></div>
                <div><img src="img/shield.png"><p>${pokemon.defense} ${pokemon.defenseValue}</p></div>
                <div><img src="img/speed.png"><p>${pokemon.speed} ${pokemon.speedValue}</p></div>
                <div><img src="img/heart.png"><p>${pokemon.hp} ${pokemon.hpValue}</p></div>
            </div>
            <div class="types">
                <p>Type:</p>
                <div class="typeValues">${pokemon.typesOut}</div>
            </div>
            <div class="misc">
                <img src="img/weight.png"><p>Weight: ${pokemon.weight / 10} kg</p>
                <img src="img/height.png"><p>Height: ${pokemon.height / 10} m</p>
            </div>
            <div class="id">${pokemon.id}</div>
        </div>
        `
    container.innerHTML = out;
}
function createCards(pokemons) {
    for (let i = 0; i < pokemons.length; i++) {
        createCard(pokemons[i]);
    }
}
function createType(pokeType) {
    return `<p class="${pokeType}">${pokeType}</p>`
}

function checkType() {
    var types = document.querySelectorAll('.types');
    Array.from(types).forEach(type => {
        var cardType = type.children[1].firstElementChild.textContent;
        var typeArr = ['bug', 'dark', 'normal', 'fire', 'dragon', 'flying', 'electric', 'fairy', 'fighting', 'ghost', 'poison', 'grass', 'ground', 'ice', 'steel', 'psychic', 'rock', 'water'];
        for (let i = 0; i < typeArr.length; i++) {
            if (cardType == typeArr[i]) {
                type.parentElement.firstElementChild.classList.add(typeArr[i]);
                type.parentElement.lastElementChild.classList.add(typeArr[i]);
                type.parentElement.classList.add(typeArr[i] + '2');
                break;
            }
        }
    })
}
function checkPresent(input) {
    var inputValue = input.toLowerCase();
    var cards = document.querySelectorAll('.card');
    for (var i = 0; i < cards.length; i++) {
        if (cards[i].firstElementChild.textContent === inputValue) {
            return true
        }
    }  
}
function showPageCounter() {
    const pageCounter = document.querySelectorAll('#full-list p')[0];
    pageCounter.innerHTML = "Page: " + parseInt(page + 1);
}
function fullListInit() {
    generator.style.display = 'none';
    fullList.style.display = 'flex';
    printPage();
    showPageCounter();
}
function generatorInit() {
    out = '';
    fullList.style.display = 'none';
    generator.style.display = 'flex';
    container.innerHTML = `<div class="info">
                        <h1>Pokemon card generator</h1>
                        <h3>On this page you can create your own pokemon list <br /> either by drawing 
                        random pokemon with 'random' button or<br />
                        you can use search box to type in any pokemon name you know or their id between 1 and 807</h3>
                        <h1>Full pokemon list</h1>
                        <h3>By clicking FULL LIST button you can see full pokemon list,<br /> it contains over 800 pokemons!
                        </div> 
    `;
}
console.log(window.innerWidth)