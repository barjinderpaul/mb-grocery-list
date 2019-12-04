
const CONSTANTS = {
    'NAME_COLUMN':0,
    'UNITS_COLUMN':1,
    'AMOUNT_COLUMN':2,
    'TOTAL_AMOUNT_COLUMN':3,
    'ACTIONS_COLUMN':4
};

const BUILD_FUNCTIONS = {
    'buildRow': (nameOfItem, unitsOfItem, amountOfItem, totalAmount, editButtonString, tdId) => {
                let eachTdId = 0;
                return `<tr>
                    <td id=${tdId.toString()}-${(++eachTdId).toString()}-td > ${nameOfItem} </td> 
                    <td id=${tdId.toString()}-${(++eachTdId).toString()}-td > ${unitsOfItem} </td> 
                    <td id=${tdId.toString()}-${(++eachTdId).toString()}-td > ${amountOfItem} </td> 
                    <td id=${tdId.toString()}-${(++eachTdId).toString()}-td > ${totalAmount} </td> 
                    <td id=${tdId.toString()}-${(++eachTdId).toString()}-td > ${editButtonString}</td>
                    </tr>`
                },

    'buildSaveAndDeleteActionColumnElement' : (rowId) => `
                                            <button class="btn fa fa-save" id=${rowId}-btn onclick="saveRow(this.id)" > </button>
                                            <button class="btn fa fa-trash" id=${rowId}-btn onclick="deleteRow(this.id)" > </button>
                                            `,

    'buildEditAndDeleteActionColumnElement' : (rowId) => `
                                            <button class="btn fa fa-edit" id=${rowId}-btn onclick="editRow(this.id)" > </button>
                                            <button class="btn fa fa-trash" id=${rowId}-btn onclick="deleteRow(this.id)" > </button>
                                            `,

    'buildGrandTotalElementRow': (grandTotal) => `<tr id="grand-total">
                                                    <td class="td-not-display"></td>
                                                    <td class="td-not-display"></td>
                                                    <td>Grand Total</td>
                                                    <td>${grandTotal}</td>
                                                </tr>`

                                

}

let uniqueId = 0
let grandTotal = 0


// This function checks whether the user input from name, units and amount field is valid or not
function validInput(nameOfItem, unitsOfItem, amountOfItem) {
    if(nameOfItem === '' || unitsOfItem === '' || amountOfItem === ''){
        alert('Details entered are incomplete/incorrect');
        return false;
    }

    if(parseInt(unitsOfItem) < 0 || parseFloat(amountOfItem)<0.0) {
        alert('Enter correct amount');
        return false;
    }
    return true;
}


/*  This function 
    * takes the input from the user,
    * validates the input,
    * builds the row from inputs
    * adds row to the table
    * updates grand-total value
*/
function addContent() {
    let nameOfItem = document.getElementById('name').value;
    let unitsOfItem = document.getElementById('units').value;  
    let amountOfItem = document.getElementById('amount').value;

    let isValid = validInput(nameOfItem, unitsOfItem, amountOfItem)
    if (isValid === false) {
        return;
    }

    let totalAmount = parseInt(unitsOfItem) * parseFloat(amountOfItem);
    grandTotal += totalAmount

    // returns HTMLTableSectionElement
    let tableBody = document.getElementById('grocery-table').getElementsByTagName('tbody')[0];

    uniqueId += 1;
    let tdElementId = uniqueId;

    let uniqueIdStringButton = uniqueId.toString()+'-btn';
    let editButtonString = "<button class=\"btn fa fa-edit\" id="+uniqueIdStringButton+" onclick=\"editRow(this.id)\"></button>  <button class=\"btn fa fa-trash\" id="+uniqueIdStringButton+" onclick=\"deleteRow(this.id)\"></button>"

    let newItem = document.createElement('tr');
    newItem.innerHTML = BUILD_FUNCTIONS.buildRow(nameOfItem,unitsOfItem,amountOfItem,totalAmount,editButtonString,tdElementId);
    newItem.setAttribute("id",(uniqueId.toString()));

    deleteGrandTotalRow();
    tableBody.appendChild(newItem)
    addGrandTotalRow();

    document.getElementById('name').value = ""
    document.getElementById('units').value = ""
    document.getElementById('amount').value = ""

}

/*
    This function 
    * takes the id of the button which calls this function, as an argument
    * sets the attribute (contenteditable) of each 'td' element = true, which makes content editable
    * swaps the row with same values but replaces edit button with the save button
    * updates grand-total value
*/

