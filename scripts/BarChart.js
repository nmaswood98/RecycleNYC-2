function showBarChart(dataset, selector, w, h) {

	// To have space around the graph
	const padding = 20;

	// Create a scale for Y-axis
	const yScale = d3.scaleLinear();
	// Set a domain; the domain covers the set of input values
	const maxBins = d3.max(dataset, data => data.NumberOfBins) + 20;
	yScale.domain([0, maxBins]);
	// Set a range; the range covers the set of output values
	yScale.range([h-padding, padding]);

	const barWidth = w/(dataset.length*1.5);
	const barGaps = barWidth*0.3;

	// Create a scale for Y-axis
	const xScale = d3.scaleLinear().domain([0, dataset.length]).range([padding, w-padding]);

	// Select the element to which to add the Visualization
	const svg = d3.select(selector)
		.append('svg')
		.attr('width', w)
		.attr('height', h)
		.attr("class", "axisColor");


	var div = d3.select("body")
		.append("div")
		.attr("class", "tooltip")
		.style("opacity", 0);

		


	// Select all the rectangle inside 'svg'
	// If there is not evough 'svg's, add more
	svg.selectAll('rect')
	.data(dataset)
	.enter()
	.append('rect')
	// x coordinate for each bar starting from the left
	.attr('x', (d, index) => index*(barWidth+barGaps)+40)
	// y coordinate for each bar starting from the top
	.attr('y', d => {return yScale(d.NumberOfBins) - padding})
	.attr('width', barWidth)
	.attr('height', d => h - yScale(d.NumberOfBins))
	// Change the color of each bar depending on its 'Capture Rate' attribute
	.attr("fill", function(d) {
    if (d.CaptureRate < 60) {
      return "#c2e699";
    } else if (d.CaptureRate < 70) {
      return "#78c679";
    } else if (d.CaptureRate < 80) {
			return "#31a354";
		}
    return "#006837";
  })
	// To add hover effect
	.attr('class', 'bar')
	// To add tooltip
	.append('title')
	.text(d => `Pop: ${d.Population} \nNoB: ${d['NumberOfBins']}\nCR: ${d['CaptureRate']}`);

	
svg.selectAll('rect').on("mouseover",function(d){
	console.log("MouseOver");
	d3.select(this)
		.attr("opacity", 0.5);

	div.transition()
		.duration(500)
		.style("opacity", 0);

	div.transition()
		.duration(200)
		.style("opacity", .9);

	div.html(
		"<span class = 'barToolTipTitle' style='margin:0; padding: 0; font-size: 15px;'>Population: </span><p style='padding: 0 10; margin-left: 0;'>" + d.Population + "</p>" +
		"<span class='barToolTipTitle' style='margin:0; padding: 0; font-size: 15px;'>Number of Bins: </span><p style='padding: 0 10; margin: 0;'>" + d['NumberOfBins'] + "</p>" +
		"<span class='barToolTipTitle' style='margin:0; padding: 0; font-size: 15px;'>" + "Capture Rate" + ": </span><p style='padding: 0 10; margin: 0;'>" + d['CaptureRate'] + "</p>")
		.style("position", "absolute")
		.style("background", "#509E52")
		.style("width", 150 + "px")
		.style("left", 30 + "px")
		.style("left", (d3.event.pageX) + "px")
		.style("top", (d3.event.pageY - 28) + "px");
}).on("mouseleave", function (d) {
	d3.select(this)
			.attr("opacity", 1);

	div.transition()
			.style("opacity", 0);

});


	// Add level for each bar
	svg.selectAll('text')
	.data(dataset)
	.enter()
	.append('text')
	.text(d => d.Borough)
	.attr('x', (d, index) => index*(barWidth+barGaps)+40)
	.attr('y', d => yScale(d.NumberOfBins)-25)
	.attr('fill', '#404040')
	.style('font-size', '18px');

	// Set the X-axis
	// const xAxis = d3.axisBottom(xScale);
	// svg.append("g")
	// .attr("transform", "translate(0, " + (h-padding) + ")")
	// .call(xAxis);
	// No X-axis necessary for this

	// Set the Y-axis
	const yAxis = d3.axisLeft(yScale);
	svg.append("g")
	.attr("transform", "translate("+(padding+15)+", 0)")
	.call(yAxis);




	// Add legend
	var w1 = 300, h1 = 50;

    var key = svg.append("svg")
      .attr("width", 0)
      .attr("height", 0)
      .attr("class", "axisColor");

  //   var legend = key.append("defs")
  //     .append("svg:linearGradient")
  //     .attr("id", "gradient")
  //     .attr("x1", "0%")
  //     .attr("y1", "100%")
  //     .attr("x2", "100%")
  //     .attr("y2", "100%")
  //     .attr("spreadMethod", "pad");

  //   legend.append("stop")
  //     .attr("offset", "0%")
  //     .attr("stop-color", "rgb(0, 0, 0)")
  //     .attr("stop-opacity", 1);

  //   legend.append("stop")
  //     .attr("offset", "33%")
  //     .attr("stop-color", "rgb(0, 85, 0)")
  //     .attr("stop-opacity", 1);

  //   legend.append("stop")
  //     .attr("offset", "66%")
  //     .attr("stop-color", "rgb(0, 170, 0)")
  //     .attr("stop-opacity", 1);

  //   legend.append("stop")
  //     .attr("offset", "100%")
  //     .attr("stop-color", "rgb(0, 255, 0)")
  //     .attr("stop-opacity", 1);

  //   key.append("rect")
  //     .attr("width", w1)
  //     .attr("height", h1 - 30)
  //     .style("fill", "url(#gradient)")
  //     .attr("transform", "translate(70, 10)");

    var y = d3.scaleLinear()
      .range([250, 0])
      .domain([100, 0]);

    var yAx = d3.axisBottom()
      .scale(y)
      .ticks(5);

    key.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(70, 30)")
      .call(yAx)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("axis title");

    // Add Y-axix Label
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -5)
      .attr("x", -200)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Number of Bins");
}
