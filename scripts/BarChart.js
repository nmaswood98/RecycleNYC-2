function showBarChart(dataset, selector, w, h) {

	// To have space around the graph
	const padding = 10;

	// Create a scale for Y-axis
	const yScale = d3.scaleLinear();
	// Set a domain; the domain covers the set of input values
	yScale.domain([0, d3.max(dataset, data => data.NumberOfBins)]);
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

	// Select all the rectangle inside 'svg'
	// If there is not evough 'svg's, add more
	svg.selectAll('rect')
	.data(dataset)
	.enter()
	.append('rect')
	// x coordinate for each bar starting from the left
	.attr('x', (d, index) => index*(barWidth+barGaps)+30)
	// y coordinate for each bar starting from the top
	.attr('y', d => {return h-d.NumberOfBins-padding})
	.attr('width', barWidth)
	.attr('height', d => d.NumberOfBins)
	// Change the color of each bar depending on its 'Capture Rate' attribute
	.attr('fill', d => `rgb(0, ${d['Capture Rate']*2.55}, 0)`)
	// To add hover effect
	.attr('class', 'bar')
	// To add tooltip
	.append('title')
	.text(d => `Pop: ${d.Population} \nNoB: ${d['NumberOfBins']}\nCR: ${d['Capture Rate']}`);

	// Add level for each bar
	svg.selectAll('text')
	.data(dataset)
	.enter()
	.append('text')
	.text(d => d.Borough)
	.attr('x', (d, index) => index*(barWidth+barGaps)+30)
	.attr('y', d => h-d.NumberOfBins-15)
	.attr('fill', 'white')
	.style('font-size', '20px');

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
      .attr("width", w1)
      .attr("height", h1)
      .attr("class", "axisColor");

    var legend = key.append("defs")
      .append("svg:linearGradient")
      .attr("id", "gradient")
      .attr("x1", "0%")
      .attr("y1", "100%")
      .attr("x2", "100%")
      .attr("y2", "100%")
      .attr("spreadMethod", "pad");

    legend.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "rgb(0, 0, 0)")
      .attr("stop-opacity", 1);

    legend.append("stop")
      .attr("offset", "33%")
      .attr("stop-color", "rgb(0, 85, 0)")
      .attr("stop-opacity", 1);

    legend.append("stop")
      .attr("offset", "66%")
      .attr("stop-color", "rgb(0, 170, 0)")
      .attr("stop-opacity", 1);

    legend.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "rgb(0, 255, 0)")
      .attr("stop-opacity", 1);

    key.append("rect")
      .attr("width", w1)
      .attr("height", h1 - 30)
      .style("fill", "url(#gradient)")
      .attr("transform", "translate(70, 10)");

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
}
