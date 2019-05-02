

//const bouroughJSON = require('../BoroughBoundaries.json'); //Contains the topoJson of the boundaries for the bouroughs
//const recylingBins = require('../RecyclingBinsTopoJson.json'); //Contains the topoJson of the RecylingBinLocation
//const communityDistricts = require('../CommunityDistricts.json');

let dataSetsToLoad = [d3.json("data/CommunityDistricts.json"), d3.json("data/DiversionRate.json"),d3.json("data/BoroughBoundaries.json"),
                      d3.json("data/RecyclingBinsTopoJson.json"),d3.json("data/RecyclingRates.json"),d3.json("data/DistrictNumbers.json"),
                      d3.json("data/CD_Population.json"),d3.json("data/BinsInDistrict.json")];


Promise.all(dataSetsToLoad).then(function(dataSets) {
    let numOfBinsInDistrict = dataSets[7];
    let districtNames = dataSets[5];
    let RecylingRates = dataSets[4];
    let coloringDataSet = dataSets[1];
    let populationCDData = dataSets[6];//https://shofi384.github.io/RecycleNYC/data/CD_Population.json


    let BinData = dataSets[3];


    cleanPopulation(populationCDData);

    let districtColoringFunction = (d, color) => {
        d.rateType = "dRate";
        if (coloringDataSet.hasOwnProperty(d.properties.boro_cd)) {

            return color(coloringDataSet[d.properties.boro_cd].dRate);
        }
        else {
            return 	"#D3D3D3";
        }
    }
    let mapData = {
        "map1": { HideBins: "true", year: "2013", fiscalMonth: "7", rateType: "dRate" },
        "map2": { HideBins: "false", year: "2013", fiscalMonth: "7", rateType: "dRate" }
    };


    d3.selectAll('input[name="mapSelection"]').on("change", () => {
        let mapSelected = d3.select('input[name="mapSelection"]:checked').node().value;

        document.getElementById("HideBins").value = mapData[mapSelected].HideBins;
        document.getElementById("Year").value = mapData[mapSelected].year;
        document.getElementById("FiscalMonth").value = mapData[mapSelected].fiscalMonth;
        document.getElementById("RateSelection").value = mapData[mapSelected].rateType;


    });

    d3.select("#submit").attr("class", "arda").on("submit", (e) => {
        let hideBins = document.getElementById("HideBins").value;
        let year = document.getElementById("Year").value;
        let fiscalMonth = document.getElementById("FiscalMonth").value;
        let rateType = document.getElementById("RateSelection").value;
        let mapToChange = d3.select('input[name="mapSelection"]:checked').node().value;

        mapData[mapToChange] = {"HideBins":hideBins,"year":year,"fiscalMonth":fiscalMonth,"rateType":rateType};

        let coloringDataSet = RecylingRates[year][fiscalMonth];

        if(hideBins === "true"){
            d3.selectAll(".recylingBin" + mapToChange)
            .transition().duration(1000)
            .style("opacity", 1);
        }
        else{
            d3.selectAll(".recylingBin" + mapToChange)
            .transition().duration(1000)
            .style("opacity", 0);
        }

        if(rateType == "cdPopulation"){
          populationMap(mapToChange,districtNames, populationCDData)
        }else{
          updateMap(mapToChange,districtNames,coloringDataSet,rateType);
        }

        d3.event.preventDefault();
    }
        );

    let count = -1;
    let diversionRates = [75.58194444, 63.12152778, 78.44722222, 70.12731481, 75.20119048];
    let boroughColoringFunction = (d, color) => {count++; return color(diversionRates[count])};


    let mapSvg = d3.select('#mapViz').append('svg') //the Svg where main d3 goes
    .style("background-color", "white")
    .attr("class", "map")
    .attr("width", window.innerWidth)
    .attr("height", window.innerHeight/1.2);
    console.log(window.innerHeight/1.2);
    let mapSize = {width: window.innerWidth, height:window.innerHeight/1.2};
    createMap(mapSvg,"map2",mapSize,dataSets[0],"CommunityDistricts",dataSets[3],districtColoringFunction);

    d3.selectAll(".recylingBinmap2")
    .transition().duration(1000)
    .style("opacity", 0);

    d3.selectAll(".areamap2")
    .style("opacity", 0);

    createMap(mapSvg,"map1",mapSize,dataSets[0],"CommunityDistricts",dataSets[3],districtColoringFunction);

    createToolTips(mapSvg ,"map1",districtNames,RecylingRates,populationCDData,numOfBinsInDistrict,mapData);
    createToolTips(mapSvg ,"map2",districtNames,RecylingRates,populationCDData,numOfBinsInDistrict,mapData);

    let mapOnScreen = false;
    let mapExists = false;
    d3.select("#secondMap")
    .on("click",()=>{

        if(!mapOnScreen){
            mapOnScreen = true;
            d3.selectAll(".areamap2")
            .style("opacity", 1);

            if(mapData.map2.HideBins === "true"){
                d3.selectAll(".recylingBinmap2")
                .style("opacity", 1);
            }

            moveMaps(mapSvg,{x1:-mapSize.width/4,x2:mapSize.width/8});
            d3.select("#MapRadioButtons")
            .style("opacity", 1);
            d3.select("#secondMap").text("Hide Second Map");
        }
        else{
            mapOnScreen = false;
            moveMaps(mapSvg,{x1:0,y1:0});

            d3.select("#MapRadioButtons")
            .style("opacity", 0);

            d3.selectAll(".areamap2")
                .transition()
                .delay(2000)
                .style("opacity", 0);

            if (mapData.map2.HideBins === "true") {
                d3.selectAll(".recylingBinmap2")
                    .transition()
                    .delay(2000)
                    .style("opacity", 0);
            }

            d3.select("#secondMap").text("Show Second Map");
            document.getElementById("radioButton1").checked = true;
        }

    });

    //Used this to get the amount of bins in every district
  /*
    let obj = {};
    mapSvg.selectAll(".areamap1") //Draw the bouroughs on the screen
          .each(function(d){//coordinates
            let count = 0;
            BinData.objects.RecylingBinData.geometries.forEach((e)=>{
                if(d3.geoContains(d,e.coordinates)){
                    count++;
                }
            });
            console.log(count);
            obj[d.properties.boro_cd] = count;

          });
console.log(obj);
*/

  });

  //creates a map based on the datasets supplied.
  function createMap(svg,name,size,mapDataSet, mapDataSetObjectName, recylingBinDataSet,areaFillFunction, areaClickFunction) {
     // d3.select(".map ").remove(); //Remove existing map on screen
    //console.log("Hello");
     function tooltipHtml(){	/* function to create html content string in tooltip div. */
		return "<h4>"+"Hello"+"</h4><table>"+
			"<tr><td>Low</td><td>"+1+"</td></tr>"+
			"<tr><td>Average</td><td>"+4+"</td></tr>"+
			"<tr><td>High</td><td>"+5+"</td></tr>"+
			"</table>";
	}

      let color = d3.scaleQuantize().domain([60, 100]).range(d3.schemeOranges[9]);

      let area = topojson.feature(mapDataSet, mapDataSet.objects[mapDataSetObjectName]); //converts topojson back into geojson. topojson is better for storage
      let projection = d3.geoAlbersUsa().fitSize([size.width, size.height], area); //Create map projection and center it based on the data in the screen
      let path = d3.geoPath().projection(projection).pointRadius(2.5); //Create geo path using the projection created.

      let count = -1;




      svg.selectAll(".area") //Draw the bouroughs on the screen
          .data(area.features)
          .enter()
          .append("path")
          .attr("class", "area")
          .attr("class", "area" + name)
          .attr("d", path)
          .attr("fill",d => areaFillFunction(d,color));



      svg.append("path") //Draw each point at a locaiton of a recycling bin
          .datum(topojson.feature(recylingBinDataSet, recylingBinDataSet.objects.RecylingBinData))
          .attr("d", path)
          .attr("class", "recylingBin" + name)
          .attr("fill", "green");


}

