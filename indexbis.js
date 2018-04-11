// PREMIERE ETAPE : Definition des variables globales utilisées par d3 pour le rendu
// et par d'autres functions dans le code

// A ENLEVER A TERME
var paris = [2.35, 48.85];
var lyon = [4.85, 45.75];
// var marseille = [Longitudebis[6], Latitudebis[6]];
var toulouse = [1.44, 43.60];
var cc = [paris, lyon, toulouse];

var width = 960,
    height = 500,
    formatNumber = d3.format("s");

var color = d3.scale.threshold()
  .domain([250000, 500000, 750000, 1000000, 1250000, 1500000, 1750000])
  .range(["#deebf7","#c6dbef","#9ecae1","#6baed6","#4292c6","#2171b5","#08519c","#08306b"]);

var projection = d3.geo.albers()
  .center([0, 49.5])
  .rotate([-2.8, 3])
  .parallels([45, 55])
  .scale(2500)
  .translate([width / 2, height / 2]);

var path = d3.geo.path()
  .projection(projection);

var svg = d3.select('body')
  .append("svg")
  .attr("width", width)
  .attr("height", height);

// DEUXIEME ETAPE : On va écrire notre fonction pour lire notre tableau CSV
// Si tu comprends pas le code, passe à la suite, tu as juste besoin de savoir
// que la fonction donnera en sortie, le csv parsé
function readCSV(path_to_csv) {
  return new Promise(function(resolve, reject) {
    d3.csv(path_to_csv, function(err, data) {
      
      resolve(data);
    })
  });
}

// On peut ici retravailler les données parsées : genre par exemple,
// ne prendre que les coords de l'années 1980
function changeData(data) {
  let result_1980 = [];
  data.forEach((city) => {
    if (Number(city.Annee) == 1980) {
 result_1980.push([Number(city.Longitude), Number(city.Latitude)])
   }
});

  let result_total = [];
  data.forEach((city) => {
    result_total.push([city.Ville, Number(city.Longitude), Number(city.Latitude)])
  });
  return result_total;
}

// TROISIEME ETAPE : On dessine !
function drawFrance(france) {
  var regions = svg.selectAll(".departements")
    .data(topojson.feature(france, france.objects.regions).features)
    .enter().append("path")
    .attr("class", "departements")
    .attr("d", path)
    .style("fill","lightblue");
}

function drawCities(cities) {
  svg.selectAll("circle")
		.data(cities).enter()
		.append("circle")
		.attr("cx", function (d) { return projection([d[1], d[2]])[0]; })
		.attr("cy", function (d) { return projection([d[1], d[2]])[1]; })
		.attr("r", "3px")
		.attr("fill", "red");

  return cities;
 }

function writenames(cities) {
  svg.selectAll("text")
    .data(cities).enter()
    .append("svg:text")
    .text(function(d){
        return d[0];})
    .attr("x", function(d){
        return projection([d[1], d[2]])[0];})
    .attr("y", function(d){
        return  projection([d[1], d[2]])[1];})
    .attr("text-anchor","middle")
    .attr('font-size','6pt');
    
  return cities.length;
  };

// Et on appelle toutes les promesses à la fin, dans le bon ordre
 function main(err, france) {
   Promise.resolve().then(() => drawFrance(france)) // On dessine le fond de carte
    .then(() => readCSV("data_latlong.csv")) // on prend les données des villes
    .then(data => changeData(data)) // On les travaille un peu
    .then(cities => drawCities(cities)) // On les dessine
    .then(cities => writenames(cities))
    .then(nb => console.log(nb + ' points affichés')); 
 }

// DERNIERE ETAPE
//Dès que le JSON de la carte de France est chargé, la fonction main est lancée !
 queue()
     .defer(d3.json, "https://api.myjson.com/bins/dw4e3")
     .await(main);
