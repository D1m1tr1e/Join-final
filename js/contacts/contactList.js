class ContactList extends HTMLElement {
    contactList = [];

    contactDivider = document.createElement("div");
    letter = document.createElement("div");
    line = document.createElement("div");

    lastSortingLetter;

    constructor() {
        super();
        this.loadContactDivider();
        this.sortContacts();
        this.loadContactsToHTML();
    }

    /**
     * Sorts the contacts in the contact list alphabetically by name.
     *
     * @memberof ContactList
     * @private
     */
    sortContacts() {
        this.contactList.sort((a, b) => {
            let x = a.name.toLowerCase();
            let y = b.name.toLowerCase();
            if (x < y) {
                return -1;
            }
            if (x > y) {
                return 1;
            }
            return 0;
        });
    }

    /**
     * Loads the HTML structure for the contact divider.
     *
     * @memberof ContactList
     * @private
     */
    loadContactDivider() {
        //html
        this.contactDivider.appendChild(this.letter);
        this.contactDivider.appendChild(this.line);

        //css
        this.contactDivider.classList.add("contactDivider");
        this.letter.classList.add("contactDividerLetter");
        this.line.classList.add("contactDividerLine");
    }

    /**
     * Loads the contacts into the HTML representation.
     *
     * @memberof ContactList
     * @private
     */
    loadContactsToHTML() {
        this.innerHTML = "";
        this.contactList.forEach((contact) => {
            if (contact.sortingLetter !== this.lastSortingLetter) {
                let contactDividerClone = this.contactDivider.cloneNode(true);
                contactDividerClone.firstChild.innerHTML =
                    contact.sortingLetter;
                this.appendChild(contactDividerClone);
            }
            this.appendChild(contact);
            this.lastSortingLetter = contact.sortingLetter;
        });
    }

    /**
     * Saves the contact list to remote storage.
     *
     * @memberof ContactList
     * @public
     */
    async saveToRemoteStorage() {
        let contactListForStorage = [];
        this.contactList.forEach((contact) => {
            let contactForStorage = {
                name: contact.name,
                email: contact.email,
                phone: contact.phone,
                color: contact.color,
            };
            contactListForStorage.push(contactForStorage);
        });
        await setItem("contactList", JSON.stringify(contactListForStorage));
    }

    /**
     * Loads the contact list from remote storage.
     *
     * @memberof ContactList
     * @public
     */
    async loadFromRemoteStorage() {
        let res = await getItem("contactList");
        let contactListFromStorage = JSON.parse(res);
        this.contactList = [];
        contactListFromStorage.forEach((contact) => {
            this.contactList.push(
                new Contact(contact.name, contact.email, contact.phone, contact.color)
            );
        });
    }

    /**
     * Adds a new contact to the contact list.
     *
     * @param {string} name - The name of the contact.
     * @param {string} phone - The phone number of the contact.
     * @param {string} email - The email address of the contact.
     * @memberof ContactList
     * @public
     */
    async addContact(name, phone, email) {
        let contactToAdd = new Contact(name, phone, email);
        this.contactList.push(contactToAdd);
        await this.save();
    }

    /**
     * Saves the contact list and triggers sorting.
     *
     * @memberof ContactList
     * @public
     */
    async save() {
        this.sortContacts();
        await this.saveToRemoteStorage();
    }

    /**
     * Deletes the selected contact from the contact list.
     *
     * @memberof ContactList
     * @public
     */
    async delete() {
        const contactIndex = this.contactList.findIndex(
            (element) => element === selectedContact
        );
        this.contactList.splice(contactIndex, 1);
        await this.save();
    }

    /**
     * Removes the hover effect from all contact cards.
     *
     * @memberof ContactList
     * @public
     */
    removeHover() {
        this.contactList.forEach((contactCard) => {
            let checkContact =
                contactCard.classList.contains("contactCardFocus");
            if (checkContact) {
                contactCard.classList.remove("contactCardFocus");
            }
        });
    }
}

// Defines the custom element "contact-list" using the ContactList class.
customElements.define("contact-list", ContactList);
