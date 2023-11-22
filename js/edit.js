
/**
 * calls search-functions for every status
 */
function searchTask(id) {
    let search = document.getElementById(id).value;
    search = search.toLowerCase();
    renderSearchTodo(search);
    renderSearchProgress(search);
    renderSearchFeedback(search);
    renderSearchDone(search);
}

function searchTodoTemplate(todoContainer, todoTasks, i) {
    todoContainer.innerHTML += `
            <div class="box-task-design" draggable="true" onclick="openTaskDetails('${todoTasks[i]['task-id']}')" ondragstart="startDragging(${todoTasks[i]['task-id']})" id="taskId${todoTasks[i]["task-id"]}">
                <div class="category ${todoTasks[i].catColor}Cat">
                    <h3>${todoTasks[i].category}</h3>
                </div>
                <div class="task-name">
                    <h4>${todoTasks[i].title}</h4>
                </div>
                <div class="task-description">
                    <span>${todoTasks[i].description}</span>
                </div>
                <div class="progress-bar"></div>
                <div class="worker" id="${todoTasks[i].status}${i}-workers">
                </div>
            </div>
            `;
}

/**
 * searches in todo-status tasks
 * @param {string} search - searched string
 */
function renderSearchTodo(search) {
    let todoContainer = document.getElementById('todo-col');
    let todoTasks = getBoardTasks('todo');
    todoContainer.innerHTML = '';

    for (let i = 0; i < todoTasks.length; i++) {
        let title = todoTasks[i].title;
        let description = todoTasks[i].description;
        if (title.toLowerCase().includes(search) || description.toLowerCase().includes(search)) {
            searchTodoTemplate(todoContainer, todoTasks, i);
            renderBoardAssignings(todoTasks[i], i);
            renderProgressBar(todoTasks[i], todoContainer, i)
        }
    }
}

/**
 * function to close the popup for editing task
 */
function closeWindow() {
    document.getElementById('show-details').classList.add('d-none');
    document.getElementById('edit-task').classList.add('d-none');
}


/**
 * This function sets the status of the task to "deleted" to make it unvisible for the user. Also can be used later to restore tasks.
 * 
 * @param {number} taskID  - delivers task id which is open right now
 */
async function deleteTask(taskID) {
    allTasks[taskID]['status'] = 'deleted';
    await uploadTasks();
    await initBoard();
    closeWindow();
}

function templateRenderSearch(progressContainer, progressTasks, i) {
    progressContainer.innerHTML += `
            <div class="box-task-design" draggable="true" onclick="openTaskDetails('${progressTasks[i]['task-id']}')" ondragstart="startDragging(${progressTasks[i]['task-id']})" id="taskId${progressTasks[i]["task-id"]}">
                <div class="category ${progressTasks[i].catColor}Cat">
                    <h3>${progressTasks[i].category}</h3>
                </div>
                <div class="task-name">
                    <h4>${progressTasks[i].title}</h4>
                </div>
                <div class="task-description">
                    <span>${progressTasks[i].description}</span>
                </div>
                <div class="progress-bar"></div>
                <div class="worker" id="${progressTasks[i].status}${i}-workers">
                </div>
            </div>
            `;
}

/**
 * function to search through  tasks which are in progress (status)
 * 
 * @param {string} search - the string to search in tasks
 */
function renderSearchProgress(search) {
    let progressContainer = document.getElementById('progress-col');
    progressContainer.innerHTML = '';
    let progressTasks = getBoardTasks('inProgress');

    for (let i = 0; i < progressTasks.length; i++) {
        let title = progressTasks[i].title;
        let description = progressTasks[i].description;
        if (title.toLowerCase().includes(search) || description.toLowerCase().includes(search)) {
            templateRenderSearch(progressContainer, progressTasks, i);
            renderBoardAssignings(progressTasks[i], i);
            renderProgressBar(progressTasks[i], progressContainer, i)
        }
    }
}

function templateFeedbackSearch(feedbackContainer, feedbackTasks, i) {
    feedbackContainer.innerHTML += `
            <div class="box-task-design" draggable="true" onclick="openTaskDetails('${feedbackTasks[i]['task-id']}')" ondragstart="startDragging(${feedbackTasks[i]['task-id']})" id="taskId${feedbackTasks[i]["task-id"]}">
                <div class="category ${feedbackTasks[i].catColor}Cat">
                    <h3>${feedbackTasks[i].category}</h3>
                </div>
                <div class="task-name">
                    <h4>${feedbackTasks[i].title}</h4>
                </div>
                <div class="task-description">
                    <span>${feedbackTasks[i].description}</span>
                </div>
                <div class="progress-bar"></div>
                <div class="worker" id="${feedbackTasks[i].status}${i}-workers">
                </div>
            </div>
            `;
}

/**
 * function to search through tasks which are awaiting feedback
 * 
 * @param {string} search - the string to search in tasks
 */
