const today = new Date().toISOString().split('T')[0];
const STORAGE_TOKEN = 'VYZOPSU56JQ7TCYKJ90WCXM6VNQ30YOORO87R7EA';
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item'

/**
 * This function is used to save data in remoteStorage
 * 
 * @param {string} key - key or name of the value to set
 * @param {JSON Array} value - value of the item
 * @returns - fetch to save data as string in remoteStorage
 */
async function setItem(key, value) {
    if (!key) {
        console.error("Der Schlüssel darf nicht leer oder undefiniert sein.");
        return;
    }
    console.log('das ist mein SetItem Key',key);
    const payload = { key, value, token: STORAGE_TOKEN };
    return fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload) })
        .then(res => res.json());
}

/**
 * This function is used to load data from remoteStorage
 * 
 * @param {string} key - key of data you want to load
 * @returns value of key as json
 */
async function getItem(key) {
    const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;   
    console.log('Das ist mein getItem key', key);
    return fetch(url).then(res => res.json()).then(res => {
        if (res.data) {
            return res.data.value;
        } throw `Could not find data with key "${key}".`;
    });
}

let uID;
let currentStatus = 'todo';
let allTasks = [];

function setStatus(stat) {
    currentStatus = stat;
}

/**
 * This function updates the allTasks JSON-Array
 */
async function loadAllTasksFromStg() {
    let res = await getItem('allTasks');
    allTasks = JSON.parse(res);
    uID = allTasks.length;
}

/**
 * This function creates a new Task by collecting the form data and pushs it into the allTasks JSON
 */
async function createNewTask() {
    allTasks.push({
        "task-id": `${uID}`,
        "title": `${document.getElementById('title-input').value}`,
        "description": `${document.getElementById('description').value}`,
        "category": `${document.getElementById('category-input').innerText.replace('\n<', '')}`,
        "catColor": `${document.querySelector('.pickedCat > div').className}`,
        "assignedTo": getAssignedContacts(),
        "dueDate": `${document.getElementById('due-date').value}`,
        "prio": `${document.querySelector('.activePick').innerText}`,
        "subtasks": getSubtasks(),
        "status": `${currentStatus}`
    })
    await uploadTasks();
    clearAll();
    await loadAllTasksFromStg();
    await redirectToBoard();
};

/**
 * This function redirects user to board-view after creating task
 */
async function redirectToBoard() {
    await changeContentHTML('../templates/board.html');
    await initBoard();
}

/**
 * this is called after pushing new item to the allTasks Array and uploads it to remote-storage
 */
async function uploadTasks() {
    await setItem('allTasks', JSON.stringify(allTasks));
}


/**
 * This function collects all subtasks from input an pushes it into an array of subtasks
 * 
 * @returns array with Subtasks to place in allTasks json
 */
function getSubtasks() {
    let subtaskArray = [];
    let subtasks = document.querySelectorAll('.subtask-list > li > label');
    for (let i = 0; i < subtasks.length; i++) {
        const sub = subtasks[i];
        subtaskArray.push({ taskText: sub.outerText, completed: false });
    }
    return subtaskArray;
}

/**
 * This function is responsible to deliver the contacts, whose inputs are checked to assign to new task
 * 
 * @returns array with checked contacts to assign the task to
 */
function getAssignedContacts() {
    let contacts = document.querySelectorAll('#contact-selection > .contact-item'); // alle, die mit "checked" input sind
    let contactArray = [];
    for (let i = 0; i < contacts.length - 1; i++) {
        if (contacts[i].lastChild.childNodes[1].checked === true) {
            contactArray.push(contacts[i].innerText);
        }
    }
    return contactArray;
}

/**
 * This function puts the picked color and the name of new category as spaceholde in the category input
 * 
 * @param {string} value - name of the chosen category
 */
function chosenCategory(value) {
    let color = colorSearch(value);
    let dropdownContent = document.getElementById('category-input');
    dropdownContent.innerHTML = `<div class="pickedCat">${value} <div class="${color}"></div></div><span class="active-dropdown">&lt;</span>`;
    dropdownContent.classList.add('cat-picked');
    // toggleDropdown();
}

/**
 * function to get the picked color of new category
 * 
 * @param {string} value - to identify picked color
 * @returns - picked color
 */
