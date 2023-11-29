/**
 * This function is for usage of html-templates. it fetches the needed template and places it in main.html
 */
async function includeHTML() {
    let includeElements = document.querySelectorAll("[w3-include-html]");
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html");
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = "Page not found";
        }
    }
}

/**
 * This functions calls different functions in every instance and prevents calling wrong function 
 *
 * @param {string} link relative path to the page to load
 */
async function changeContentHTML(link) {
    document.getElementById("content").setAttribute("w3-include-html", link);
    if (link === '../templates/summary.html') {
        await includeHTML();
        await initSummary();
    } else if (link.includes('../templates/board.html')) {
        await includeHTML();
        await initBoard();
    } else if (link.includes('../templates/add_task.html')) {
        await includeHTML();
        preventPastDate();
    } else if (link.includes('../templates/contacts.html')) {
        await includeHTML();
        await updateContacts();
    } else if (link.includes('../templates/legal_notice.html')) {
        await includeHTML();
    } else if (link.includes('../templates/privacy_policy.html')) {
        await includeHTML();
    } else {
        await init();
    }
}
