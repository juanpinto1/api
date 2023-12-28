const moneda = document.getElementById("moneda");
const btn = document.getElementById("btn");
const monto = document.getElementById("monto");
const resultadoP = document.getElementById("resultado");
const btn2 = document.getElementById("btn2");
const grafico = document.getElementById("grafico").getContext("2d");
const listaConversaciones = document.getElementById("listaConversaciones");
const conversaciones = [];
btn.addEventListener("click", async () => {
    const montoCLP = parseFloat(monto.value);
    const monedaDestino = moneda.value;
    if (isNaN(montoCLP) || montoCLP <= 0) {
        resultadoP.textContent = 'Ingrese un monto válido.';
        return;
    }
    try {
        const response = await fetch("https://mindicador.cl/api");
        const data = await response.json();
        if (!data || !data[monedaDestino]) {
            resultadoP.textContent = 'Favor ingrese tipo de moneda.';
            return;
        }
        const tasaDeCambio = data[monedaDestino].valor;
        const conversion = montoCLP / tasaDeCambio;
        const codigoMoneda = data[monedaDestino].codigo;
        resultadoP.textContent = `Resultado:  ${conversion.toFixed(2)} ${monedaDestino}`;
        conversaciones.push({ codigo: codigoMoneda, conversion: conversion.toFixed(2) });
    } catch (error) {
        console.error('Error al obtener tasas de cambio:', error);
        resultadoP.textContent = 'Hubo un error al obtener las tasas de cambio.';
    }
});
btn2.addEventListener("click", () => {
    const listItem = document.createElement('li');
    const conversacion = conversaciones[conversaciones.length - 1];
    listItem.textContent = `Código: ${conversacion.codigo}, Conversión: ${conversacion.conversion}`;
    listaConversaciones.appendChild(listItem);
    generarGrafico();
});
let myChart;
function generarGrafico() {
    if (myChart) {
        myChart.destroy(); 
    }
    myChart = new Chart(grafico, {
        type: 'line',
        data: {
            labels: conversaciones.map(conv => conv.codigo),
            datasets: [{
                label: 'Conversión',
                data: conversaciones.map(conv => conv.conversion),
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                borderColor: 'rgb(255, 99, 132)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}