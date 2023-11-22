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

    //contact data

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

    //html

    loadContactDivider() {
        //html
        this.contactDivider.appendChild(this.letter);
        this.contactDivider.appendChild(this.line);

        //css
        this.contactDivider.classList.add("contactDivider");
        this.letter.classList.add("contactDividerLetter");
        this.line.classList.add("contactDividerLine");
    }

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

    //remote Storage

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
     *
     * @param name {string}
     * @param phone {string}
     * @param email {string}
     */
    async addContact(name, phone, email) {
        let contactToAdd = new Contact(name, phone, email);
        this.contactList.push(contactToAdd);
        await this.save();
    }

    async save() {
        this.sortContacts();
        await this.saveToRemoteStorage();
    }

    async delete() {
        const contactIndex = this.contactList.findIndex(
            (element) => element === selectedContact
        );
        this.contactList.splice(contactIndex, 1);
        await this.save();
    }

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

customElements.define("contact-list", ContactList);
