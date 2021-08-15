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

const MAX_PREVIEW_LENGTH = 1000;

const DATASET_PREVIEW_ROOT = document.getElementById("dataset-preview-root");
const CONSOLE = document.getElementById("console");

const WASM_RESULT = document.getElementById("parse-result-wasm");
const LOAD_WASM_MODULE_TIME = document.getElementById("load-wasm-module-time");
const INITIALIZE_WASM_MODULE_TIME = document.getElementById("initialize-wasm-module-time");
const EXECUTE_WASM_MODULE_TIME = document.getElementById("execute-wasm-module-time");

const JS_RESULT = document.getElementById("parse-result-js");
const LOAD_JS_MODULE_TIME = document.getElementById("load-js-module-time");
const INITIALIZE_JS_MODULE_TIME = document.getElementById("initialize-js-module-time");
const EXECUTE_JS_MODULE_TIME = document.getElementById("execute-js-module-time");

const JS_MINIFIED_RESULT = document.getElementById("parse-result-js-minified");
const LOAD_JS_MINIFIED_MODULE_TIME = document.getElementById("load-js-minified-module-time");
const INITIALIZE_JS_MINIFIED_MODULE_TIME = document.getElementById("initialize-js-minified-module-time");
const EXECUTE_JS_MINIFIED_MODULE_TIME = document.getElementById("execute-js-minified-module-time");

let rowCount = document.getElementById("row-count").value;
let dataset = [];

let wasmModule = null;
let wasmModuleInitialized = false;

let jsModule = null;
let jsMinifiedModule = null;

document.getElementById("generate-dataset").addEventListener("click", onGenerateDataset);
document.getElementById("row-count").addEventListener("change", event => rowCount = event.target.value);

document.getElementById("load-wasm-module").addEventListener("click", onLoadWasmModule);
document.getElementById("initialize-wasm-module").addEventListener("click", onInitializeWasmModule);
document.getElementById("execute-wasm-module").addEventListener("click", onExecuteWasmModule);

document.getElementById("load-js-module").addEventListener("click", onLoadJsModule);
document.getElementById("execute-js-module").addEventListener("click", onExecuteJsModule);

document.getElementById("load-js-minified-module").addEventListener("click", onLoadJsMinifiedModule);
document.getElementById("execute-js-minified-module").addEventListener("click", onExecuteJsMinifiedModule);

function logInfo(text) {
    const now = new Date();

    const container = document.createElement("div");
    container.className = "line-container";

    const timestamp = document.createElement("span");
    timestamp.className = "log-timestamp";
    timestamp.innerText = `[${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}:${now.getMilliseconds()}]`;

    const content = document.createElement("span");
    content.className = "info-log";
    content.innerText = text;

    container.appendChild(timestamp);
    container.appendChild(content);
    CONSOLE.insertBefore(container, CONSOLE.firstChild);
}

function logWarning(text) {
    const now = new Date();

    const container = document.createElement("div");
    container.className = "line-container";

    const timestamp = document.createElement("span");
    timestamp.className = "log-timestamp";
    timestamp.innerText = `[${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}:${now.getMilliseconds()}]`;

    const content = document.createElement("span");
    content.className = "warning-log";
    content.innerText = text;

    container.appendChild(timestamp);
    container.appendChild(content);
    CONSOLE.insertBefore(container, CONSOLE.firstChild);
}

function logError(text) {
    const now = new Date();

    const container = document.createElement("div");
    container.className = "line-container";

    const timestamp = document.createElement("span");
    timestamp.className = "log-timestamp";
    timestamp.innerText = `[${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}:${now.getMilliseconds()}]`;

    const content = document.createElement("span");
    content.className = "error-log";
    content.innerText = text;

    container.appendChild(timestamp);
    container.appendChild(content);
    CONSOLE.insertBefore(container, CONSOLE.firstChild);
}

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
    const start = new Date();

    for (let row = 0; row < rowCount; ++row) {
        const randomStartBalance = Math.floor((Math.random() + 1.0) * 10000.0);
        const randomCosts = Math.floor(randomStartBalance * (Math.random() + 1.0) / 2.0);
        const randomItemsPurchased = Math.floor((Math.random() + 1.0) * 100.0);

        dataset.push([
            getRandomFirstName(),
            getRandomLastName(),
            randomStartBalance,
            randomStartBalance - randomCosts,
            randomItemsPurchased
        ]);
    }

    logInfo(`Generated dataset of ${rowCount} rows in ${new Date() - start} ms`);
}