function editRow(buttonId) {

    let rowId = buttonId.split('-')[0]
    
    let allTdElementsOfRowId = document.getElementById(rowId).children
    let textContentOfEachTd = []

    for(let currentTdElement=0;currentTdElement<allTdElementsOfRowId.length-1;currentTdElement++){

        if(allTdElementsOfRowId[currentTdElement].id !== (rowId+'-4-td')) {
            allTdElementsOfRowId[currentTdElement].setAttribute("contenteditable","true")
        }
        else {
            grandTotal -= parseFloat(allTdElementsOfRowId[currentTdElement].textContent)
        }
        textContentOfEachTd.push(allTdElementsOfRowId[currentTdElement].outerHTML)

    }

    let saveDeleteActionElementColumn = BUILD_FUNCTIONS.buildSaveAndDeleteActionColumnElement(rowId);
    let saveButtonString = "<tr> "+textContentOfEachTd[CONSTANTS.NAME_COLUMN]+' '+textContentOfEachTd[CONSTANTS.UNITS_COLUMN]+' '+textContentOfEachTd[CONSTANTS.AMOUNT_COLUMN]+' '+textContentOfEachTd[CONSTANTS.TOTAL_AMOUNT_COLUMN]+' <td>'+saveDeleteActionElementColumn+"</td> </tr>"
    
    document.getElementById("grocery-table").rows.namedItem(rowId).innerHTML = saveButtonString
}

/*
    This function
    * takes the id of the button which calls this function, as an argument
    * takes the edited values of the row in which button is present
    * checks whether the inputs are valid or not, if not asks to enter again
    * if valid, updates the values to the row and updates the total and grand-total columns
    * swaps the save button with edit button but with new values
    * updates grand-total value
*/
function saveRow(buttonId) {
    let rowId = buttonId.split('-')[0]

    let allTdElementsOfRowId = document.getElementById(rowId).children
    let textContentOfEachTdElement = []
    
    for(let i=0;i<allTdElementsOfRowId.length-1;i++){
        textContentOfEachTdElement.push(allTdElementsOfRowId[i])
    }

    let newUnits = parseInt(textContentOfEachTdElement[1].textContent);
    let newAmount = parseInt(textContentOfEachTdElement[2].textContent);

    if(Number.isNaN(newUnits)|| Number.isNaN(newAmount)) {
        alert('Enter valid data');
        saveRow();
    }

    for(let i=0;i<allTdElementsOfRowId.length-1;i++){
        allTdElementsOfRowId[i].setAttribute("contenteditable","false")
    }

    let newTotalAmount = newUnits * newAmount;
    grandTotal += newTotalAmount

    textContentOfEachTdElement[CONSTANTS.TOTAL_AMOUNT_COLUMN].textContent = newTotalAmount.toString()

    let editDeleteActionElementColumn = BUILD_FUNCTIONS.buildEditAndDeleteActionColumnElement(rowId)

    let editButtonString = "<tr> "+textContentOfEachTdElement[CONSTANTS.NAME_COLUMN].outerHTML+' '+textContentOfEachTdElement[CONSTANTS.UNITS_COLUMN].outerHTML+' '+textContentOfEachTdElement[CONSTANTS.AMOUNT_COLUMN].outerHTML+' '+textContentOfEachTdElement[CONSTANTS.TOTAL_AMOUNT_COLUMN].outerHTML+' <td>'+editDeleteActionElementColumn+"</td> </tr>"

    document.getElementById("grocery-table").rows.namedItem(rowId).innerHTML = editButtonString
    deleteGrandTotalRow();
    addGrandTotalRow();
    
}

/*
    This function
    * takes the id of the button which calls this function, as an argument
    * calculates row-id from the button-id
    * decreases the grand-total value
    * deletes the row
    * updates grand-total value
*/

function deleteRow(buttonId) {

    let rowId = buttonId.split('-')[0]
    let allTdElementsOfRowId = document.getElementById(rowId).children

    grandTotal -= parseFloat(allTdElementsOfRowId[3].textContent)
    
    let rowToDelete = document.getElementById(rowId);
    rowToDelete.parentNode.removeChild(rowToDelete);

    deleteGrandTotalRow();
    addGrandTotalRow();
    
}

/*
    This function
    * deletes the grand-total row such that it's value can be updated.
*/
function deleteGrandTotalRow(){

    let row = document.getElementById("grand-total");
    row.parentNode.removeChild(row);

}

/*
    This function
    * adds grand-total row with the updated value of grand-total
*/
function addGrandTotalRow() {

    let tableBody = document.getElementById('grocery-table').getElementsByTagName('tbody')[0];
    
    let grandTotalElementRow = BUILD_FUNCTIONS.buildGrandTotalElementRow(grandTotal)

    let grandTotalElement = document.createElement('tr');
    grandTotalElement.innerHTML = grandTotalElementRow
    grandTotalElement.setAttribute("id","grand-total");

    tableBody.appendChild(grandTotalElement);

}