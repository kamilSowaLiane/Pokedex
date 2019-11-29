const container = document.querySelector('#container');
const generator = document.querySelector('#generator');
const fullList = document.querySelector('#full-list');
const loader = `<div class="loader-wrapper"><div class="loader-text">Loading...</div><span class="loader"><span class="loader-inner"></span></span></div>`;
var pagination = 8;
var page = 0;
var out = '';
generatorInit();
document.querySelector('.full-list-btn').addEventListener('click', function () {
    fullListInit();
})
document.querySelector('.generator-btn').addEventListener('click', function () {
    generatorInit();
})
document.querySelector('#random').addEventListener('click', function () {
    container.innerHTML = loader;
    var searchPokemon = Math.floor(Math.random() * 807) + 1;
    typesOut = '';
    printSingleCard(searchPokemon);
})
document.querySelector('.search-btn').addEventListener('click', function () {
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
document.querySelector('.move-btn').addEventListener('click', function () {
    var pageValue = document.querySelector('.page-value').value;
    if (pageValue < 102) {
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
    fetch(url).then(data => data.json())
        .then(jsonObject => {
            pokemonsArr = jsonObject.results;
            return Promise.all(pokemonsArr.map(rawPokemon => {
                return fetch(rawPokemon.url).then(pokeData => pokeData.json())
                    .then(pokemon => {
                        pokemon.types.sort((a, b) => (a.slot > b.slot) ? 1 : -1)
                        typesOut = ''
                        for (let i = 0; i < pokemon.types.length; i++) {
                            typesOut += createType(pokemon.types[i].type.name);
                        }
                        pokemon = {
                            name: pokemon.species.name,
                            imgUrl: pokemon.sprites.front_default,
                            attack: pokemon.stats[4].stat.name,
                            attackValue: pokemon.stats[4].base_stat,
                            defense: pokemon.stats[3].stat.name,
                            defenseValue: pokemon.stats[3].base_stat,
                            speed: pokemon.stats[0].stat.name,
                            speedValue: pokemon.stats[0].base_stat,
                            hp: pokemon.stats[5].stat.name,
                            hpValue: pokemon.stats[5].base_stat,
                            height: pokemon.height,
                            weight: pokemon.weight,
                            id: pokemon.id,
                            typesOut: typesOut
                        }
                        return pokemon
                    })
            })).then(pokemons => {
                createCards(pokemons);
                checkType();
            })
        })
}

function printSingleCard(searchPokemon) {
    var url = "https://pokeapi.co/api/v2/pokemon/" + searchPokemon + "/";
    fetch(url)
        .then(data => data.json())
        .then(pokemon => {
            pokemon.types.sort((a, b) => (a.slot > b.slot) ? 1 : -1)
            pokemon.typesOut = ''
            for (let i = 0; i < pokemon.types.length; i++) {
                pokemon.typesOut += createType(pokemon.types[i].type.name);
            }
            pokeInfo = {
                name: pokemon.species.name,
                imgUrl: pokemon.sprites.front_default,
                attack: pokemon.stats[4].stat.name,
                attackValue: pokemon.stats[4].base_stat,
                defense: pokemon.stats[3].stat.name,
                defenseValue: pokemon.stats[3].base_stat,
                speed: pokemon.stats[0].stat.name,
                speedValue: pokemon.stats[0].base_stat,
                hp: pokemon.stats[5].stat.name,
                hpValue: pokemon.stats[5].base_stat,
                height: pokemon.height,
                weight: pokemon.weight,
                id: pokemon.id,
                typesOut: typesOut
            }
            return pokeInfo
        }).then(pokemon => {
            createCard(pokemon);
            checkType();
        })
        .catch(e => {
            alert(`Connection timed out or incorrect input. Error message: ` + e);
            generatorInit();
        })
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
                        <h3>On this page you can create your own pokemon list <br /> either by drawing 
                        random pokemon with 'random' button or<br />
                        you can use search box to type in any pokemon name you know or their id between 1 and 807</h3>
                        <h1>Full pokemon list</h1>
                        <h3>By clicking FULL LIST button you can see full pokemon list,<br /> it contains over 800 pokemons!
                        </div> 
    `;
}