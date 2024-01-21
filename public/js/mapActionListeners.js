let markers = [];
const submit = document.getElementById("submit");
const originInput = document.getElementById("from");
const destinationInput = document.getElementById("dest");
const clear = document.getElementById('clear');

clear.addEventListener('click', () => {
    originInput.value = '';
    destinationInput.value = '';
})
