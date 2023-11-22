"use strict";

/**
 * this function initializes/calls needed functions to render page content
 */
async function init() {
    await includeHTML();
    loadLetter();
    loadName();
    initSummary();
}

/**
 *
 * @param modalLink {string}
 * @param page {string}
 * @returns {Promise<void>}
 */
async function switchModal(modalLink, page) {
    const modal = document.querySelector("dialog");
    if (modalLink) {
        modal.setAttribute("w3-include-html", modalLink);
        await includeHTML();
    }
    checkCurrentPage(page);
    if (modal.open) {
        modal.close();
    } else {
        modal.showModal();
    }
    loadOutsideClickForModal();
}

/**
 *
 * @param page {string}
 */
function checkCurrentPage(page) {
    switch (page) {
        case "contact":
            insertContactHTML();
            break;
        case "addtask":
            modalAddtask();
            preventPastDate();
            break;
        case "addTaskInContact":
            modalAddtask();
            insertContactHTML();
            preventPastDate();
            break;
    }
}

function modalAddtask() {
    let addTask = document.querySelector(".taskarea");
    let btn = document.querySelector(".mobile-close");
    if (addTask.classList.contains("modalView")) {
        addTask.classList.remove("modalView");
        btn.classList.add("d-none");
    } else {
        addTask.classList.add("modalView");
        btn.classList.remove("d-none");
    }
}

function loadOutsideClickForModal() {
    let dialog = document.querySelector("dialog");
    dialog.addEventListener("click", (e) => {
        const dialogDimensions = dialog.getBoundingClientRect();
        if (
            e.clientX < dialogDimensions.left ||
            e.clientX > dialogDimensions.right ||
            e.clientY < dialogDimensions.top ||
            e.clientY > dialogDimensions.bottom
        ) {
            dialog.close();
        }
    });
}
