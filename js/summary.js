let loadedTasks = []
let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/**
 * This function calls renderfunctions to show current status of board
 */
async function initSummary() {
    await taskLoader();
    renderOpenTasks()
    renderProgressTasks();
    renderFeedbackTasks();
    renderprioTasks();
    renderTodos();
    renderDoneTasks();
    loadName();
}

/**
 * function to load all tasks in loadedTasks variable
 */
async function taskLoader() {
    let res = await getItem('allTasks');
    loadedTasks = JSON.parse(res);
}

/**
 * this functions renders the finished Tasks which are marked as "done"
 */
function renderDoneTasks() {
    let content = document.querySelector('#done-counter > p');
    let counter = 0;
    for (let i = 0; i < allTasks.length; i++) {
        const element = allTasks[i];
        if (element.status === 'done') {
            counter++;
        }
    }
    content.innerHTML = counter;
}

/**
 * function to render all tasks which are marked as "todo"
 */
function renderTodos() {
    let content = document.querySelector('.direction-all-tasks > .box-design > .counter > p');
    let counter = 0;
    for (let i = 0; i < loadedTasks.length; i++) {
        const element = loadedTasks[i];
        if (element.status === 'todo') {
            counter++;
        }
    }
    content.innerHTML = counter;
}

/**
 * function to render all tasks (amount)
 */
function renderOpenTasks() {
    let openTasks = document.querySelector('#taskSum > p');
    openTasks.innerHTML = getTasksSum();
}

function getTasksSum() {
    let deletedTasks = getDeletedTasks();
    let everyTask = loadedTasks.length;
    let sum = everyTask - deletedTasks;
    return sum;
}

function getDeletedTasks() {
    let delSum = 0;
    for (let i = 0; i < allTasks.length; i++) {
        const task = allTasks[i];
        if (task['status'] === 'deleted') {
            delSum++;
        }
    }
    return delSum;
}

/**
 * function to render all tasks which are waiting for feedback
 */
function renderFeedbackTasks() {
    let feedbackTasks = document.getElementById('feedbackSum');
    let counter = 0;
    for (let i = 0; i < loadedTasks.length; i++) {
        const element = loadedTasks[i]
        if (element.status === 'feedback') {
            counter++;
        }
    }
    ;
    feedbackTasks.innerHTML = `
        <p>${counter}</p>
        <span>Awaiting<br>Feedback</span>
    `;
}

/**
 * function to render all tasks which are marked as "inProgress"
 */
function renderProgressTasks() {
    let progressTasks = document.getElementById('progressSum');
    let counter = 0;
    for (let i = 0; i < allTasks.length; i++) {
        const element = allTasks[i];
        if (element.status === "inProgress") {
            counter++;
        }
    }
    ;
    progressTasks.innerHTML = `
        <p>${counter}</p>
        <span>Tasks in <br> Progress</span>
    `;
}

/**
 * function to render all tasks which are prio "urgent"
 */
function renderprioTasks() {
    let counter = 0;
    let dueDate;
    let content = document.querySelector('.border-urgend-task > p');
    for (let i = 0; i < loadedTasks.length; i++) {
        const element = loadedTasks[i]
        if (element.prio === 'urgent' || element.prio === 'Urgent' && element.status != 'deleted') {
            counter++;
            dueDate = element.dueDate;
        }
    }
    ;
    content.innerText = `${counter}`;
    convertToDateObject(dueDate);

}

/**
 * function to render due date of urgent task
 *
 * @param {number} day - actual day of duedate
 * @param {string} month - actual month of duedate
 * @param {number} year - actual year of duedate
 */
function renderDate(day, month, year) {
    let dueDateBox = document.querySelector('.deadline-task-position > span > b');
    dueDateBox.innerText = `${month} ${day}, ${year}`;
}

/**
 * This functions gets a date object as parameter to read day, month and year to pass (call) it to the rendering function
 *
 * @param {Object} dateObject - to get the needed format for rendering
 */
function formatDate(dateObject) {
    let day = dateObject.getDate();
    let month = months[dateObject.getMonth()];
    let year = dateObject.getFullYear();
    renderDate(day, month, year);
}

/**
 * This function gets a date string from html date input and converts it to a date-object for formatting
 *
 * @param {string} dueDate - date string from date input
 */
function convertToDateObject(dueDate) {
    let date = new Date(dueDate);
    formatDate(date);
}