function colorSearch(value) {
    for (let i = 0; i < categorys.length; i++) {
        const element = categorys[i];
        if (element.name == value) {
            return element.color;
        }
    }
}
/**
 * this function takes input-value of subtask input and adds it to subtask list
 */
function saveSubtask() {
    let task = document.getElementById('subtask-value');
    let list = document.getElementById('subtask-overview');
    list.innerHTML += /*html*/ `
        <li class="subtask-item">
            <input type="checkbox" id="${task.value}" name="${task.value}" value="subtask3.value">
            <label for="${task.value}">${task.value}</label>
        </li>
    `;
    task.value = '';
    cancelInput('subtask');
}

/**
 * this function starts the form validation and if form is valid, shows success-notifation and 
 * calls  the actual function to create the task
 */
async function validateForm() {
    let title = document.getElementById('title-input');
    let description = document.getElementById('description');
    let category = document.querySelector('.cat-picked').innerText.replace('\n<', '');
    let date = document.getElementById('due-date');
    let titleStat = titleValidation(title);
    let descriptionStat = descriptionValidation(description);
    let catStat = catValidation(category);
    let dateStat = dateValidation(date);
    let prioStat = prioValidation();
    if (titleStat && descriptionStat && catStat && dateStat && prioStat) {
        await createNewTask();
        await checkIfModal();
        await showNotification();
    }
}

/**
 * this function checks if the task was created out of the modal view
 */
async function checkIfModal() {
    let task = document.querySelector('dialog');
    if (task.hasAttribute('open')) {
        await switchModal('add_task.html', 'addtask');
        await initBoard();
    }
};

/**
 * function to show notification with 2 sec timeout
 */
async function showNotification() {
    let alert = document.getElementById('notification');
    alert.classList.add('active-note');
    setTimeout(() => {
        alert.classList.remove('active-note');
    }, 2000);
}

/**
 * this function validates the title input in addtask form.
 * 
 * @param {element} title - element node of title-input in addtask-form
 * @returns true if value isnt empty after trim()
 */
function titleValidation(title) {
    let validationItem = document.getElementById('title-validation');
    if (title.value.trim() === '') {
        validationItem.classList.remove('d-none');
    } else {
        validationItem.classList.add('d-none');
        return true;
    }
}

/**
 * this function validates the description of new task
 * 
 * @param {element} description - Dom-element of textarea
 * @returns true if description exists
 */
function descriptionValidation(description) {
    let validationItem = document.getElementById('description-validation');
    if (description.value.trim() === '') {
        validationItem.classList.remove('d-none');
    } else {
        validationItem.classList.add('d-none');
        return true;
    }
}

/**
 * this funtion validates the category of new task item
 * 
 * @param {element} category - dom element of category dropdown
 * @returns - true, if category is set.
 */
function catValidation(category) {
    let validationItem = document.getElementById('category-validation');
    if (category.innerHTML == 'Choose Category<span>&lt;</span>') {
        validationItem.classList.remove('d-none')
    } else {
        validationItem.classList.add('d-none');
        return true;
    }
}

/**
 * function to see if user picked a date
 * 
 * @param {element} date - dom element of due date input
 * @returns true if date is set.
 */
function dateValidation(date) {
    let validationItem = document.getElementById('date-validation');
    if (date.value == '') {
        validationItem.classList.remove('d-none');
    } else {
        validationItem.classList.add('d-none');
        return true;
    }
}

/**
 * validation function to check if priority button is picked
 * 
 * @returns true if a prio button is picked. if not, message of required input is shown
 */
function prioValidation() {
    let urgent = document.getElementById('urgent');
    let medium = document.getElementById('medium');
    let low = document.getElementById('low');
    let validationItem = document.getElementById('prio-validation');
    if (urgent.classList.contains('activePick')) {
        validationItem.classList.add('d-none');
        return true;
    } else if (medium.classList.contains('activePick')) {
        validationItem.classList.add('d-none');
        return true;
    } else if (low.classList.contains('activePick')) {
        validationItem.classList.add('d-none');
        return true;
    } else {
        validationItem.classList.remove('d-none')
    }
}

/**
 * function to reset the validation items. if this function is called, no "invalid"-message will be shown
 */
function resetValidation() {
    let validation = document.querySelectorAll('.invalid');
    for (let i = 0; i < validation.length; i++) {
        validation[i].classList.add('d-none');
    }
}

loadAllTasksFromStg();
