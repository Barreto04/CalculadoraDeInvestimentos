const isNoEmptyArray = (arrayElement) => {
    return Array.isArray(arrayElement) && arrayElement.length > 0;
};

export const createTable = (columnsArray, dataArray, tableId) => {
    if (!isNoEmptyArray(columnsArray) || !isNoEmptyArray(dataArray) || !tableId) {
        throw new Error("Para a correta execução, precisamos de um array com colunas, outro com informações das linhas e também o id da tabela");
    };

const tableElement = document.getElementById(tableId);

if(!tableElement || tableElement.nodeName !== "TABLE") {
    throw new Error("O id informado não corresponde a nenhum elemento table");
};

createTableHeader(tableElement, columnsArray);
createTableBody(tableElement, dataArray, columnsArray);
};

function createTableHeader(tableReference, columnsArray) {
    function creatTheadElement(tableReference) {
        const thead = document.createElement("thead");
        tableReference.appendChild(thead);
        return thead;
    }
    const tableHeaderReference = tableReference.querySelector("thead") ?? creatTheadElement(tableReference);
    const headerRow = document.createElement("tr");
    ['bg-blue-900', 'text-slate-200', 'sticky', 'top-0'].forEach((cssClass) =>headerRow.classList.add(cssClass));
    for (const tableColumnObject of columnsArray) {
        const headerElement = `<th class="text-center">${tableColumnObject.columnLabel}</th>`;
        headerRow.innerHTML += headerElement;
    }

    tableHeaderReference.appendChild(headerRow);
};

function createTableBody(tableReference, tableItems, columnsArray) {
    function creatTbodyElement(tableReference) {
        const tbody = document.createElement("tbody");
        tableReference.appendChild(tbody);
        return tbody;
    }
    const tablebodyReference = tableReference.querySelector("thead") ?? creatTbodyElement(tableReference);

    for (const [itemIndex, tableItem] of tableItems.entries()) {
        const tableRow = document.createElement("tr");
        if (itemIndex % 2 !== 0) {tableRow.classList.add('bg-blue-200')};
        for (const tableColumn of columnsArray) {
            const formatFn = tableColumn.format ?? ((info) => info);
            tableRow.innerHTML += `<td class="text-center">${formatFn(tableItem[tableColumn.acessor])}</td>`;
        }
    
        tablebodyReference.appendChild(tableRow);
    }
};