function updateMap(name, districtNames, recyclingRateDataSet, rateType ){
    let orangeColors = d3.scaleQuantize().domain([50, 110]).range(d3.schemeOranges[9]);
    let purpleColors = d3.scaleQuantize().domain([0, 95]).range(d3.schemePurples[9]);
    let blueColors = d3.scaleQuantize().domain([0, 125]).range(d3.schemeBlues[9]);
    let blueColors2 = d3.scaleQuantize().domain([180, 1300]).range(d3.schemeBlues[9]);
    let colorScaleToUse = orangeColors;

    if(rateType === 'dRate'){
        colorScaleToUse = orangeColors;
    }
    else if(rateType === 'cRate'){
        colorScaleToUse = purpleColors;
    }
    else if(rateType === 'cRateMGP'){
        colorScaleToUse = blueColors;
    }
    else{
        colorScaleToUse = blueColors2;
    }

    d3.selectAll(".area" + name)
    .transition().duration(1000)
    .attr("fill",(d)=>{
        d.rateType = rateType;
        if(districtNames.hasOwnProperty(d.properties.boro_cd)){
            return colorScaleToUse(recyclingRateDataSet[districtNames[d.properties.boro_cd]][rateType]);
        }
        else{
            return 	"#D3D3D3";
        }

    });
}