function renderSearchFeedback(search) {
    let feedbackContainer = document.getElementById('feedback-col');
    feedbackContainer.innerHTML = '';
    let feedbackTasks = getBoardTasks('feedback');

    for (let i = 0; i < feedbackTasks.length; i++) {
        let title = feedbackTasks[i].title;
        let description = feedbackTasks[i].description;
        if (title.toLowerCase().includes(search) || description.toLowerCase().includes(search)) {
            templateFeedbackSearch(feedbackContainer, feedbackTasks, i);
            renderBoardAssignings(feedbackTasks[i], i);
            renderProgressBar(feedbackTasks[i], feedbackContainer, i)
        }
    }
}

function templateSearchDone(doneContainer, doneTasks, i) {
    doneContainer.innerHTML += `
            <div class="box-task-design" draggable="true" onclick="openTaskDetails('${doneTasks[i]['task-id']}')" ondragstart="startDragging(${doneTasks[i]['task-id']})" id="taskId${doneTasks[i]["task-id"]}">
                <div class="category ${doneTasks[i].catColor}Cat">
                    <h3>${doneTasks[i].category}</h3>
                </div>
                <div class="task-name">
                    <h4>${doneTasks[i].title}</h4>
                </div>
                <div class="task-description">
                    <span>${doneTasks[i].description}</span>
                </div>
                <div class="progress-bar"></div>
                <div class="worker" id="${doneTasks[i].status}${i}-workers">
                </div>
            </div>
            `;
}

/**
 * function to search through tasks which are done
 * 
 * @param {string} search - the string to search in tasks
 */
function renderSearchDone(search) {
    let doneContainer = document.getElementById('done-col');
    doneContainer.innerHTML = '';
    let doneTasks = getBoardTasks('done');

    for (let i = 0; i < doneTasks.length; i++) {
        let title = doneTasks[i].title;
        let description = doneTasks[i].description;
        if (title.toLowerCase().includes(search) || description.toLowerCase().includes(search)) {
            templateSearchDone(doneContainer, doneTasks, i);
            renderBoardAssignings(doneTasks[i], i);
            renderProgressBar(doneTasks[i], doneContainer, i)
        }
    }
}

function editTaskTemplate(container, task, taskId) {
    container.innerHTML = /*html*/`
        <div class="edit-task">
            <div class="close-btn-container" onclick="closeWindow()">
                <img src="../../assets/img/icons/cross.svg" alt="Close button">
            </div>
            <div class="form-item">
                <label class="lbl-font" for="edit-title">Title:</label>
                <input class="input-design" type="text" id="edit-title" value="${task.title}">
            </div>
            <div class="form-item">
                <label class="lbl-font" for="edit-description">Description:</label>
                <textarea id="edit-description">${task.description}</textarea>
            </div>
            <div class="form-item">
                <label class="lbl-font" for="edit-due-date">Due Date:</label>
                <input class="input-design" type="date" id="edit-due-date" value="${task.dueDate}">
            </div>
            <div class="form-item">Prio</div>
            <div class="prio-buttons">
                <div class="urgent border-color" id="urgent-edit" onclick="updatePrio(${taskId}, 'urgent')">
                    Urgent <span class="prio-img"><img src="../img/icons/urgent-nofill-orange.svg" alt=""></span>
                </div>
                <div class="medium border-color" id="medium-edit" onclick="updatePrio(${taskId}, 'medium')">
                    Medium <span class="prio-img"><img src="../img/icons/medium_nofill_orange.svg" alt=""></span>
                </div>
                <div class="low border-color" id="low-edit" onclick="updatePrio(${taskId}, 'low')">
                    Low <span class="prio-img"><img src="../img/icons/low_nofill_green.svg" alt=""></span>
                </div>
            </div>
            <div class="contact-dropdown mg-dropdown">
                <div class="form-title">Assigned to</div>
                <div class="dropdown-placeholder border-color" id="contacts-input" onclick="toggleEditAssigning(${taskId})">Select contacts to assign<span>&lt;</span></div>
                <input class="inviteContactInput d-none" placeholder="Enter email to invite contact" type="email">
                <div class="inviteContactBtn d-none">
                    <img src="../img/icons/cancel.svg" class="cancel" onclick="cancelInput('contact')">
                    <img src="../img/icons/check_dark.svg" class="check" onclick="sendContactInvite()">
                </div>
                <div class="contacts-selection">
                    <div id="contact-selection" > 
                        <!-- Ab der zweiten div muss aus dem Contacts-Array generiert werden -->
                        <div class="contact-item"><label for="Testkontakt-1">Testkontakt 1<input class="dropdown-check" type="checkbox" id="Testkontakt-1"></label></div>
                        <div class="contact-item"><label for="Testkontakt-2">Testkontakt 2<input class="dropdown-check" type="checkbox" id="Testkontakt-2"></label></div>
                        <div class="contact-item"><label for="Testkontakt-3">Testkontakt 3<input class="dropdown-check" type="checkbox" id="Testkontakt-3"></label></div>
                        <div class="contact-item"><label for="Testkontakt-4">Testkontakt 4<input class="dropdown-check" type="checkbox" id="Testkontakt-4"></label></div>
                        <div class="contact-item" onclick="inviteContactEdit(taskId)">Invite new contact<span><img class="addcontact-li" src="../img/icons/contacts-black.svg"></span></div>
                    </div>
                </div>
                <div class="contact-mobile-edit">${showResponsiveWorker(task)}</div>
            </div>
            <button class="save-btn" onclick="saveEditData('${taskId}', document.getElementById('edit-title').value, document.getElementById('edit-description').value, document.getElementById('edit-due-date').value)">Save
                <img src="../../assets/img/icons/check-icon-white.svg" alt="Save Button">
            </button>
        </div>
    </div>
    <div class="popup-bg" onclick="closeWindow()"></div>
    `;
}

