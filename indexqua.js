// PREMIERE ETAPE : Definition des variables globales utilisées par d3 pour le rendu
// et par d'autres functions dans le code


var width2 = 1000,
    height2 = 700,
    formatNumber = d3.format("s");

var projection2 = d3.geoAlbers()
    .center([0, 49.5])
    .rotate([-2.8, 3])
    .parallels([45, 55])
    .scale(4000)
    .translate([(width2 / 2 + 100), height2 / 2]);

var path2 = d3.geoPath()
    .projection(projection2);

var svg2 = d3.select('body')
    .append("svg")
    .attr("width", width2)
    .attr("height", height2);

// DEUXIEME ETAPE : On va écrire notre fonction pour lire notre tableau CSV
// Si tu comprends pas le code, passe à la suite, tu as juste besoin de savoir
// que la fonction donnera en sortie, le csv parsé
function readCSV2(path_to_csv) {
    return new Promise(function(resolve, reject) {
        d3.csv(path_to_csv, function(err, data) {
            resolve(data);
        })
    });
}


// On peut ici retravailler les données parsées : par exemple,
// ne prendre que les coords de l'années 1980
function selectCities2(data, year) {
    let result_20171980 = [];
    data.forEach((city2) => {
        if (Number(city2.Annee) == year) {
            result_20171980.push([city2.Ville, Number(city2.longpoly), Number(city2.latpoly), Number(city2.longcote),Number(city2.latcote),city2.Annee,city2.Zone])
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
function drawFrance2(france2) {
    var regions2 = svg2.selectAll(".departements")
        .data(topojson.feature(france2, france2.objects.regions).features)
        .enter()
            .append("path")
            .attr("class", "departements")
            .attr("d", path2)
            .attr("stroke","black")
            .attr("stroke-width","0.01")
            .style("fill","lightblue");
}

function drawCities2(cities2) {
    var circles2 = svg2.selectAll("circle").data(cities2)

    circles2
        .exit()
            .remove();

    circles2
        .enter()
            .append("circle")
        .merge(circles2)
    		.attr("cx", function (d) {
                return projection2([d[1], d[2]])[0];
            })
    		.attr("cy", function (d) {
                return projection2([d[1], d[2]])[1];
            })
    		.attr("r", "4px")
    		.attr("fill", "#C75A68");
    
    return cities2;
 }

function drawLines2(cities2) {
     var lines2 = svg2.selectAll("line").data(cities2)
    
    lines2
        .exit()
            .remove();
    
    lines2
        .enter()
            .append("line")
        .merge(lines2)
            .attr("x1", function (d) {
                return projection2([d[1], d[2]])[0];
            })
            .attr("y1", function (d) {
                return projection2([d[1], d[2]])[1];
            })
            .attr("x2", function (d) {
                return projection2([d[3], d[4]])[0];
            })
            .attr("y2", function (d) {
                return projection2([d[3], d[4]])[1];
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
        return "#E74C3C";
    } else {
        return "#F39C12";
    }
})
            .style("stroke-dasharray", ("13, 3"))
    ;
    return cities2;

}

// Et on appelle toutes les promesses à la fin, dans le bon ordre
function main(err, france2) {
    var selectedYear2 = document.getElementById("amount2").value;

    Promise.resolve()
        .then(() => drawFrance2(france2)) // On dessine le fond de carte
        .then(() => readCSV2("data_polygones.csv")) // on prend les données des villes
        .then(data2 => selectCities2(data2, selectedYear2)) // On les travaille un peu
        .then(cities2 => drawCities2(cities2)) // On les dessine
        .then(cities2 => drawLines2(cities2));
}

// Triggered when input changes
function handleYearChange2() {
    var selectedYear2 = document.getElementById("amount2").value;

    Promise.resolve()
        .then(() => readCSV2("data_polygones.csv")) // on prend les données des villes
        .then(data2 => selectCities2(data2, selectedYear2)) // On les travaille un peu
        .then(cities2 => drawCities2(cities2)) // On les dessine
        .then(cities2 => drawLines2(cities2));
}

// DERNIERE ETAPE
//Dès que le JSON de la carte de France est chargé, la fonction main est lancée !
 queue()
    .defer(d3.json, "https://api.myjson.com/bins/dw4e3")
    .await(main);
