let loadedContacts = [];
let categorys = [
    {
        name: 'Marketing',
        color: 'purple'
    },
    {
        name: 'Sales',
        color: 'red'
    },
    {
        name: 'Development',
        color: 'blue'
    },
    {
        name: 'Accounting',
        color: 'pink'
    },
];

/**
 * this functions loads all contacts from remote-storage and pushes it to loadedContacts-Array
 */
async function loadContactsStorage() {
    let res = await getItem("contactList");
    loadedContacts = JSON.parse(res);
}

loadContactsStorage();
/**
 * function to toggle dropdown of contact assigning
 */
function toggleAssigning() {
    const dropdownArrow = document.querySelector('#contacts-input span');
    const selection = document.querySelector('.contacts-selection');
    const layer = document.getElementById('layerForContactDD');
    if (selection.classList.contains('active')) {
        selection.classList.remove('active');
        dropdownArrow.classList.remove('active-arrow');
        layer.classList.add('d-none');
    } else {
        selection.classList.add('active');
        dropdownArrow.classList.add('active-arrow');
        layer.classList.remove('d-none');
    }
    renderContacts();
}

function toggleEditAssigning(taskId) {
    const dropdownArrow = document.querySelector('#contacts-input span');
    const selection = document.querySelector('.contacts-selection');
    if (selection.classList.contains('active')) {
        selection.classList.remove('active');
        dropdownArrow.classList.remove('active-arrow');
    } else {
        selection.classList.add('active');
        dropdownArrow.classList.add('active-arrow');
    }
    renderEditableContacts(taskId);
    preCheckedContacts(taskId);
}

function preCheckedContacts(taskId) {
    const assignings = allTasks[taskId]['assignedTo'];
    let selection = document.querySelectorAll('.contact-item');
    for (let i = 0; i < selection.length - 1; i++) {
        const contact = selection[i].innerText; // Name des Kontakts aus allen Kontakten
        for (let j = 0; j < assignings.length; j++) {
            let curAssigning = assignings[j];   // ein bereits zugewiesener Kontakt
            if (contact === curAssigning) {
                document.getElementById(curAssigning).checked = true;
            }
        }
    }
}

/**
 * function to render contacts in dropdown list
 */
function renderContacts() {
    let list = document.getElementById('contact-selection');
    list.innerHTML = '';
    for (let i = 0; i < loadedContacts.length; i++) {
        const contact = loadedContacts[i];
        list.innerHTML += `<div class="contact-item"><label for="${contact.name}">${contact.name}<input class="dropdown-check" type="checkbox" id="${contact.name}"></label></div>`
    }
    list.innerHTML += `<div class="contact-item" onclick="inviteContact()">Invite new contact<span><img class="addcontact-li" src="../img/icons/contacts-black.svg"></span></div>`
}

function renderEditableContacts(taskId) {
    let list = document.getElementById('contact-selection');
    list.innerHTML = '';
    for (let i = 0; i < loadedContacts.length; i++) {
        const contact = loadedContacts[i];
        list.innerHTML += `<div class="contact-item"><label for="${contact.name}">${contact.name}<input class="dropdown-check" type="checkbox" id="${contact.name}"></label></div>`
    }
    list.innerHTML += `<div class="contact-item" onclick="inviteContactEdit(${taskId})">Invite new contact<span><img class="addcontact-li" src="../img/icons/contacts-black.svg"></span></div>`
}

/**
 * this function shows or hides the add subtask buttons
 * 
 * @param {string} formElement - handles the "add subtask" buttons visibility
 */
function changeFormIcons(formElement) {
    if (formElement === 'subtask') {
        let btns = document.querySelector('.addTaskBtns');
        btns.classList.remove('d-none');
        let inputHolder = document.querySelector('#subtask-placeholder');
        inputHolder.classList.add('d-none');
        let subtaskInput = document.querySelector('.subtask-input');
        subtaskInput.classList.remove('d-none');
        subtaskInput.focus();
        let list = document.getElementById('subtask-overview');
        list.classList.add('mtop-n50');
    }
}


/**
 * this function stops the input of form element
 * 
 * @param {string} formElement - parameter to show which element on website is triggered
 */
function cancelInput(formElement) {
    if (formElement == 'subtask') {
        let plus = document.querySelector('#subtask-placeholder span');
        plus.classList.remove('d-none');
        let btns = document.querySelector('.addTaskBtns');
        btns.classList.add('d-none');
        let inputHolder = document.querySelector('#subtask-placeholder');
        inputHolder.classList.remove('d-none');
        let subtaskInput = document.querySelector('.subtask-input');
        subtaskInput.classList.add('d-none');
        let list = document.getElementById('subtask-overview');
        list.classList.remove('mtop-n50');
    } else if (formElement === 'contact') {
        let placeholder = document.getElementById('contacts-input');
        let input = document.querySelector('.inviteContactInput');
        let buttons = document.querySelector('.inviteContactBtn');
        placeholder.classList.remove('d-none');
        input.classList.add('d-none');
        buttons.classList.add('d-none');
        input.value = '';
    } else if (formElement === 'cat') {
        let placeholder = document.getElementById('category-input');
        let input = document.querySelector('.addCategoryInput');
        let buttons = document.querySelector('.createCatBtn');
        let colorPicker = document.querySelector('.category-colors');
        let contactDD = document.querySelector('.contact-dropdown');
        contactDD.classList.remove('m-top');
        placeholder.classList.remove('d-none');
        input.classList.add('d-none');
        buttons.classList.add('d-none');
        colorPicker.classList.add('d-none');
    }
}

