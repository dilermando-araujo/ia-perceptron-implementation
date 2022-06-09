const inputs = [
    [1, 1, 1, 1],
    [0, 1, 1, -1],
    [1, 0, 1, -1],
    [0, 0, 1, -1]
];
let neuron_weights = []; // [1, 1, 1];
let weight_history = [[]]; // [[1, 1, 1]];
let training_history = [];

let learning_rate = 0; // 0.3

function add_weights_to_history(current_weights) {
    const history_row = [];

    for (let i in current_weights) {
        history_row[i] = current_weights[i];
    }

    weight_history.push(history_row);
}

function test_input(input, input_position, generatedClass, expectedClass) {
    const ok = generatedClass === expectedClass;

    const input_row = [];
    for (let i in input) {
        input_row[i] = input[i];
    }

    training_history.push([input_row, generatedClass, weight_history.length - 1, ok, input_position]);
    return ok;
}

function neuron_activation(input) {
    if (input >= 0) return 1;

    return -1;
}

function neuron(input, output) {
    return output(
        (input[0] * neuron_weights[0]) +
        (input[1] * neuron_weights[1]) +
        (input[2] * neuron_weights[2])
    )
}

function recalculate_weights(generatedClass, idx) {
    for (let weight_idx in neuron_weights) {
        neuron_weights[weight_idx] = neuron_weights[weight_idx] + (learning_rate * (inputs[idx][3] - generatedClass) * inputs[idx][weight_idx]);
    }

    add_weights_to_history(neuron_weights);
}

function run_training() {
    let idx = -1;

    while (idx + 1 < inputs.length) {
        idx++;
    
        let restart = false;
        while (true) {
            const generatedClass = neuron(inputs[idx], neuron_activation);
            if (test_input(inputs[idx], idx, generatedClass, inputs[idx][3])) break;
    
            restart = true;
            recalculate_weights(generatedClass, idx);
        }
    
        if (restart) idx = -1;
    }
}

