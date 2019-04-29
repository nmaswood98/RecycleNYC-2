

//const bouroughJSON = require('../BoroughBoundaries.json'); //Contains the topoJson of the boundaries for the bouroughs
//const recylingBins = require('../RecyclingBinsTopoJson.json'); //Contains the topoJson of the RecylingBinLocation
//const communityDistricts = require('../CommunityDistricts.json');

let dataSetsToLoad = [d3.json("CommunityDistricts.json"), d3.json("DiversionRate.json"),d3.json("BoroughBoundaries.json"),
                      d3.json("RecyclingBinsTopoJson.json"),d3.json("RecyclingRates.json"),d3.json("DistrictNumbers.json")];
Promise.all(dataSetsToLoad).then(function(dataSets) {
    let districtNames = dataSets[5];
    let RecylingRates = dataSets[4];
    let coloringDataSet = dataSets[1];

    let districtColoringFunction = (d, color) => {
        if (coloringDataSet.hasOwnProperty(d.properties.boro_cd)) {

            return color(coloringDataSet[d.properties.boro_cd].dRate);
        }
        else {
            return "#ADD8E6";
        }
    }

 
    d3.select("#submit").attr("class", "arda").on("submit", (e) => { 
        let mapType = document.getElementById("MapType").value;
        let Year = document.getElementById("Year").value;
        let FiscalMonth = document.getElementById("FiscalMonth").value;
        let rateType = document.getElementById("RateSelection").value; 


        let coloringDataSet = RecylingRates[Year][FiscalMonth];

        updateMap(districtNames,coloringDataSet,rateType);


        d3.event.preventDefault();
    }
        );

    let count = -1;
    let diversionRates = [75.58194444, 63.12152778, 78.44722222, 70.12731481, 75.20119048]; 
    let boroughColoringFunction = (d, color) => {count++; return color(diversionRates[count])};

    createMap(dataSets[0],"CommunityDistricts",dataSets[3],districtColoringFunction);

  });

  //creates a map based on the datasets supplied. 
  function createMap(mapDataSet, mapDataSetObjectName, recylingBinDataSet,areaFillFunction, areaClickFunction) {
     // d3.select(".map ").remove(); //Remove existing map on screen

      let svg = d3.select('body').append('svg') //the Svg where main d3 goes
          .style("background-color", "white")
          .attr("class", "map")
          .attr("width", "100%")
          .attr("height", 900);

      let color = d3.scaleQuantize().domain([60, 100]).range(d3.schemeOranges[9]);
     
      let area = topojson.feature(mapDataSet, mapDataSet.objects[mapDataSetObjectName]); //converts topojson back into geojson. topojson is better for storage
      let projection = d3.geoAlbersUsa().fitSize([window.innerWidth, 900], area); //Create map projection and center it based on the data in the screen
      let path = d3.geoPath().projection(projection).pointRadius(2.5); //Create geo path using the projection created.

      let count = -1;
     



      svg.selectAll(".area") //Draw the bouroughs on the screen
          .data(area.features)
          .enter()
          .append("path")
          .attr("class", "area")
          .attr("d", path)
          .attr("fill",d => areaFillFunction(d,color))
          .on('click',d => areaClickFunction(d));


      svg.append("path") //Draw each point at a locaiton of a recycling bin
          .datum(topojson.feature(recylingBinDataSet, recylingBinDataSet.objects.RecylingBinData))
          .attr("d", path)
          .attr("class", "recylingBin")
          .attr("fill", "green");
}

function updateMap(districtNames, recyclingRateDataSet, rateType ){
    let orangeColors = d3.scaleQuantize().domain([50, 110]).range(d3.schemeOranges[9]);
    let purpleColors = d3.scaleQuantize().domain([0, 95]).range(d3.schemePurples[9]);
    let blueColors = d3.scaleQuantize().domain([0, 125]).range(d3.schemeBlues[9]);

    let colorScaleToUse = orangeColors;

    if(rateType === 'dRate'){
        colorScaleToUse = orangeColors;
    }
    else if(rateType === 'cRate'){
        colorScaleToUse = purpleColors;
    }
    else{
        colorScaleToUse = blueColors;
    }
    
    d3.selectAll(".area")
    .transition().duration(1000)
    .attr("fill",(d)=>{

        if(districtNames.hasOwnProperty(d.properties.boro_cd)){
            return colorScaleToUse(recyclingRateDataSet[districtNames[d.properties.boro_cd]][rateType]);
        }
        else{
            return "#ADD8E6";
        }

    });
}



