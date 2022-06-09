function group_training_history_by_weight_history_id(training_history) {
    const groups = {};

    for (let i in training_history) {
        if (groups[training_history[i][2]] === undefined) 
            groups[training_history[i][2]] = [];

        groups[training_history[i][2]].push(training_history[i]);
    }

    return groups;
}

function add_html_elements_for_history_charts(history, training) {
    const appHtmlElem = document.getElementById('app');
    const training_grouped = group_training_history_by_weight_history_id(training);

    for (let i = 0; i < history.length; i++) {
        const chartContainerHtmlElem = document.createElement('div');

        let training_rows_html = '';
        for (let idx in training_grouped[i]) {
            training_rows_html += `
                <tr class="${
                    training_grouped[i][idx][3] 
                        ? 'training-successful' : 'training-failed'
                }">
                    <td>${(training_grouped[i][idx][4] + 1)}</td>
                    <td>${training_grouped[i][idx][0][0]}</td>
                    <td>${training_grouped[i][idx][0][1]}</td>
                    <td>${training_grouped[i][idx][0][3]}</td>
                </tr>
            `;
        }

        chartContainerHtmlElem.innerHTML = `
            <div class="chart" id="chart-${i}"></div>
            <div class="table">
                <div class="weight-table" id="weight-table-${i}">
                    <table>
                        <thead>
                            <tr>
                                <td>Peso 1</td>
                                <td>Peso 2</td>
                                <td>Peso 3</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>${Number(history[i][0].toFixed(2))}</td>
                                <td>${Number(history[i][1].toFixed(2))}</td>
                                <td>${Number(history[i][2].toFixed(2))}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="intercepts-table" id="intercept-table-${i}">
                    <table>
                        <thead>
                            <tr>
                                <td>x-intercept</td>
                                <td>y-intercept</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td id="intercept-table-${i}-x-value">-</td>
                                <td id="intercept-table-${i}-y-value">-</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="training-table" id="training-table-${i}">
                    <table>
                        <thead>
                            <tr>
                                <td>Id</td>
                                <td>X</td>
                                <td>Y</td>
                                <td>Classe</td>
                            </tr>
                        </thead>
                        <tbody>
                            ${training_rows_html}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        chartContainerHtmlElem.classList.add('chart-container');
        appHtmlElem.appendChild(chartContainerHtmlElem);
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

function valid_intercepts_params(intercepts) {

    for (let idx in intercepts) {
        if (Number.isNaN(intercepts[idx])) return false;
        if (intercepts[idx] == Infinity) return false;
    }

    return true;
}

function draw_weight_chart(id, intercepts, inputs) {
    if(!valid_intercepts_params(intercepts)) return;

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

function draw_weight_history_charts(history, training_history) {
    add_html_elements_for_history_charts(history, training_history);

    for (let i in history) {
        const x_intercept = -1 * (history[i][2] / history[i][0]);
        const y_intercept = -1 * (history[i][2] / history[i][1]);

        if (valid_intercepts_params([x_intercept, y_intercept])) {
            document.getElementById(`intercept-table-${i}-x-value`).innerHTML = Number(x_intercept.toFixed(2));
            document.getElementById(`intercept-table-${i}-y-value`).innerHTML = Number(y_intercept.toFixed(2));
        }

        draw_weight_chart(`chart-${i}`, [x_intercept, y_intercept], inputs);
    }

}