/**
 * function to show input field for new contact invite
 */
function inviteContact() {
    toggleAssigning();
    let placeholder = document.getElementById('contacts-input');
    let input = document.querySelector('.inviteContactInput');
    let buttons = document.querySelector('.inviteContactBtn');

    placeholder.classList.add('d-none');
    input.classList.remove('d-none');
    buttons.classList.remove('d-none');
    input.focus();
}

/**
 * function to create and render new category
 */
function createCategory() {
    toggleDropdown();
    let placeholder = document.getElementById('category-input');
    let input = document.querySelector('.addCategoryInput');
    let buttons = document.querySelector('.createCatBtn');
    let colorPicker = document.querySelector('.category-colors');
    let contactDD = document.querySelector('.contact-dropdown');
    placeholder.classList.add('d-none');
    contactDD.classList.add('m-top');
    input.classList.remove('d-none');
    buttons.classList.remove('d-none');
    colorPicker.classList.remove('d-none');
    input.focus();
}

/**
 * this function shows the picked color for new category item
 * 
 * @param {string} color - is var for 1 to 1 comparison of picked color
 */
function pickCatColor(color) {
    let colorlist = document.querySelectorAll('.category-colors div')
    for (let i = 0; i < colorlist.length; i++) {
        colorlist[i].classList.remove('selectedColor');
    }

    let pickedColor = document.querySelector(`.${color}`);
    pickedColor.classList.add('selectedColor');
}

/**
 * function to save new category
 */
function saveNewCat() {
    let contactDD = document.querySelector('.contact-dropdown');
    let catTitle = document.querySelector('.addCategoryInput').value;
    let catColor = document.querySelector('.selectedColor').classList[0];
    let newCategory = {
        name: catTitle,
        color: catColor
    }
    categorys.push(newCategory);
    contactDD.classList.remove('m-top');
    renderCategorys();
    showNewCat();
    chosenCategory(catTitle);
    cancelInput('cat');
}

/**
 * this function is called after saving new category. its job is to show the new category as picked category
 */
function showNewCat() {
    let element = categorys[categorys.length - 1];
    let placeholder = document.getElementById('category-input');
    placeholder.innerHTML = `
    <div class="">${element.name}<div class="${element.color}"></div></div><span class="active-arrow">&lt;</span>
    `
    placeholder.classList.add('cat-picked');
}

/**
 * this function sets the picked prio button on active styles
 * 
 * @param {string} pick - with name of the picked prio button color
 */
function pickPrio(pick) {
    resetPrio();
    let button = document.querySelector(`.${pick}`);
    if (button.classList.contains('activePick')) {
        resetPrio();
    } else {
        switch (pick) {
            case 'urgent':
                button.classList.add('activeUrgent');
                button.classList.add('activePick');
                break;
            case 'medium':
                button.classList.add('activeMedium');
                button.classList.add('activePick');
                break;
            case 'low':
                button.classList.add('activeLow');
                button.classList.add('activePick');
                break;
        }
    }
}

/**
 * function to reset the prio buttons activeness
 */
function resetPrio() {
    let urgent = document.querySelector('.prio-buttons .urgent');
    let medium = document.querySelector('.prio-buttons .medium');
    let low = document.querySelector('.prio-buttons .low');
    urgent.classList = 'urgent';
    medium.classList = 'medium';
    low.classList = 'low';
}

/**
 * function to change the placeholder color when date is picked
 */
function dateColor() {
   document.querySelector('#due-date').style.color = "black";
}

/**
 * function to reset the whole add task form
 */
function clearAll() {
    let title = document.getElementById('title-input');
    let description = document.getElementById('description');
    let category = document.getElementById('category-input');
    let contactlist = document.querySelectorAll('.dropdown-check');
    let date = document.getElementById('due-date');
    let tasklist = document.querySelector('.subtask-list');
    title.value = '';
    description.value = '';
    tasklist.innerHTML = '';
    date.value = '';
    date.style.color = '';
    resetPrio();
    category.innerHTML = 'Choose Category<span>&lt;</span>';
    clearContacts(contactlist);
    resetValidation();
}

/**
 * function to uncheck the checkboxes of contactassigning
 * 
 * @param {DOMTokenList} contactlist - All contact items
 */
function clearContacts(contactlist) {
    contactlist.forEach(element => {
        element.checked = false;
    });
}

/**
 * function to toggle category dropdown
 */
function toggleDropdown() {
    renderCategorys();
    const dropdownArrow = document.querySelector('#category-input span');
    const selection = document.querySelector('.item-selection');
    const layer = document.getElementById('layerForCats');
    if (selection.classList.contains('active')) {
        selection.classList.remove('active');
        dropdownArrow.classList.remove('active-arrow');
        layer.classList.add('d-none');
    } else {
        selection.classList.add('active');
        dropdownArrow.classList.add('active-arrow');
        layer.classList.remove('d-none');
    }
}

/**
 * this function renders all categorys of categorys-array
 */
function renderCategorys() {
    let catContainer = document.getElementById('category-selection');

    catContainer.innerHTML = '<li onclick="createCategory()">Add new category</li>';
    for (let i = 0; i < categorys.length; i++) {
        catContainer.innerHTML += `
            <li onclick="chosenCategory('${categorys[i].name}')">${categorys[i].name}<div class="${categorys[i].color}"></div></li>
        `
    }
}

function preventPastDate() {
    document.getElementById("due-date").setAttribute("min", today);
}