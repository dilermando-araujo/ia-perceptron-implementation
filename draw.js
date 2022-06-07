// // y = ax + b;
// // x = (y - b) / a;

// // vis.append('line')
// //     .style('stroke', 'black')
// //     .attr('x1', xScale(0))
// //     .attr('y1', yScale(-2))
// //     .attr('x2', xScale(-2))
// //     .attr('y2', yScale(0));

// // vis.append("circle")
// //     .style("fill", "black")
// //     .attr("cx", xScale(5))
// //     .attr("cy", yScale(5))
// //     .attr("r", 3);

function add_html_elements_for_history_charts(history) {
    const appHtmlElem = document.getElementById('app');
    for (let i = 0; i < history.length; i++) {
        const graphHtmlElem = document.createElement('div');

        graphHtmlElem.id = `chart-${i}`;
        graphHtmlElem.classList.add('chart');

        appHtmlElem.appendChild(graphHtmlElem);
    }
}

function calc_y_by_weights(x, weights) {
    return -1 * (((weights[0]*x) + weights[2]) / weights[1]);
}

function get_max_abs(n1, n2) {
    if(Math.abs(n1) > Math.abs(n2)) 
        return Math.abs(n1);
    return Math.abs(n2);
}

function draw_weight_chart(id, weights, intercepts, inputs) {
    const height = document.getElementById(id).clientHeight;
    const width = document.getElementById(id).clientWidth;
    const padding = 20;
    const boundary = Math.ceil(get_max_abs(intercepts[0], intercepts[1]) / 5) * 5;

    const vis = d3.select(`#${id}`)
                .append("svg:svg")
                .attr("width", width)
                .attr("height", height);

    const xScale = d3.scale.linear().domain([boundary, -1 * boundary]).range([width - padding, padding]);
    const yScale = d3.scale.linear().domain([-1 * boundary, boundary]).range([height - padding, padding]);

    const yAxis = d3.svg.axis()
        .orient("left")
        .scale(yScale);

    const xAxis = d3.svg.axis()
        .orient("bottom")
        .scale(xScale);

    const xAxisPlot = vis.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + (height/2) + ")")
        .call(xAxis.tickSize(-height, 0, 0));

    const yAxisPlot = vis.append("g")
        .attr("class", "axis axis--y")
        .attr("transform", "translate("+ (width/2) +",0)")
        .call(yAxis.tickSize(-width, 0, 0));

    xAxisPlot.selectAll(".tick line")
        .attr("y1", (width - (2*padding))/2 * -1)
        .attr("y2", (width - (2*padding))/2 * 1);

    yAxisPlot.selectAll(".tick line")
        .attr("x1", (width - (2*padding))/2 * -1)
        .attr("x2", (width - (2*padding))/2 * 1);

    vis.append('line')
        .style('stroke', 'black')
        .attr('x1', xScale(0))
        .attr('y1', yScale(intercepts[1]))
        .attr('x2', xScale(intercepts[0]))
        .attr('y2', yScale(0));

    for (let i in inputs) {
        vis.append("circle")
            .style("fill", inputs[i][3] < 0 ? "#e74c3c" : "#2ecc71")
            .attr("cx", xScale(inputs[i][0]))
            .attr("cy", yScale(inputs[i][1]))
            .attr("r", 3);
    }

}

function draw_weight_history_charts(history) {
    add_html_elements_for_history_charts(history);

    for (let i in history) {
        const x_intercept = -1 * (history[i][2] / history[i][0]);
        const y_intercept = -1 * (history[i][2] / history[i][1]);

        draw_weight_chart(`chart-${i}`, history[i], [x_intercept, y_intercept], inputs);
    }

}
