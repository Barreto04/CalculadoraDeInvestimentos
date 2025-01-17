import { generateReturnsArray } from "./investmentGoals";
import { Chart } from "chart.js/auto";
import { createTable } from "./table";

const finalMoneyChart = document.getElementById("final-money-distribution")
const progressionChart = document.getElementById("progression")
const form = document.getElementById("investment-form");
const clearFormButton = document.getElementById("clear-form");
let finalMoneyChartReference = {};
let progressionChartReference = {};

const columnsArray = [
    {columnLabel:"Mês", acessor: "month"},
    {columnLabel:"Total Investido", acessor: "investedAmount", format: (numberInfo) => formatCurrency(numberInfo)},
    {columnLabel:"Rendimento Mensal", acessor: "interestReturns", format: (numberInfo) => formatCurrency(numberInfo)},
    {columnLabel:"Rendimento Total", acessor: "totalInterestReturns", format: (numberInfo) => formatCurrency(numberInfo)},
    {columnLabel:"Quantia Total", acessor: "totalAmount", format: (numberInfo) => formatCurrency(numberInfo)},
];

function formatCurrency(value) {
    return value.toLocaleString("pt-BR", {style: "currency", currency: "BRL"});
};

function formatCurrencyToGraph(value) {
    return value.toFixed(2);
};

function renderProgression(evt) {
    evt.preventDefault();
    if (document.querySelector(".error")) {
        return;
    };

    resetCharts();

    const startingAmount = Number(document.getElementById("starting-amount").value.replace(",", "."));
    const addicionalContribution = Number(document.getElementById("addicional-contribution").value.replace(",", "."));
    const timeAmount = Number(document.getElementById("time-amount").value);
    const timeAmountPeriod = (document.getElementById("time-amount-period").value);
    const returnRate = Number(document.getElementById("return-rate").value.replace(",", "."));
    const returnRatePeriod = (document.getElementById("evaluation-period").value);
    const taxRate = Number(document.getElementById("tax-rate").value.replace(",", "."));

    const returnsArray = generateReturnsArray(
        startingAmount,
        timeAmount,
        timeAmountPeriod,
        addicionalContribution,
        returnRate,
        returnRatePeriod
    );

    const finalInvestmentObject = returnsArray[returnsArray.length - 1];

    finalMoneyChartReference = new Chart(finalMoneyChart, {
        type: 'doughnut',
        data: {
            labels: [
                'Total Investido',
                'Rendimento',
                'Imposto'
            ],
            datasets: [{
                data: [
                    finalInvestmentObject.investedAmount,
                    finalInvestmentObject.totalInterestReturns * (1 - taxRate / 100),
                    finalInvestmentObject.totalInterestReturns * (taxRate / 100)],
                backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                    'rgb(255, 205, 86)'
                ],
                hoverOffset: 4
            }]
        }
    })

    progressionChartReference = new Chart(progressionChart, {
        type: 'bar',
        data: {
            labels: returnsArray.map((investmentObject) => investmentObject.month),
            datasets: [
                {
                    label: 'Total Investido',
                    data: returnsArray.map((investmentObject) =>
                        formatCurrencyToGraph(investmentObject.investedAmount)
                    ),
                    backgroundColor: 'rgb(255, 99, 132)',
                },
                {
                    label: 'Retorno do Investimento',
                    data: returnsArray.map((investmentObject) =>
                        formatCurrencyToGraph(investmentObject.interestReturns)
                    ),
                    backgroundColor: 'rgb(54, 162, 235)',
                },
            ],
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    stacked: true,
                },
                y: {
                    stacked: true,
                },
            },
        },
    });

    createTable(columnsArray, returnsArray, "results-table");
}

function isObjectEmpty(obj) {
    return Object.keys(obj).length === 0;
};

function resetCharts() {
    if (!isObjectEmpty(finalMoneyChartReference) && !isObjectEmpty(progressionChartReference)) {
        finalMoneyChartReference.destroy();
        progressionChartReference.destroy();
    }
}

function clearForm() {
    form["starting-amount"].value = "";
    form["addicional-contribution"].value = "";
    form["time-amount"].value = "";
    form["return-rate"].value = "";
    form["tax-rate"].value = "";

    resetCharts();

    const errorInputContainers = document.querySelectorAll(".error");

    for (const errorInputContainer of errorInputContainers) {
        errorInputContainer.classList.remove("error");
        errorInputContainer.parentElement.querySelector("p").remove();
    }
}


function validateInput(evt) {
    if (evt.target.value === "") {
        return;
    }

    const parentElement = evt.target.parentElement;
    const grandParentElement = evt.target.parentElement.parentElement;
    const inputValue = evt.target.value;

    if (!parentElement.classList.contains("error") && (isNaN(inputValue) || Number(inputValue) <= 0)) {

        const errorTextElement = document.createElement("p");
        errorTextElement.classList.add("text-red-500");
        errorTextElement.innerText = "Insira um valor numérico e maior que zero";

        parentElement.classList.add("error");
        grandParentElement.appendChild(errorTextElement);
    } else if (parentElement.classList.contains("error") && !isNaN(inputValue) && Number(inputValue) > 0) {
        parentElement.classList.remove("error");
        grandParentElement.querySelector("p").remove();
    };
}

for (const formElement of form) {
    if (formElement.tagName === "INPUT" && formElement.hasAttribute("name")) {
        formElement.addEventListener("blur", validateInput);
    }
}

const mainEl = document.querySelector("main");
const carouselEl = document.getElementById("carousel");
const previousButton = document.getElementById("slide-arrow-previous");
const nextButton = document.getElementById("slide-arrow-next");

nextButton.addEventListener("click", () => {
    carouselEl.scrollLeft += mainEl.clientWidth;
});

previousButton.addEventListener("click", () => {
    carouselEl.scrollLeft -= mainEl.clientWidth;
});

form.addEventListener("submit", renderProgression);

clearFormButton.addEventListener("click", clearForm);