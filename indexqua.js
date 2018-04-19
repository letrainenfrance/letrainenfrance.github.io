// PREMIERE ETAPE : Definition des variables globales utilisées par d3 pour le rendu
// et par d'autres functions dans le code

var width = 1000,
    height = 800,
    formatNumber = d3.format("s");

var projection = d3.geoAlbers()
    .center([0, 49.5])
    .rotate([-2.8, 3])
    .parallels([45, 55])
    .scale(4000)
    .translate([width / 2, height / 2]);

var path = d3.geoPath()
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


// On peut ici retravailler les données parsées : par exemple,
// ne prendre que les coords de l'années 1980
function selectCities(data, year) {
    let result_20171980 = [];
    data.forEach((city) => {
        if (Number(city.Annee) == year) {
            result_20171980.push([city.Ville, Number(city.longpoly), Number(city.latpoly), Number(city.longcote),Number(city.latcote),city.Annee,city.Zone])
        }
    });

    // let result_total = [];
    // data.forEach((city) => {
    //     result_total.push([city.Ville, Number(city.Longitude), Number(city.Latitude), city.Annee])
    // });

    return result_20171980;
    // return result_total;
}

// TROISIEME ETAPE : On dessine !
function drawFrance(france) {
    var regions = svg.selectAll(".departements")
        .data(topojson.feature(france, france.objects.regions).features)
        .enter()
            .append("path")
            .attr("class", "departements")
            .attr("d", path)
            .attr("stroke","black")
            .attr("stroke-width","0.1")
            .style("fill","dff2ff");
}

function drawCities(cities) {
    var circles = svg.selectAll("circle").data(cities)

    circles
        .exit()
            .remove();

    circles
        .enter()
            .append("circle")
        .merge(circles)
    		.attr("cx", function (d) {
                return projection([d[1], d[2]])[0];
            })
    		.attr("cy", function (d) {
                return projection([d[1], d[2]])[1];
            })
    		.attr("r", "4px")
    		.attr("fill", "#C75A68");
    
    return cities;
 }

function drawLines(cities) {
     var lines = svg.selectAll("line").data(cities)
    
    lines
        .exit()
            .remove();
    
    lines
        .enter()
            .append("line")
        .merge(lines)
            .attr("x1", function (d) {
                return projection([d[1], d[2]])[0];
            })
            .attr("y1", function (d) {
                return projection([d[1], d[2]])[1];
            })
            .attr("x2", function (d) {
                return projection([d[3], d[4]])[0];
            })
            .attr("y2", function (d) {
                return projection([d[3], d[4]])[1];
            })
            .attr("stroke-width", function(d){
    if(d[6] == "2h") {
        return "4";
    } else {
        return "2";
    }
})
            .attr("stroke", function(d){
    if(d[6] == "2h") {
        return "#82E0AA";
    } else {
        return "#F39C12";
    }
})
            .style("stroke-dasharray", ("13, 3"))
    ;
    return cities;

}

// Et on appelle toutes les promesses à la fin, dans le bon ordre
function main(err, france) {
    var selectedYear = document.getElementById("amount").value;

    Promise.resolve()
        .then(() => drawFrance(france)) // On dessine le fond de carte
        .then(() => readCSV("data_polygones.csv")) // on prend les données des villes
        .then(data => selectCities(data, selectedYear)) // On les travaille un peu
        .then(cities => drawCities(cities)) // On les dessine
        .then(cities => drawLines(cities))
        .then(nb => console.log(nb + ' points affichés'));
}

// Triggered when input changes
function handleYearChange() {
    var selectedYear = document.getElementById("amount").value;

    Promise.resolve()
        .then(() => readCSV("data_polygones.csv")) // on prend les données des villes
        .then(data => selectCities(data, selectedYear)) // On les travaille un peu
        .then(cities => drawCities(cities)) // On les dessine
        .then(cities => drawLines(cities))
        .then(nb => console.log(nb + ' points affichés'));
}

// DERNIERE ETAPE
//Dès que le JSON de la carte de France est chargé, la fonction main est lancée !
 queue()
    .defer(d3.json, "https://api.myjson.com/bins/dw4e3")
    .await(main);