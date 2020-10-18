// Butttons
const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveItemBtns = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');

// Item Lists
const listColumns = document.querySelectorAll('.drag-item-list');
const backlogList = document.getElementById('backlog-list');
const progressList = document.getElementById('progress-list');
const completeList = document.getElementById('complete-list');
const onHoldList = document.getElementById('on-hold-list');

// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];

// Drag Functionality 
let draggedItem;
let dragging = false;
let currentColumn;

// Items
let updatedOnLoad = false;


// ------------- LOCAL STORAGE --------------------- 

// Get arrays from localStorage if available, set default values if not
function getSavedColumns() {
	if (localStorage.getItem('backlogItems')) {
		backlogListArray = JSON.parse(localStorage.backlogItems);
		progressListArray = JSON.parse(localStorage.progressItems);
		completeListArray = JSON.parse(localStorage.completeItems);
		onHoldListArray = JSON.parse(localStorage.onHoldItems);
	} else {
		backlogListArray = ['Listen podcast', 'Watch documentary'];
		progressListArray = ['Work on projects', 'Study'];
		completeListArray = ['Course project', 'Cleaning house'];
		onHoldListArray = ['Do laundry'];
	}
}

// Set localStorage Arrays
function updateSavedColumns() {
	listArrays = [backlogListArray, progressListArray, completeListArray, onHoldListArray];
	const arrayNames = ['backlog', 'progress', 'complete', 'onHold'];
	arrayNames.forEach((arrayName, i) => {
		localStorage.setItem(`${arrayName}Items`, JSON.stringify(listArrays[i]));
	});
}

// Removing empty/null items
function filterArray(array) {
	const filteredArray = array.filter(item => item !== null);
	return filteredArray;
}

// ------------ DOM --------------------

// Create list item
function createItemEl(columnEl, column, item, index) {
	// List item
	const listEl = document.createElement('li');
	listEl.classList.add('drag-item');
	listEl.textContent = item;
	// Drag & Drop
	listEl.draggable = true;
	listEl.setAttribute('ondragstart', 'drag(event)');
	listEl.contentEditable = true;
	listEl.id = index;
	listEl.setAttribute('onfocusout', `updateItem(${index}, ${column})`);
	// Append
	columnEl.appendChild(listEl);
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {

	// Check localStorage once
	if (!updatedOnLoad) {
		getSavedColumns();
	}
	backlogList.textContent = '';
	progressList.textContent = '';
	completeList.textContent = '';
	onHoldList.textContent = '';

	// Backlog Column
	backlogListArray.forEach((backlogItem, index) => { createItemEl(backlogList, 0, backlogItem, index); });
	backlogListArray = filterArray(backlogListArray);
	// Progress Column
	progressListArray.forEach((progressItem, index) => { createItemEl(progressList, 1, progressItem, index); });
	progressListArray = filterArray(progressListArray);
	// Complete Column
	completeListArray.forEach((completeItem, index) => { createItemEl(completeList, 2, completeItem, index); });
	completeListArray = filterArray(completeListArray);
	// On Hold Column
	onHoldListArray.forEach((onHoldItem, index) => { createItemEl(onHoldList, 3, onHoldItem, index); });
	onHoldListArray = filterArray(onHoldListArray);

	updatedOnLoad = true;
	updateSavedColumns();
}

// Update item -- Delete or update array value
function updateItem(id, column) {
	const selectedArray = listArrays[column];
	const selectedColumnEl = listColumns[column].children;
	if (!dragging) {
		if (!selectedColumnEl[id].textContent) {
			delete selectedArray[id];
		} else {
			selectedArray[id] = selectedColumnEl[id].textContent;
		}
		updateDOM();
	}
}

// Add to column 
function addToColumn(column) {
	// console.log(addItems[column].textContent);
	const itemText = addItems[column].textContent;
	selectedArray = listArrays[column];
	selectedArray.push(itemText);
	addItems[column].textContent = '';
	updateDOM();
}

function rebuildArrays() {
	backlogListArray = Array.from(backlogList.children).map(i => i.textContent);
	progressListArray = Array.from(progressList.children).map(i => i.textContent);
	completeListArray = Array.from(completeList.children).map(i => i.textContent);
	onHoldListArray = Array.from(onHoldList.children).map(i => i.textContent);
	updateDOM();
}

// ------------ SHOW/HIDE INPUT BOX ------------

// show add item input box
function showInputBox(column) {
	addBtns[column].style.visibility = 'hidden';
	saveItemBtns[column].style.display = 'flex';
	addItemContainers[column].style.display = 'flex';
}

// hide input box
function hideInputBox(column) {
	addBtns[column].style.visibility = 'visible';
	saveItemBtns[column].style.display = 'none';
	addItemContainers[column].style.display = 'none';
	addToColumn(column);
}

// ------------- DROP & DRAG ------------------

function drag(e) {
	draggedItem = e.target;
	dragging = true;
	// console.log(draggedItem);
}

// When item enters column area
function dragEnter(column) {
	listColumns[column].classList.add('over');
	currentColumn = column;
}

function allowDrop(e) {
	e.preventDefault();
}

function drop(e) {
	e.preventDefault();
	// Remove background color/padding
	listColumns.forEach((column) => {
		column.classList.remove('over');
	});
	// Add item to column
	const parent = listColumns[currentColumn];
	parent.appendChild(draggedItem);
	rebuildArrays();
	// Done dragging the item
	dragging = false;
}

// ----------- ON INIT ----------- //
updateDOM();