function getRandomFirstName() {
    return FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
}

function getRandomLastName() {
    return LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
}

function previewDataset() {
    const start = new Date();

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

    for (let index = 0; index < dataset.length; ++index) {
        if (index >= MAX_PREVIEW_LENGTH) {
            logWarning(`Dataset preview has been truncated to ${MAX_PREVIEW_LENGTH} items avoid slowing down the browser`);
            break;
        }

        const row = dataset[index];

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
    }

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

    logInfo(`Generated dataset table preview in ${new Date() - start} ms`);
}

function onLoadWasmModule() {
    if (wasmModule !== null) {
        logWarning("WebAssembly module has been cached already");
        return;
    }

    let start = new Date();
    
    import("./rs_parser/pkg/rs_parser.js")
        .then(module => {
            const delta = new Date() - start;
            
            LOAD_WASM_MODULE_TIME.innerText = `took ${delta} ms`;
            logInfo(`WebAssembly module dynamic import took ${delta} ms`);
            
            wasmModule = module;
        })
        .catch(error => logError(error));
}

function onInitializeWasmModule() {
    if (wasmModule === null) {
        logError("WebAssembly module has not been loaded yet")
        return;
    }

    if (wasmModuleInitialized) {
        logWarning("WebAssembly module has been initialized already - no need to initialize it again");
        return;
    }

    let start = new Date();

    wasmModule.default()
        .then(() => {
            const delta = new Date() - start;

            INITIALIZE_WASM_MODULE_TIME.innerText = `took ${delta} ms`;
            logInfo(`WebAssembly module initialization took ${delta} ms`);

            wasmModuleInitialized = true;
        });
}

function onExecuteWasmModule() {
    if (wasmModule === null) {
        logError("WebAssembly module has not been loaded yet")
        return;
    }

    if (!wasmModuleInitialized) {
        logError("WebAssembly module has not been initialized yet");
        return;
    }

    if (dataset.length === 0) {
        logError("No dataset available - please generate a dataset first");
        return;
    }

    let start = new Date();

    wasmModule.greet("WebAssembly");

    const delta = new Date() - start;

    EXECUTE_WASM_MODULE_TIME.innerText = `took ${delta} ms`;
    logInfo(`WebAssembly execution took ${delta} ms`);
}

function onLoadJsModule() {
    if (jsModule !== null) {
        logWarning("JavaScript module has been cached already");
        return;
    }

    let start = new Date();
    
    import("./js_parser/js_parser.js")
        .then(module => {
            const delta = new Date() - start;
            
            LOAD_JS_MODULE_TIME.innerText = `took ${delta} ms`;
            logInfo(`JavaScript module dynamic import took ${delta} ms`);
            
            jsModule = module;
        })
        .catch(error => logError(error));
}

function onExecuteJsModule() {
    if (jsModule === null) {
        logError("JavaScript module has not been loaded yet")
        return;
    }

    if (dataset.length === 0) {
        logError("No dataset available - please generate a dataset first");
        return;
    }

    let start = new Date();

    const result = jsModule.parse(dataset);
    JS_RESULT.innerText = `${result.name} paid the lowest average price per item: €${result.averagePrice.toFixed(2)}`;

    const delta = new Date() - start;

    EXECUTE_JS_MODULE_TIME.innerText = `took ${delta} ms`;
    logInfo(`JavaScript execution took ${delta} ms`);
}

function onLoadJsMinifiedModule() {
    logWarning("Load minified JS module has not been implemented yet");
}

function onExecuteJsMinifiedModule() {
    logWarning("Execute minified JS module has not been implemented yet");
}
