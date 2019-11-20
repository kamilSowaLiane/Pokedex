const container = document.querySelector('#container');
const pagination = 8;
const url = "https://pokeapi.co/api/v2/pokemon/?limit=" + pagination +"&offset=" + 0*pagination;
var typesOut;
console.log(url);
fetch(url)
.then(data => data.json())
.then(jsonObject => {
    console.log(jsonObject)
    for(let i = 0; i < pagination; i++) {
        fetch(jsonObject.results[i].url)
        .then(pokeData => pokeData.json())
        .then(pokemon => {
            console.log(pokemon);
            typesOut = '';
            for (let i = 0; i < pokemon.types.length; i++) {
              createType(pokemon.types[i].type.name);
            }
            const pokeInfo = new Array(pokemon.species.name, pokemon.sprites.front_default, pokemon.stats[4].stat.name, pokemon.stats[4].base_stat, pokemon.stats[3].stat.name, pokemon.stats[3].base_stat, pokemon.stats[0].stat.name, pokemon.stats[0].base_stat, pokemon.stats[5].stat.name, pokemon.stats[5].base_stat );
            createCard(pokeInfo);          
            container.innerHTML = out; 
        })
    }
})
var out = '';
function createCard(pokeInfo) {
    console.log(pokeInfo);
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
                ${typesOut}
            </div>
        </div>
    `
}
function createType(pokeType) {
    typesOut += `
        <p class="${pokeType}">${pokeType}</p>
    `
}