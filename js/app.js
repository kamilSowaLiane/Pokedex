const pagination = 8;
const url = "https://pokeapi.co/api/v2/pokemon/?limit=" + pagination +"&offset=" + 0*pagination;
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
            const pokeInfo = new Array(pokemon.species.name, pokemon.sprites.front_default, pokemon.stats[5].stat.name, pokemon.stats[5].base_stat );
            createCard(pokeInfo);
            container.innerHTML = out;
        })
    }
})
var out = '';
const container = document.querySelector('#container');
function createCard(pokeInfo) {
    console.log(pokeInfo);
    out += `
        <div class="card">
            <h1>${pokeInfo[0]}</h1>
            <img src=${pokeInfo[1]}>
            <div class="stats">
                <span><img src="img/heart.png">${pokeInfo[2]} ${pokeInfo[3]}</span>
            </div>
        </div>
    `
}