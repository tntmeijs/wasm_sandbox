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
const CONSOLE = document.getElementById("console");
const LOAD_WASM_MODULE_TIME = document.getElementById("load-wasm-module-time");
const INITIALIZE_WASM_MODULE_TIME = document.getElementById("initialize-wasm-module-time");
const EXECUTE_WASM_MODULE_TIME = document.getElementById("execute-wasm-module-time");

let rowCount = document.getElementById("row-count").value;
let dataset = [];
let wasmModule = null;
let wasmModuleInitialized = false;
let jsModule = null;

document.getElementById("generate-dataset").addEventListener("click", onGenerateDataset);
document.getElementById("row-count").addEventListener("change", event => rowCount = event.target.value);
document.getElementById("load-wasm-module").addEventListener("click", onLoadWasmModule);
document.getElementById("initialize-wasm-module").addEventListener("click", onInitializeWasmModule);
document.getElementById("execute-wasm-module").addEventListener("click", onExecuteWasmModule);

function logInfo(text) {
    const NOW = new Date();

    const CONTAINER = document.createElement("div");
    CONTAINER.className = "line-container";

    const TIMESTAMP = document.createElement("span");
    TIMESTAMP.className = "log-timestamp";
    TIMESTAMP.innerText = `[${NOW.getHours()}:${NOW.getMinutes()}:${NOW.getSeconds()}:${NOW.getMilliseconds()}]`;

    const CONTENT = document.createElement("span");
    CONTENT.className = "info-log";
    CONTENT.innerText = text;

    CONTAINER.appendChild(TIMESTAMP);
    CONTAINER.appendChild(CONTENT);
    CONSOLE.insertBefore(CONTAINER, CONSOLE.firstChild);
}

function logWarning(text) {
    const NOW = new Date();

    const CONTAINER = document.createElement("div");
    CONTAINER.className = "line-container";

    const TIMESTAMP = document.createElement("span");
    TIMESTAMP.className = "log-timestamp";
    TIMESTAMP.innerText = `[${NOW.getHours()}:${NOW.getMinutes()}:${NOW.getSeconds()}:${NOW.getMilliseconds()}]`;

    const CONTENT = document.createElement("span");
    CONTENT.className = "warning-log";
    CONTENT.innerText = text;

    CONTAINER.appendChild(TIMESTAMP);
    CONTAINER.appendChild(CONTENT);
    CONSOLE.insertBefore(CONTAINER, CONSOLE.firstChild);
}

function logError(text) {
    const NOW = new Date();

    const CONTAINER = document.createElement("div");
    CONTAINER.className = "line-container";

    const TIMESTAMP = document.createElement("span");
    TIMESTAMP.className = "log-timestamp";
    TIMESTAMP.innerText = `[${NOW.getHours()}:${NOW.getMinutes()}:${NOW.getSeconds()}:${NOW.getMilliseconds()}]`;

    const CONTENT = document.createElement("span");
    CONTENT.className = "error-log";
    CONTENT.innerText = text;

    CONTAINER.appendChild(TIMESTAMP);
    CONTAINER.appendChild(CONTENT);
    CONSOLE.insertBefore(CONTAINER, CONSOLE.firstChild);
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
    const START = new Date();

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

    logInfo(`Generated dataset of ${rowCount} rows in ${new Date() - START} ms`);
}

function getRandomFirstName() {
    return FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
}

function getRandomLastName() {
    return LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
}

