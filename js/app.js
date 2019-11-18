const url = "https://pokeapi.co/api/v2/pokemon/bulbasaur";
console.log(url);
fetch(url)
.then(data => data.json())
.then(jsonObject => {
    console.log(jsonObject)
}) 