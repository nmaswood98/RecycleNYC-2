

//const bouroughJSON = require('../BoroughBoundaries.json'); //Contains the topoJson of the boundaries for the bouroughs
//const recylingBins = require('../RecyclingBinsTopoJson.json'); //Contains the topoJson of the RecylingBinLocation


function createMap() {
    let svg = d3.select('Body').append('svg') //the Svg where main d3 goes 
        .style("background-color", "white")
        .attr("width", "100%")
        .attr("height", 900);

        let color = d3.scaleQuantize().domain([60, 100]).range(d3.schemeOranges[9]);


        d3.json("https://raw.githubusercontent.com/nmaswood98/RecycleNYC/master/BoroughBoundaries.json", function(error,bouroughJSON){
            let bouroughs = topojson.feature(bouroughJSON, bouroughJSON.objects.BoroughBoundaries); //converts topojson back into geojson. topojson is better for storage
            let projection = d3.geoAlbersUsa().fitSize([window.innerWidth, 900], bouroughs); //Create map projection and center it based on the data in the screen
            let path = d3.geoPath().projection(projection).pointRadius(2.5); //Create geo path using the projection created. 
        

console.log(color(4.9));


            let count = -1;
            let diversionRates = [75.58194444,63.12152778,78.44722222,70.12731481,75.20119048]; //data for 2018
            svg.selectAll(".boroughs") //Draw the bouroughs on the screen 
                .data(bouroughs.features)
                .enter()
                .append("path")
                .attr("class", "borough")
                .attr("d", path)
                .attr("fill", d => {count++;return color(diversionRates[count]);});

            
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
