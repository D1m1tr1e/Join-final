class Contact extends HTMLElement {
    /**contact data */
    name;
    email;
    phone;
    firstLetters;
    sortingLetter;
    color;
    colors = [
        "#FF7A00",
        "#9327FF",
        "#29ABE2",
        "#FC71FF",
        "#02CF2F",
        "#AF1616",
        "#462F8A",
    ];

    /**HTML data */
    firstLettersHTML = document.createElement("div");
    divForNameAndEmail = document.createElement("div");
    nameHTML = document.createElement("div");
    emailHTML = document.createElement("a");

    /**
     *
     * @param {string} name
     * @param {string} email
     * @param {string} phone
     * @param {string} color
     */
    constructor(name, email, phone, color) {
        super();
        this.name = name;
        this.email = email;
        this.phone = phone;
        if (color) {
            this.color = color;
        }
        if (this.name) {
            this.getFirstLetters();
            this.getSortingLetter();
        }
        this.getColor();
        this.loadValues();
        this.loadCSS();
        this.loadHTML();
        this.loadClickFunction();
    }

    getFirstLetters() {
        let positionOfSecondname = this.name.indexOf(" ");
        let letterOfFirstname = this.name.slice(0, 1).toUpperCase();
        let letterOfSecondname = this.name
            .slice(positionOfSecondname + 1, positionOfSecondname + 2)
            .toUpperCase();
        this.firstLetters = letterOfFirstname + letterOfSecondname;
    }

    getSortingLetter() {
        this.sortingLetter = this.name.slice(0, 1).toUpperCase();
    }

    getColor() {
        if (this.color === undefined) {
            let colorNumber = Math.floor(Math.random() * 7);
            this.color = this.colors[colorNumber];
        }
    }

    loadHTML() {
        this.appendChild(this.firstLettersHTML);
        this.appendChild(this.divForNameAndEmail);
        this.divForNameAndEmail.appendChild(this.nameHTML);
        this.divForNameAndEmail.appendChild(this.emailHTML);
    }

    loadCSS() {
        this.firstLettersHTML.classList.add("contactCardFirstLetters");
        this.firstLettersHTML.style.backgroundColor = this.color;
        this.divForNameAndEmail.classList.add("contactCardDivForNameAndEmail");
        this.nameHTML.classList.add("contactCardName");
        this.emailHTML.classList.add("contactCardEmail");
    }

    loadValues() {
        this.firstLettersHTML.innerText = this.firstLetters;
        this.nameHTML.innerText = this.name;
        this.emailHTML.innerText = this.email;
    }

    loadClickFunction() {
        this.addEventListener("click", (e) => {
            selectedContact = e.currentTarget;
            let contactDetails = document.querySelector("contact-details");
            contactDetails.updateContact();
            loadFocus(this);
            mobileHideContact();
        });
    }

    reload() {
        if (this.name) {
            this.getFirstLetters();
            this.getSortingLetter();
        }
        this.getColor();
        this.loadValues();
        this.loadCSS();
        this.loadHTML();
        this.loadClickFunction();
    }
}

customElements.define("contact-card", Contact);
