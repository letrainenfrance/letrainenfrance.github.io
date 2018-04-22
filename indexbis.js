var width = 1000,
    height = 700,
    formatNumber = d3.format("s");

var projection = d3.geoAlbers()
    .center([0, 49.5])
    .rotate([-2.8, 3])
    .parallels([45, 55])
    .scale(4000)
    .translate([(width / 2 +100 ), height / 2 ]);

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
            result_20171980.push([city.Ville,
                                  Number(city.longitudebis),
                                  Number(city.latitudebis),
                                  city.Annee,
                                  Number(city.Longitude),
                                  Number(city.Latitude), city.Time])
        }
    });

    return result_20171980;
    }

// TROISIEME ETAPE : On dessine !
function drawFrance(france) {
    var regions = svg.selectAll(".departements")
        .data(topojson.feature(france, france.objects.regions).features)
        .enter()
            .append("path")
            .attr("class", "departements")
            .attr("d", path)
            .style("fill","lightblue");
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
    		.attr("r", function(d){
    if(   (d[3] == 1982 && d[1] == 4.118153908) || (d[3] == 1983 && d[1] == 4.086930015) || (d[3] == 1984 && d[1] == 3.5977557)   //Lyon
       ||   (d[3] == 1982 && d[1] == 3.353712704) || (d[3] == 1983 && d[1] == 3.335660379) || (d[3] == 1984 && d[1] == 3.212302832) //Mtp
       ||   (d[3] == 1982 && d[1] == 4.497196403) || (d[3] == 1983 && d[1] == 4.477841482) || (d[3] == 1984 && d[1] == 4.219775848) //Marseille
       ||   (d[3] == 1982 && d[1] == 6.076785282) || (d[3] == 1983 && d[1] == 6.069161589) || (d[3] == 1984 && d[1] == 5.703224386) //Nice
       ||   (d[3] == 1989 && d[1] == -1.253326184) || (d[3] == 1990 && d[1] == -1.208671732)                                        //Brest
       ||   (d[3] == 1989 && d[1] == -0.138157824) || (d[3] == 1990 && d[1] == 0.599082639)                                         //Bordeaux
       ||   (d[3] == 1989 && d[1] == 0.491371126) || (d[3] == 1990 && d[1] == 0.491371126)                                          //Nantes
       ||   (d[3] == 1989 && d[1] == 0.312623685) || (d[3] == 1990 && d[1] == 0.312623685)                                          //Rennes
       ||   (d[3] == 1993 && d[1] == 2.664258711)                                                                                   //Lille
       ||   (d[3] == 2001 && d[1] == 2.941517972)                                                                                   //Montpellier
       ||   (d[3] == 2001 && d[1] == 3.510095352)                                                                                   //Marseille
       ||   (d[3] == 2001 && d[1] == 4.887489365)                                                                                   //Nice  
       ||   (d[3] == 2007 && d[1] == 4.726138575)                                                                                   //Strasbourg
       ||   (d[3] == 2017 && d[1] == 1.840900215)   //Toulouse
       ||   (d[3] == 2017 && d[1] == 1.129895769)   //Bordeaux
       ||   (d[3] == 2017 && d[1] == -0.702587888)   //Brest
       ||   (d[3] == 2017 && d[1] == 0.953033976)   //Rennes
      ) {
        return "9px";
    } else {
        return "3px";
    }
})
    		.attr("fill", function(d){
    if(   (d[3] == 1982 && d[1] == 4.118153908) || (d[3] == 1983 && d[1] == 4.086930015) || (d[3] == 1984 && d[1] == 3.5977557)   //Lyon
       ||   (d[3] == 1982 && d[1] == 3.353712704) || (d[3] == 1983 && d[1] == 3.335660379) || (d[3] == 1984 && d[1] == 3.212302832) //Mtp
       ||   (d[3] == 1982 && d[1] == 4.497196403) || (d[3] == 1983 && d[1] == 4.477841482) || (d[3] == 1984 && d[1] == 4.219775848) //Marseille
       ||   (d[3] == 1982 && d[1] == 6.076785282) || (d[3] == 1983 && d[1] == 6.069161589) || (d[3] == 1984 && d[1] == 5.703224386) //Nice
       ||   (d[3] == 1989 && d[1] == -1.253326184) || (d[3] == 1990 && d[1] == -1.208671732)                                        //Brest
       ||   (d[3] == 1989 && d[1] == -0.138157824) || (d[3] == 1990 && d[1] == 0.599082639)                                         //Bordeaux
       ||   (d[3] == 1989 && d[1] == 0.491371126) || (d[3] == 1990 && d[1] == 0.491371126)                                          //Nantes
       ||   (d[3] == 1989 && d[1] == 0.312623685) || (d[3] == 1990 && d[1] == 0.312623685)                                          //Rennes
       ||   (d[3] == 1993 && d[1] == 2.664258711)                                                                                   //Lille
       ||   (d[3] == 2001 && d[1] == 2.941517972)                                                                                   //Montpellier
       ||   (d[3] == 2001 && d[1] == 3.510095352)                                                                                   //Marseille
       ||   (d[3] == 2001 && d[1] == 4.887489365)                                                                                   //Nice  
       ||   (d[3] == 2007 && d[1] == 4.726138575)                                                                                   //Strasbourg
       ||   (d[3] == 2017 && d[1] == 1.840900215)   //Toulouse
       ||   (d[3] == 2017 && d[1] == 1.129895769)   //Bordeaux
       ||   (d[3] == 2017 && d[1] == -0.702587888)   //Brest
       ||   (d[3] == 2017 && d[1] == 0.953033976)   //Rennes
      ) {
        return "red";
    } else {
        return "darkblue";
    }
});
    
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
                return projection([d[4], d[5]])[0];
            })
            .attr("y2", function (d) {
                return projection([d[4], d[5]])[1];
            })
            .attr("stroke-width", function(d){
    if(   (d[3] == 1982 && d[1] == 4.118153908) || (d[3] == 1983 && d[1] == 4.086930015) || (d[3] == 1984 && d[1] == 3.5977557)   //Lyon
       ||   (d[3] == 1982 && d[1] == 3.353712704) || (d[3] == 1983 && d[1] == 3.335660379) || (d[3] == 1984 && d[1] == 3.212302832) //Mtp
       ||   (d[3] == 1982 && d[1] == 4.497196403) || (d[3] == 1983 && d[1] == 4.477841482) || (d[3] == 1984 && d[1] == 4.219775848) //Marseille
       ||   (d[3] == 1982 && d[1] == 6.076785282) || (d[3] == 1983 && d[1] == 6.069161589) || (d[3] == 1984 && d[1] == 5.703224386) //Nice
       ||   (d[3] == 1989 && d[1] == -1.253326184) || (d[3] == 1990 && d[1] == -1.208671732)                                        //Brest
       ||   (d[3] == 1989 && d[1] == -0.138157824) || (d[3] == 1990 && d[1] == 0.599082639)                                         //Bordeaux
       ||   (d[3] == 1989 && d[1] == 0.491371126) || (d[3] == 1990 && d[1] == 0.491371126)                                          //Nantes
       ||   (d[3] == 1989 && d[1] == 0.312623685) || (d[3] == 1990 && d[1] == 0.312623685)                                          //Rennes
       ||   (d[3] == 1993 && d[1] == 2.664258711)                                                                                   //Lille
       ||   (d[3] == 2001 && d[1] == 2.941517972)                                                                                   //Montpellier
       ||   (d[3] == 2001 && d[1] == 3.510095352)                                                                                   //Marseille
       ||   (d[3] == 2001 && d[1] == 4.887489365)                                                                                   //Nice  
       ||   (d[3] == 2007 && d[1] == 4.726138575)                                                                                   //Strasbourg
       ||   (d[3] == 2017 && d[1] == 1.840900215)   //Toulouse
       ||   (d[3] == 2017 && d[1] == 1.129895769)   //Bordeaux
       ||   (d[3] == 2017 && d[1] == -0.702587888)   //Brest
       ||   (d[3] == 2017 && d[1] == 0.953033976)   //Rennes
      ) {
        return 3;
    } else {
        return 0.5;
    }
})
            .attr("stroke", function(d){
    if(   (d[3] == 1982 && d[1] == 4.118153908) || (d[3] == 1983 && d[1] == 4.086930015) || (d[3] == 1984 && d[1] == 3.5977557)   //Lyon
       ||   (d[3] == 1982 && d[1] == 3.353712704) || (d[3] == 1983 && d[1] == 3.335660379) || (d[3] == 1984 && d[1] == 3.212302832) //Mtp
       ||   (d[3] == 1982 && d[1] == 4.497196403) || (d[3] == 1983 && d[1] == 4.477841482) || (d[3] == 1984 && d[1] == 4.219775848) //Marseille
       ||   (d[3] == 1982 && d[1] == 6.076785282) || (d[3] == 1983 && d[1] == 6.069161589) || (d[3] == 1984 && d[1] == 5.703224386) //Nice
       ||   (d[3] == 1989 && d[1] == -1.253326184) || (d[3] == 1990 && d[1] == -1.208671732)                                        //Brest
       ||   (d[3] == 1989 && d[1] == -0.138157824) || (d[3] == 1990 && d[1] == 0.599082639)                                         //Bordeaux
       ||   (d[3] == 1989 && d[1] == 0.491371126) || (d[3] == 1990 && d[1] == 0.491371126)                                          //Nantes
       ||   (d[3] == 1989 && d[1] == 0.312623685) || (d[3] == 1990 && d[1] == 0.312623685)                                          //Rennes
       ||   (d[3] == 1993 && d[1] == 2.664258711)                                                                                   //Lille
       ||   (d[3] == 2001 && d[1] == 2.941517972)                                                                                   //Montpellier
       ||   (d[3] == 2001 && d[1] == 3.510095352)                                                                                   //Marseille
       ||   (d[3] == 2001 && d[1] == 4.887489365)                                                                                   //Nice  
       ||   (d[3] == 2007 && d[1] == 4.726138575)                                                                                   //Strasbourg
       ||   (d[3] == 2017 && d[1] == 1.840900215)   //Toulouse
       ||   (d[3] == 2017 && d[1] == 1.129895769)   //Bordeaux
       ||   (d[3] == 2017 && d[1] == -0.702587888)   //Brest
       ||   (d[3] == 2017 && d[1] == 0.953033976)   //Rennes
      ) {
        return "red";
    } else {
        return "green";
    }
})
    ;
    return cities;

}

