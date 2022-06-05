const inputs = [
    [1, 1, 1, 1],
    [0, 1, 1, -1],
    [1, 0, 1, -1],
    [0, 0, 1, -1]
];

const neuron_weights = [1, 1, 1];
const learning_rate = 0.3;

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

function recalculate_weights(generatedClass) {
    for (let weight_idx in neuron_weights) {
        neuron_weights[weight_idx] = neuron_weights[weight_idx] + (learning_rate * (inputs[idx][3] - generatedClass) * inputs[idx][weight_idx]);
    }
}

let idx = -1;
while (idx + 1 < inputs.length) {
    idx++;

    let restart = false;
    while (true) {
        const generatedClass = neuron(inputs[idx], neuron_activation);
        if (generatedClass === inputs[idx][3]) break;

        restart = true;
        recalculate_weights(generatedClass);
    }

    if (restart) idx = -1;
}
