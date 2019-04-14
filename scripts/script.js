

//const bouroughJSON = require('../BoroughBoundaries.json'); //Contains the topoJson of the boundaries for the bouroughs
//const recylingBins = require('../RecyclingBinsTopoJson.json'); //Contains the topoJson of the RecylingBinLocation


function createMap() {
    let svg = d3.select('Body').append('svg') //the Svg where main d3 goes 
        .style("background-color", "white")
        .attr("width", "100%")
        .attr("height", 900);


        d3.json("https://raw.githubusercontent.com/nmaswood98/RecycleNYC/master/BoroughBoundaries.json", function(error,bouroughJSON){
            let bouroughs = topojson.feature(bouroughJSON, bouroughJSON.objects.BoroughBoundaries); //converts topojson back into geojson. topojson is better for storage
            let projection = d3.geoAlbersUsa().fitSize([window.innerWidth, 900], bouroughs); //Create map projection and center it based on the data in the screen
            let path = d3.geoPath().projection(projection).pointRadius(2.5); //Create geo path using the projection created. 
        
            svg.selectAll(".boroughs") //Draw the bouroughs on the screen 
                .data(bouroughs.features)
                .enter()
                .append("path")
                .attr("class", "borough")
                .attr("d", path)
                .attr("fill", '#cccccc');

            
            d3.json("https://raw.githubusercontent.com/nmaswood98/RecycleNYC/master/RecyclingBinsTopoJson.json",function(error,recylingBins){

                svg.append("path") //Draw each point at a locaiton of a recycling bin
                .datum(topojson.feature(recylingBins, recylingBins.objects.RecylingBinData))
                .attr("d", path)
                .attr("class", "recylingBin")
                .attr("fill", "green");

            });
        });

}

document.addEventListener('DOMContentLoaded', createMap); //wait for the DOM to load to start D3 since D3 need the manipulate the Dom. 
