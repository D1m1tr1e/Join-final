/**global variables */

let selectedContact = new Contact("", "", "", ""); //I dont know why its needed! Dont remove! Ignore the error!
let contacts = new ContactList();
let contactDetails = new ContactDetails();
let isContactListHidden = false;

/**
 * Asynchronously loads and updates the contact container, changing the content to the contacts template and inserting contact HTML.
 */
async function loadContactContainer() {
    await updateContacts();
    await changeContentHTML("../templates/contacts.html");
    insertContactHTML();
}

/**
 * Inserts contact HTML into the contact list and contact details containers.
 */
function insertContactHTML() {
    let contactListContainer = document.querySelector("[contact-list]");
    let contactDetailsContainer = document.querySelector("[contact-details]");

    contactListContainer.appendChild(contacts);
    contactDetailsContainer.appendChild(contactDetails);
}

/**
 * Asynchronously updates the contacts by loading them from remote storage, sorting them, and loading the HTML representation.
 */
async function updateContacts() {
    await contacts.loadFromRemoteStorage();
    contacts.sortContacts();
    contacts.loadContactsToHTML();
}

/**
 *
 * @param event {event}
 * @returns {Promise<void>}
 */
async function addContact(event) {
    event.preventDefault();
    let name = event.target[0].value;
    let phone = event.target[1].value;
    let email = event.target[2].value;
    await contacts.addContact(name, email, phone);
    await switchModal();
    await updateContacts();
}

/**
 * Asynchronously opens the edit contact modal, switches the content to the edit contact template, and loads data into the modal.
 *
 * @returns {Promise<void>} - A Promise that resolves when the edit contact modal is opened and data is loaded.
 */
async function openEditContact() {
    await switchModal("../templates/modals/edit_Contact.html", "contact");
    loadIntoModal();
    loadFirstLettersIntoModal();
}

/**
 * Loads contact data into the form fields of the currently opened modal.
 */
function loadIntoModal() {
    let contactData = [
        (contactName = selectedContact.name),
        (contactPhone = selectedContact.phone),
        (contactEmail = selectedContact.email),
    ];
    for (
        let contactDataNum = 0;
        contactDataNum < contactData.length;
        contactDataNum++
    ) {
        const contactValue = contactData[contactDataNum];
        const form = document.querySelector("form");
        form.children[contactDataNum].value = contactValue;
    }
}

/**
 * Loads the first letters of the selected contact into the designated element in the currently opened modal.
 */
function loadFirstLettersIntoModal() {
    const human = document.querySelector(".human");
    human.style.backgroundColor = selectedContact.color;
    human.style.color = 'white';
    human.innerHTML = selectedContact.firstLetters;
    human.classList.add('contactDetailsFirstLetters')
}

/**
 *
 * @param e{event}
 * @returns {Promise<void>}
 */
async function saveContact(e) {
    e.preventDefault();
    const form = document.querySelector("form");
    selectedContact.name = form.children[0].value;
    selectedContact.phone = form.children[1].value;
    selectedContact.email = form.children[2].value;
    await contacts.save();
    await updateContacts();
    await switchModal();
    selectedContact.reload();
    contactDetails.clearHTML();
}

/**
 * Asynchronously deletes the selected contact, hides the contact details modal, and updates the contacts.
 *
 * @returns {Promise<void>} - A Promise that resolves when the contact is deleted, the contact details modal is cleared, and the contacts are updated.
 */
async function deleteContact() {
    if (window.innerWidth < 1001) {
        mobileHideContact();
    } else {
        await switchModal();
    }
    await contacts.delete();
    contactDetails.clearHTML();
    await updateContacts();
}

/**
 * Hides or shows the contact details and list on mobile, and adjusts the visibility of the "Add Contact" button.
 */
function mobileHideContact() {
    let contactDetails = document.querySelector("[contact-details]");
    let contactList = document.querySelector("[contact-list]");
    let newContactButton = document.querySelector(".addContactButton");
    if (isContactListHidden === false) {
        contactDetails.classList.remove("dpNoneMobile");
        newContactButton.classList.add("dpNoneMobile");
        contactList.classList.add("dpNoneMobile");
        isContactListHidden = true;
    } else {
        contactDetails.classList.add("dpNoneMobile");
        contactList.classList.remove("dpNoneMobile");
        newContactButton.classList.remove("dpNoneMobile");
        isContactListHidden = false;
    }
}

/**
 * Asynchronously opens the "Add Task" modal.
 *
 * @returns {Promise<void>} - A Promise that resolves when the "Add Task" modal is opened.
 */
async function openAddTask() {
    await switchModal("add_task.html", "addTaskInContact");
}

/**
 *
 * @param contactCard {Contact}
 */
function loadFocus(contactCard) {
    contacts.removeHover();
    contactCard.classList.add("contactCardFocus");
}