/**
 * this function renders the edit view of tasks
 * 
 * @param {number} taskId  - unique id of task
 */
function editTask(taskId) {
    document.getElementById('show-details').classList.add('d-none');
    document.getElementById('edit-task').classList.remove('d-none');
    let task = allTasks[taskId];
    let container = document.getElementById('edit-task');
    container.innerHTML = '';
    editTaskTemplate(container, task, taskId);
    showPrioStatusEditView(taskId);
}

/**
 * function to show invite-input for new contact. it replaces the placeholder an shows an actual input field
 * 
 * @param {number} taskId - unique id of task
 */
function inviteContactEdit(taskId) {
    toggleEditAssigning(taskId);
    let placeholder = document.getElementById('contacts-input');
    let input = document.querySelector('.inviteContactInput');
    let buttons = document.querySelector('.inviteContactBtn');

    placeholder.classList.add('d-none');
    input.classList.remove('d-none');
    input.classList.add('whundred')
    buttons.classList.remove('d-none');
    input.focus();
}

/**
 * function to render who is the task assigned to
 * 
 * @param {HTMLNode} task - whole task to get to assignings of task
 * @returns html element with all assigned users
 */
function showResponsiveWorker(task) {
    let assignedToHTML = '';
    for (let j = 0; j < task.assignedTo.length; j++) {
        let worker = task.assignedTo[j];
        assignedToHTML += /*html*/ `
        <div class="responsible-worker">
        <img src="../../assets/img/icons/user.svg" alt="User Icon"> 
        <p>${worker}</p></div>
        `;
    }
    return assignedToHTML;
}

/**
 * function to set new prio of task
 * 
 * @param {Number} taskId - unique id of task
 * @param {string} newPrio - can be urgent, medium or low to identify the new priority of task
 */
async function updatePrio(taskId, newPrio) {
    resetPrioEdit();
    let btn = document.querySelector(`#${newPrio}-edit`);
    if (newPrio === 'urgent' || newPrio === 'Urgent') {
        btn.classList.add('activeUrgent');
        btn.classList.add('activePick');
    } else if (newPrio === 'medium' || newPrio === 'Medium') {
        btn.classList.add('activeMedium');
        btn.classList.add('activePick');
    } else if (newPrio === 'low' || newPrio === 'Low') {
        btn.classList.add('activeLow');
        btn.classList.add('activePick');
    }
    const task = allTasks[taskId];
    task['prio'] = newPrio;
    await uploadTasks();
    await initBoard();
}

/**
 * resets the priority of task to empty string to define new one afterwards. works like a radio input
 */
function resetPrioEdit() {
    let urgent = document.querySelector('#urgent-edit');
    let medium = document.querySelector('#medium-edit');
    let low = document.querySelector('#low-edit');
    urgent.classList = 'urgent';
    urgent.classList = 'border-color';
    medium.classList = 'medium';
    medium.classList = 'border-color';
    low.classList = 'low';
    low.classList = 'border-color';
}

/**
 * this function adds classes to the current prio of task to highlight it 
 * 
 * @param {number} taskId - unique id of task
 */
function showPrioStatusEditView(taskId) {
    let task = allTasks.find(task => task['task-id'] == taskId);
    if (task.prio === 'Urgent' || task.prio === 'urgent') {
        document.getElementById('urgent-edit').classList.add('activeUrgent', 'activePick');
    } else if (task.prio === 'Medium' || task.prio === 'medium') {
        document.getElementById('medium-edit').classList.add('activeMedium', 'activePick');
    } else if (task.prio === 'Low' || task.prio === 'low') {
        document.getElementById('low-edit').classList.add('activeLow', 'activePick');
    }
}

/**
 * function to set save the edited task
 * 
 * @param {number} taskId - unique id of task
 * @param {string} editTitle - new title
 * @param {string} editDescription - new detailed desription of task
 * @param {date-string} editDueDate - new  due date
 */
async function saveEditData(taskId, editTitle, editDescription, editDueDate) {
    let task = allTasks[taskId];
    task['title'] = editTitle;
    task['description'] = editDescription;
    task['dueDate'] = editDueDate;
    task['assignedTo'] = getAssignedContacts();
    await uploadTasks();
    await initBoard();
    closeWindow();
}
