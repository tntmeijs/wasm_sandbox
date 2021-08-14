const FIRST_NAMES = [
    "Cornelius",
    "Silva",
    "Tori",
    "Elli",
    "Brittaney",
    "Lien",
    "Sibyl",
    "Keila",
    "Ping",
    "Eldridge",
    "Annetta",
    "Ai",
    "Helga",
    "Su",
    "Reda",
    "Saul",
    "Kenda",
    "Lonnie",
    "Louis",
    "Kendra",
    "Lyndsey",
    "Laurette",
    "Vaughn",
    "Berta",
    "Curt",
    "Seth",
    "Jeraldine",
    "Queen",
    "Lacie",
    "Theo",
    "Lavona",
    "Harriett",
    "Delma",
    "Charmain",
    "Aurelio",
    "Janine",
    "Melisa",
    "Oscar",
    "Janie",
    "Reinaldo",
    "Gordon",
    "Viki",
    "Lan",
    "Suzanne",
    "Donna",
    "Aura",
    "Lupe",
    "Deena",
    "Hwa",
    "Luise"
];

const LAST_NAMES = [
    "Chapel",
    "Penner",
    "Olague",
    "Piasecki",
    "Solum",
    "Croke",
    "Rishel",
    "Rodrique",
    "Mccusker",
    "Friedman",
    "Shufelt",
    "Reeve",
    "Silvestri",
    "Biro",
    "Defranco",
    "Noah",
    "Adkins",
    "Dowd",
    "Holoman",
    "Lango",
    "Payson",
    "Marsala",
    "Mendonca",
    "Romer",
    "Konrad",
    "Pangle",
    "Presutti",
    "Wymore",
    "Badger",
    "Winland",
    "Hibbard",
    "Rowen",
    "Lockamy",
    "Waage",
    "Huffaker",
    "Maddock",
    "Dufour",
    "Marcellus",
    "Morefield",
    "Ropp",
    "Doverspike",
    "Tillinghast",
    "Rosson",
    "Tripoli",
    "Piner",
    "Acton",
    "Scholze",
    "Rames",
    "Degarmo",
    "Bouton"
];

const DATASET_PREVIEW_ROOT = document.getElementById("dataset-preview-root");
const WASM_MODULE_LOAD_TIME_INDICATOR = document.getElementById("wasm-module-load-time-indicator");

let rowCount = document.getElementById("row-count").value;
let dataset = [];

document.getElementById("generate-dataset").addEventListener("click", onGenerateDataset);
document.getElementById("row-count").addEventListener("change", event => rowCount = event.target.value);
document.getElementById("load-wasm-module").addEventListener("click", onLoadWasmModule);

function onGenerateDataset(event) {
    event.preventDefault();
    const form = event.target.parentElement.parentElement;

    if (form.checkValidity()) {
        generateDataset();
        previewDataset();
    } else {
        form.reportValidity();
    }
}

function generateDataset() {
    dataset = [];

    for (let row = 0; row < rowCount; ++row) {
        const RANDOM_START_BALANCE = Math.floor(Math.random() * 10000.0) + 1;
        const RANDOM_COSTS = Math.floor(RANDOM_START_BALANCE * Math.random()) + 1;
        const RANDOM_ITEMS_PURCHASED = Math.floor(Math.random() * 100.0) + 1;

        dataset.push([
            getRandomFirstName(),
            getRandomLastName(),
            RANDOM_START_BALANCE,
            RANDOM_START_BALANCE - RANDOM_COSTS,
            RANDOM_ITEMS_PURCHASED
        ]);
    }
}

function getRandomFirstName() {
    return FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
}

function getRandomLastName() {
    return LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
}

function previewDataset() {
    DATASET_PREVIEW_ROOT.replaceChildren();
    
    // Construct a table
    const table = document.createElement("table");
    const tableHead = document.createElement("thead");
    const tableBody = document.createElement("tbody");
    const tableHeadRow = document.createElement("tr");
    const tableHeadRowIndex = document.createElement("th");
    const tableHeadRowFirstName = document.createElement("th");
    const tableHeadRowLastName = document.createElement("th");
    const tableHeadRowStartBalance = document.createElement("th");
    const tableHeadRowEndBalance = document.createElement("th");
    const tableHeadRowItemsPurchased = document.createElement("th");
    
    tableHeadRowIndex.innerText = "index";
    tableHeadRowFirstName.innerText = "first_name";
    tableHeadRowLastName.innerText = "last_name";
    tableHeadRowStartBalance.innerText = "start_balance";
    tableHeadRowEndBalance.innerText = "end_balance";
    tableHeadRowItemsPurchased.innerText = "items_purchased";

    dataset.forEach((row, index) => {
        const rowElement = document.createElement("tr");
        const rowIndex = document.createElement("td");
        const firstName = document.createElement("td");
        const lastName = document.createElement("td");
        const startBalance = document.createElement("td");
        const endBalance = document.createElement("td");
        const purchaseCount = document.createElement("td");

        rowIndex.innerText = index;
        firstName.innerText = row[0];
        lastName.innerText = row[1];
        startBalance.innerText = row[2];
        endBalance.innerText = row[3];
        purchaseCount.innerText = row[4];

        rowElement.appendChild(rowIndex);
        rowElement.appendChild(firstName);
        rowElement.appendChild(lastName);
        rowElement.appendChild(startBalance);
        rowElement.appendChild(endBalance);
        rowElement.appendChild(purchaseCount);
        tableBody.appendChild(rowElement);
    });

    table.appendChild(tableHead);
    table.appendChild(tableBody);
    tableHead.appendChild(tableHeadRow);
    tableHeadRow.appendChild(tableHeadRowIndex);
    tableHeadRow.appendChild(tableHeadRowFirstName);
    tableHeadRow.appendChild(tableHeadRowLastName);
    tableHeadRow.appendChild(tableHeadRowStartBalance);
    tableHeadRow.appendChild(tableHeadRowEndBalance);
    tableHeadRow.appendChild(tableHeadRowItemsPurchased);

    // Display the generated table
    DATASET_PREVIEW_ROOT.appendChild(table);
}

function onLoadWasmModule() {
    const startTime = new Date();
}
