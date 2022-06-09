function generate_weights_random() {
    const min = -50;
    const max = 50;
    
    for (let i = 0; i < 3; i++) {
        document.getElementById(`input-weight-${i}`).value = Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

function on_start_training() {
    weight_history = [[]];
    training_history = [];

    learning_rate = document.getElementById('input-learning-rate').value;

    for (let i = 0; i < 3; i++) {
        neuron_weights[i] = Number(document.getElementById(`input-weight-${i}`).value);
        weight_history[0][i] = Number(document.getElementById(`input-weight-${i}`).value);
    }
    document.getElementById('app').innerHTML = '';

    run_training();
    draw_weight_history_charts(weight_history, training_history);
}