function previewDataset() {
    const START = new Date();

    DATASET_PREVIEW_ROOT.replaceChildren();
    
    // Construct a table
    const TABLE = document.createElement("table");
    const TABLE_HEAD = document.createElement("thead");
    const TABLE_BODY = document.createElement("tbody");
    const TABLE_HEAD_ROW = document.createElement("tr");
    const TABLE_HEAD_ROW_INDEX = document.createElement("th");
    const TABLE_HEAD_ROW_FIRST_NAME = document.createElement("th");
    const TABLE_HEAD_ROW_LAST_NAME = document.createElement("th");
    const TABLE_HEAD_ROW_START_BALANCE = document.createElement("th");
    const TABLE_HEAD_ROW_END_BALANCE = document.createElement("th");
    const TABLE_HEAD_ROW_ITEMS_PURCHASED = document.createElement("th");
    
    TABLE_HEAD_ROW_INDEX.innerText = "index";
    TABLE_HEAD_ROW_FIRST_NAME.innerText = "first_name";
    TABLE_HEAD_ROW_LAST_NAME.innerText = "last_name";
    TABLE_HEAD_ROW_START_BALANCE.innerText = "start_balance";
    TABLE_HEAD_ROW_END_BALANCE.innerText = "end_balance";
    TABLE_HEAD_ROW_ITEMS_PURCHASED.innerText = "items_purchased";

    dataset.forEach((row, index) => {
        const ROW_ELEMENT = document.createElement("tr");
        const ROW_INDEX = document.createElement("td");
        const FIRST_NAME = document.createElement("td");
        const LAST_NAME = document.createElement("td");
        const START_BALANCE = document.createElement("td");
        const END_BALANCE = document.createElement("td");
        const PURCHASE_COUNT = document.createElement("td");

        ROW_INDEX.innerText = index;
        FIRST_NAME.innerText = row[0];
        LAST_NAME.innerText = row[1];
        START_BALANCE.innerText = row[2];
        END_BALANCE.innerText = row[3];
        PURCHASE_COUNT.innerText = row[4];

        ROW_ELEMENT.appendChild(ROW_INDEX);
        ROW_ELEMENT.appendChild(FIRST_NAME);
        ROW_ELEMENT.appendChild(LAST_NAME);
        ROW_ELEMENT.appendChild(START_BALANCE);
        ROW_ELEMENT.appendChild(END_BALANCE);
        ROW_ELEMENT.appendChild(PURCHASE_COUNT);
        TABLE_BODY.appendChild(ROW_ELEMENT);
    });

    TABLE.appendChild(TABLE_HEAD);
    TABLE.appendChild(TABLE_BODY);
    TABLE_HEAD.appendChild(TABLE_HEAD_ROW);
    TABLE_HEAD_ROW.appendChild(TABLE_HEAD_ROW_INDEX);
    TABLE_HEAD_ROW.appendChild(TABLE_HEAD_ROW_FIRST_NAME);
    TABLE_HEAD_ROW.appendChild(TABLE_HEAD_ROW_LAST_NAME);
    TABLE_HEAD_ROW.appendChild(TABLE_HEAD_ROW_START_BALANCE);
    TABLE_HEAD_ROW.appendChild(TABLE_HEAD_ROW_END_BALANCE);
    TABLE_HEAD_ROW.appendChild(TABLE_HEAD_ROW_ITEMS_PURCHASED);

    // Display the generated table
    DATASET_PREVIEW_ROOT.appendChild(TABLE);

    logInfo(`Generated dataset table preview in ${new Date() - START} ms`);
}

function onLoadWasmModule() {
    if (wasmModule !== null) {
        logWarning("WebAssembly module has been cached already");
        return;
    }

    let START = new Date();
    
    import("./rs_parser/pkg/rs_parser.js")
        .then(module => {
            const DELTA = new Date() - START;
            
            LOAD_WASM_MODULE_TIME.innerText = `took ${DELTA} ms`;
            logInfo(`WebAssembly module dynamic import took ${DELTA} ms`);
            
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

    let START = new Date();

    wasmModule.default()
        .then(() => {
            const DELTA = new Date() - START;

            INITIALIZE_WASM_MODULE_TIME.innerText = `took ${DELTA} ms`;
            logInfo(`WebAssembly module initialization took ${DELTA} ms`);

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

    let START = new Date();

    wasmModule.greet("WebAssembly");

    const DELTA = new Date() - START;

    EXECUTE_WASM_MODULE_TIME.innerText = `took ${DELTA} ms`;
    logInfo(`WebAssembly execution took ${DELTA} ms`);
}
