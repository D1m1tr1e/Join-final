class ContactDetails extends HTMLElement {
    /**contact Data*/
    cloneOfSelectedContact = selectedContact.cloneNode(true);
    firstLetters = this.cloneOfSelectedContact.firstChild;
    name = this.cloneOfSelectedContact.children[1].firstChild;
    email = this.cloneOfSelectedContact.children[1].children[1];

    /**HTML data*/
    title = document.createElement("div");
    titleName = document.createElement("h2");
    titleLine = document.createElement("img");
    titleSlogan = document.createElement("p");

    firstRow = document.createElement("div");
    nameAndTaskContainer = document.createElement("div");
    addTask = document.createElement("img");

    secondRow = document.createElement("div");
    editContact = document.createElement("img");

    thirdRow = document.createElement("div");
    phone = document.createElement("a");

    arrowButton = document.createElement("img");
    trashbutton = document.createElement("img");
    editButton = document.createElement("img");

    constructor() {
        super();
        this.loadTitle();
    }

    /**
     * Loads the title section into the details.
     *
     * @memberof ContactDetails
     * @private
     */
    loadTitle() {
        this.appendChild(this.title);
        this.title.appendChild(this.titleName);
        this.title.appendChild(this.titleLine);
        this.title.appendChild(this.titleSlogan);
        this.titleName.innerText = "Contact";
        this.titleSlogan.innerText = "Better with a team";
        this.titleLine.src =
            "../../assets/img/icons/contact/contactDetailsLine.svg";
        this.title.classList.add("contactDetailsTitle");
    }

    /**
     * Updates the contact details and refreshes the display.
     *
     * @memberof ContactDetails
     * @public
     */
    updateContact() {
        this.clearHTML();
        this.reloadContactData();
        this.loadRows();
        this.loadCSS();
        this.loadContact();
        this.loadValues();
        this.loadHover();
    }

    /**
     * Clears the HTML content of various sections in the details.
     *
     * @memberof ContactDetails
     * @private
     */
    clearHTML() {
        this.firstRow.innerHTML = "";
        this.name.innerHTML = "";
        this.secondRow.innerHTML = "";
        this.thirdRow.innerHTML = "";
        this.nameAndTaskContainer.innerHTML = '';
    }

    /**
     * Reloads the contact data for display.
     *
     * @memberof ContactDetails
     * @private
     */
    reloadContactData() {
        this.cloneOfSelectedContact = selectedContact.cloneNode(true);
        this.firstLetters = this.cloneOfSelectedContact.firstChild;
        this.name = this.cloneOfSelectedContact.children[1].firstChild;
        this.email = this.cloneOfSelectedContact.children[1].children[1];
    }

    /**
     * Loads the rows into the details.
     *
     * @memberof ContactDetails
     * @private
     */
    loadRows() {
        this.appendChild(this.firstRow);
        this.appendChild(this.secondRow);
        this.appendChild(this.thirdRow);

        this.appendChild(this.arrowButton);
        this.appendChild(this.trashbutton);
        this.appendChild(this.editButton);
    }

    /**
     * Loads values into various HTML elements.
     *
     * @memberof ContactDetails
     * @private
     */
    loadValues() {
        this.addTask.src = "../../assets/img/icons/contact/addTask.svg";
        this.editContact.src = "../../assets/img/icons/contact/editContact.svg";
        this.arrowButton.src =
            "../../assets/img/icons/contact/arrow-left-line.svg";
        this.trashbutton.src = "../../assets/img/icons/contact/trash.svg";
        this.editButton.src = "../../assets/img/icons/contact/editContactMobile.svg"
        
        this.phone.innerHTML = selectedContact.phone;
        this.phone.href = /*html*/ `tel:${selectedContact.phone}`;
        this.editContact.addEventListener("click", openEditContact);
        this.editButton.addEventListener("click", openEditContact);
        this.arrowButton.addEventListener("click", mobileHideContact);
        this.trashbutton.addEventListener("click", deleteContact);
        this.addTask.addEventListener("click", openAddTask)
    }

    /**
     * Loads CSS styles for the details.
     *
     * @memberof ContactDetails
     * @private
     */
    loadCSS() {
        this.firstRow.classList.add("firstRow");
        this.addTask.classList.add("imageButtons");
        this.editContact.classList.add("imageButtons");
        this.secondRow.classList.add("secondRow");
        this.thirdRow.classList.add("thirdRow");
        this.phone.classList.add("contactDetailsPhone");
        this.firstLetters.classList.add("contactDetailsFirstLetters");
        this.name.classList.add("contactDetailsName");
        this.nameAndTaskContainer.classList.add("nameAndTaskContainer");
        this.arrowButton.classList.add("arrowButton");
        this.trashbutton.classList.add("trashButton");
        this.editButton.classList.add("editContactMobile")
    }

    /**
     * Loads the contact details into the display.
     *
     * @memberof ContactDetails
     * @private
     */
    loadContact() {
        //firstLetters
        this.firstRow.appendChild(this.firstLetters);
        this.firstRow.appendChild(this.nameAndTaskContainer);

        //name and addtask
        this.nameAndTaskContainer.appendChild(this.name);
        this.firstRow.children[1].appendChild(this.addTask);

        //secondRow
        this.secondRow.innerText = "Contact Information";
        this.secondRow.appendChild(this.editContact);

        //thirdRow
        this.thirdRow.innerHTML += "Email";
        this.thirdRow.appendChild(this.email);
        this.thirdRow.innerHTML += "Phone";
        this.thirdRow.appendChild(this.phone);
    }

    /**
     * Loads hover effects for certain elements.
     *
     * @memberof ContactDetails
     * @private
     */
    loadHover() {
        this.elementHover(this.addTask, "addTask");
        this.elementHover(this.editContact, "editContact");
        this.elementHover(this.trashbutton, "trash");
        this.elementHover(this.editButton, "editContactMobile")
    }

   /**
     * Adds hover effect to an HTML element.
     *
     * @param {HTMLImageElement} element - The HTML element to add hover effect.
     * @param {string} name - The name used for constructing the image source.
     * @memberof ContactDetails
     * @private
     */
    elementHover(element, name) {
        element.addEventListener("mouseover", (e) => {
            e.target.src = `../../assets/img/icons/contact/${name}Hover.svg`;
        });

        element.addEventListener("mouseleave", (e) => {
            e.target.src = `../../assets/img/icons/contact/${name}.svg`;
        });
    }

    /**
     * Checks if the details are currently displayed and adjusts the style if needed.
     *
     * @memberof ContactDetails
     * @public
     */
    checkDisplay() {
        if (this.offsetParent === null) {
            let contactDetails = document.querySelector("[contact-details]");
            contactDetails.style.cssText = "display: flex !important";
        }
    }
}

// Defines the custom element "contact-details" using the ContactDetails class.
customElements.define("contact-details", ContactDetails);