function createToolTips(svg,name, districtNames, recyclingRateDataSet,populationData,numOfBinsInDistrict,mapData){
    var div = d3.select("body")
	.append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);



    svg.selectAll(".area" + name)
        .on("mouseover", function (d) {
            let districtName = d.properties.boro_cd;
            //console.log(numOfBinsInDistrict);
            let bins = numOfBinsInDistrict[d.properties.boro_cd];
            let rate = "unknown";

            if (districtNames.hasOwnProperty(districtName)) {
                districtName = districtNames[districtName];

                if(mapData[name].rateType === "cdPopulation"){
                    rate = getPopulation(d.properties.boro_cd,populationData);
                }else{
                    let dataset = recyclingRateDataSet[mapData[name].year][mapData[name].fiscalMonth];
                    let rateType = mapData[name].rateType;
                    if(rateType === 'cRateTotal'){
                        rate =  parseFloat(dataset[districtName][mapData[name].rateType]).toFixed(2);
                    }
                    else{
                    rate = dataset[districtName][mapData[name].rateType].toFixed(2);
                    }
                }

            }

            d3.select(this)
                .attr("opacity", 0.5);

            div.transition()
                .duration(500)
                .style("opacity", 0);

            div.transition()
                .duration(200)
                .style("opacity", .9);

            div.html(
                "<span class = 'barChartToolTipTitle' style='margin:0; padding: 0; font-size: 15px;'>District: </span><p style='padding: 0 10; margin-left: 0;'>" + districtName + "</p>" +
                "<span class='barChartToolTipTitle' style='margin:0; padding: 0; font-size: 15px;'>Recycling Bins: </span><p style='padding: 0 10; margin: 0;'>"+bins+"</p>" +
                "<span class='barChartToolTipTitle' style='margin:0; padding: 0; font-size: 15px;'>"+"Value"+": </span><p style='padding: 0 10; margin: 0;'>"+rate+"</p>" )
                .style("position", "absolute")
                .style("background", "#509E52")
                .style("width", 150 + "px")
                .style("left", 30 + "px")
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseleave", function (d) {
            d3.select(this)
                .attr("opacity", 1);

            div.transition()
                .style("opacity", 0);

        });
}


function moveMaps(svg,xLocations,duration){
    let map1XTranslate = xLocations.x1;
    let map2XTranslate = xLocations.x2;
    let movementDuration = 2000;

      svg.selectAll(".areamap1")
      .transition().duration(movementDuration)
      .attr("transform", "translate(" + map1XTranslate+ "," + 0 + ")");

      svg.selectAll(".recylingBinmap1")
      .transition().duration(movementDuration)
      .attr("transform", "translate(" + map1XTranslate+ "," + 0 + ")");

      svg.selectAll(".areamap2")
      .transition().duration(movementDuration)
      .attr("transform", "translate(" + map2XTranslate+ "," + 0 + ")");

      svg.selectAll(".recylingBinmap2")
      .transition().duration(movementDuration)
      .attr("transform", "translate(" + map2XTranslate+ "," + 0 + ")");
}



function populationMap(name,districtNames, populationData){
  let redColors = d3.scaleQuantize().domain([0, 255919]).range(d3.schemeReds[9]);
  let colorScaleToUse = redColors;
  let cleanPopulation;
  let temp;
  //populationData = d3.json("https://shofi384.github.io/RecycleNYC/data/CD_Population.json");
  d3.selectAll(".area" + name)
  .transition().duration(1000)
  .attr("fill",(d)=>{
      let cd = d.properties.boro_cd;//In the form of BX01
      for(var j =0; j<populationData.length; j++){
        if(cd == populationData[j]["CD Number"]){
          temp = colorScaleToUse(populationData[j]["2010 Population"]);
          return temp;
        }
      }
      return "#D3D3D3";
  });
}
function cleanPopulation(populationData){
  for(var i =0; i<populationData.length; i++){
    if(populationData[i].Borough == "Manhattan") populationData[i]["CD Number"]+=100;
    else if(populationData[i].Borough == "Bronx") populationData[i]["CD Number"]+=200;
    else if(populationData[i].Borough == "Brooklyn") populationData[i]["CD Number"]+=300;
    else if(populationData[i].Borough == "Queens") populationData[i]["CD Number"]+=400;
    else if(populationData[i].Borough == "Staten Island") populationData[i]["CD Number"]+=500;
  }
}
function getPopulation(cd, populationData){
  //console.log(populationData);
  for(var j =0; j<populationData.length; j++){
    //console.log("popCD: "+cd);
    if(cd == populationData[j]["CD Number"]){
      temp = populationData[j]["2010 Population"];
      //console.log(temp);
      return temp;
    }
  }
}