function writeNames(cities) {
    var names = svg.selectAll("text").data(cities)
    names
        .enter()
            .append("svg:text")
        .merge(names)
            .text(function(d) {
                return (d[0]+'\n'+d[6]);
            })
            .attr("x", function(d) {
                return projection([d[1], d[2]])[0];
            })
            .attr("y", function(d) {
                return  projection([d[1], d[2]])[1];
            })
            .attr("text-anchor", "end")
            .attr('font-size', '10pt');

    names
        .exit()
            .remove();

    return cities.length;
};

// Et on appelle toutes les promesses à la fin, dans le bon ordre
function main(err, france) {
    var selectedYear = document.getElementById("amount").value;

    Promise.resolve()
        .then(() => drawFrance(france)) // On dessine le fond de carte
        .then(() => readCSV("data_latlong3.csv")) // on prend les données des villes
        .then(data => selectCities(data, selectedYear)) // On les travaille un peu
        .then(cities => drawCities(cities)) // On les dessine
        .then(cities => drawLines(cities))
        .then(cities => writeNames(cities));
}

// Triggered when input changes
function handleYearChange() {
    var selectedYear = document.getElementById("amount").value;

    Promise.resolve()
        .then(() => readCSV("data_latlong3.csv")) // on prend les données des villes
        .then(data => selectCities(data, selectedYear)) // On les travaille un peu
        .then(cities => drawCities(cities)) // On les dessine
        .then(cities => drawLines(cities))
        .then(cities => writeNames(cities));
}

// DERNIERE ETAPE
//Dès que le JSON de la carte de France est chargé, la fonction main est lancée !
 queue()
    .defer(d3.json, "https://api.myjson.com/bins/dw4e3")
    .await(main);
