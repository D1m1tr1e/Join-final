/**
 * initilizes whole page
 */
 async function initBoard() {
    await loadAllTasksFromStg();
    renderBoardTodos();
    renderBoardProgress();
    renderBoardFeedback();
    renderBoardDone();
}

/**
 * Generates and appends HTML elements for displaying a task in a board view.
 *
 * @param {HTMLElement} container - The container element to which the task HTML will be appended.
 * @param {Object[]} todos - An array of tasks to be displayed.
 * @param {number} i - The index of the task in the array.
 */
function templateBoardTodos(container, todos, i) {
    container.innerHTML += /*html*/`
        <div class="box-task-design" draggable="true" onclick="openTaskDetails('${todos[i]['task-id']}')" ondragstart="startDragging(${todos[i]['task-id']})" id="taskId${todos[i]["task-id"]}">
            <div class="category-header">  
                <div class="category ${todos[i].catColor}Cat">
                <h3>${todos[i].category}</h3>
            </div>
            <div>
                <img class="move-to-icon" id="move-to-next-section" onclick="moveToSection(event, '${todos[i]['task-id']}', 1)" src="../../assets/img/icons/arrow-down.ico" alt="Move to Icon">
            </div>
        </div>  
        <div class="task-name">
                <h4>${todos[i].title}</h4>
        </div>
        <div class="task-description">
            <span>${todos[i].description}</span>
        </div>
        <div class="progress-bar"></div>
        <div class="worker-prio-bar">
                <div class="worker" id="${todos[i].status}${i}-workers">
                </div>
                <div class="prio-small">${getSmallPrio(todos, i)}</div>
            </div>
        </div>
        `;
}

/**
 * renders all tasks with status 'todo'
 */
function renderBoardTodos() {
    let container = document.getElementById('todo-col');
    if (container != null) {
        container.innerHTML = '';
        let todos = getBoardTasks('todo');
        for (let i = 0; i < todos.length; i++) {
            templateBoardTodos(container, todos, i);
            renderBoardAssignings(todos[i], i);
            renderProgressBar(todos[i], container, i)
        }
    }
}

/**
 * Renders a progress bar for a task with subtasks.
 *
 * @param {Object} todos - The task object containing subtasks.
 * @param {HTMLElement} container - The container element containing the task.
 * @param {number} i - The index of the task in the array.
 */
function renderProgressBar(todos, container, i){
    let task = todos;
    let subtasks = todos.subtasks;
    if (subtasks.length !== 0){
        let taskId = "#taskId" + task["task-id"];
        let progressDiv = container.querySelector(taskId);
        let completedSubtasks = 0;
        subtasks.forEach( subtask =>{
            if (subtask.completed){
                completedSubtasks++;
            }
        })
        let div = progressDiv.querySelector(".progress-bar");
        div.innerHTML = `
            <progress value="${completedSubtasks}" max="${subtasks.length}"></progress>
            ${completedSubtasks} / ${subtasks.length} Done
            `;
    }
}

/**
 * function to render assigned contacts to the task
 * 
 * @param {HTMLNode} task - whole node of the task
 * @param {number} taskID - unique task id
 */
function renderBoardAssignings(task, taskID) {
    let workerbox = document.getElementById(`${task.status}${taskID}-workers`);
    workerbox.innerHTML = ''
    for (let j = 0; j < task.assignedTo.length; j++) { 
        workerbox.innerHTML += `
            <p class="w${j + 1}">${task.assignedTo[j].split(" ").map((n) => n[0]).join("")}</p>
            `
    }
}

/**
 * function to get all subtasks of the task
 * 
 * @param {string} status  - current status of task
 * @returns array with all subtasks
 */
function getBoardTasks(status) {
    let arr = [];
    for (i = 0; i < allTasks.length; i++) {
        if (allTasks[i].status == status) {
            arr.push(allTasks[i])
        }
    }
    if (arr.length < 1) {
        return false;
    } else if (arr.length > 0) {
        return arr;
    }
}

/**
 * Generates and appends HTML elements for displaying a task in a progress view.
 *
 * @param {HTMLElement} container - The container element to which the task HTML will be appended.
 * @param {Object[]} todos - An array of tasks to be displayed.
 * @param {number} i - The index of the task in the array.
 */
function templateBoardProgress(container, todos, i) {
    container.innerHTML += /*html*/`
        <div class="box-task-design" draggable="true" onclick="openTaskDetails('${todos[i]['task-id']}')" ondragstart="startDragging(${todos[i]['task-id']})" id="taskId${todos[i]["task-id"]}">
        <div class="category-header">      
            <div class="category ${todos[i].catColor}Cat">
                <h3>${todos[i].category}</h3>
            </div>
            <div class="arrow-container">
                <img class="move-to-icon" id="move-to-privious-section" onclick="moveToSection(event, '${todos[i]['task-id']}', -1)" src="../../assets/img/icons/arrow-up.ico" alt="Move to Icon">
                <img class="move-to-icon" id="move-to-next-section" onclick="moveToSection(event, '${todos[i]['task-id']}', 1)" src="../../assets/img/icons/arrow-down.ico" alt="Move to Icon">
            </div>
        </div>
            <div class="task-name">
                <h4>${todos[i].title}</h4>
            </div>
            <div class="task-description">
                <span>${todos[i].description}</span>
            </div>
            <div class="progress-bar"></div>
            <div class="worker-prio-bar">
                <div class="worker" id="${todos[i].status}${i}-workers">
                </div>
                <div class="prio-small">${getSmallPrio(todos, i)}</div>
            </div>
            
        </div>
        `;
}

/**
 * Gets the small priority icon based on the priority of a task.
 *
 * @param {Object[]} todos - An array of tasks.
 * @param {number} i - The index of the task in the array.
 */
function getSmallPrio(todos, i) {
    if (todos[i]['prio'] == 'urgent' || todos[i]['prio'] == 'Urgent') {
        return '<img src="../../assets/img/icons/urgent-nofill-orange.svg"></img>';
    } else if (todos[i]['prio'] == 'medium' || todos[i]['prio'] == 'Medium') {
        return '<img src="../../assets/img/icons/medium_nofill_orange.svg"></img>';
    } else if (todos[i]['prio'] == 'low' || todos[i]['prio'] == 'Low') {
        return '<img src="../../assets/img/icons/low_nofill_green.svg"></img>';
    }
}

/**
 * renders all tasks with status 'inProgress'
 */
function renderBoardProgress() {
    let container = document.getElementById('progress-col');
    if (container != null) {
        container.innerHTML = '';
        let todos = getBoardTasks("inProgress");
        for (let i = 0; i < todos.length; i++) {
            templateBoardProgress(container, todos, i);
            renderBoardAssignings(todos[i], i);
            renderProgressBar(todos[i], container, i)
        }
    }
}

function templateRenderFeedback(container, todos, i) {
    container.innerHTML += /*html*/`
        <div class="box-task-design" draggable="true" onclick="openTaskDetails('${todos[i]['task-id']}')" ondragstart="startDragging(${todos[i]['task-id']})" id="taskId${todos[i]["task-id"]}">
        <div class="category-header">
            <div class="category ${todos[i].catColor}Cat">
                <h3>${todos[i].category}</h3>
            </div>
            <div class="arrow-container">
                <img class="move-to-icon" id="move-to-privious-section" onclick="moveToSection(event, '${todos[i]['task-id']}', -1)" src="../../assets/img/icons/arrow-up.ico" alt="Move to Icon">
                <img class="move-to-icon" id="move-to-next-section" onclick="moveToSection(event, '${todos[i]['task-id']}', 1)" src="../../assets/img/icons/arrow-down.ico" alt="Move to Icon">
            </div>
        </div>
            <div class="task-name">
                <h4>${todos[i].title}</h4>
            </div>
            <div class="task-description">
                <span>${todos[i].description}</span>
            </div>
            <div class="progress-bar"></div>
            <div class="worker-prio-bar">
                <div class="worker" id="${todos[i].status}${i}-workers">
                </div>
                <div class="prio-small">${getSmallPrio(todos, i)}</div>
            </div>
        </div>
        `;
}

/**
 * renders all tasks with status 'awaiting feedback'
 */
function renderBoardFeedback() {
    let container = document.getElementById('feedback-col');
    if (container != null) {
        container.innerHTML = '';
        let todos = getBoardTasks('feedback');
        for (let i = 0; i < todos.length; i++) {
            templateRenderFeedback(container, todos, i);
            renderBoardAssignings(todos[i], i);
            renderProgressBar(todos[i], container, i)
        }
    }
}

/**
 * Generates and appends HTML elements for displaying a task in a done view.
 *
 * @param {HTMLElement} container - The container element to which the task HTML will be appended.
 * @param {Object[]} todos - An array of tasks to be displayed.
 * @param {number} i - The index of the task in the array.
 */
function templateBoardDone(container, todos, i) {
    container.innerHTML += /*html*/`
        <div class="box-task-design" draggable="true" onclick="openTaskDetails('${todos[i]['task-id']}')" ondragstart="startDragging(${todos[i]['task-id']})" id="taskId${todos[i]["task-id"]}">
        <div class="category-header">   
            <div class="category ${todos[i].catColor}Cat">
                <h3>${todos[i].category}</h3>
            </div>
            <div class="arrow-container">
                <img class="move-to-icon" id="move-to-privious-section" onclick="moveToSection(event, '${todos[i]['task-id']}', -1)" src="../../assets/img/icons/arrow-up.ico" alt="Move to Icon">
            </div>
        </div>
            <div class="task-name">
                <h4>${todos[i].title}</h4>
            </div>
            <div class="task-description">
                <span>${todos[i].description}</span>
            </div>
            <div class="progress-bar"></div>
            <div class="worker-prio-bar">
                <div class="worker" id="${todos[i].status}${i}-workers">
                </div>
                <div class="prio-small">${getSmallPrio(todos, i)}</div>
            </div>
        </div>
        `;
}

/**
 * renders all tasks with status 'done'
 */
function renderBoardDone() {
    let container = document.getElementById('done-col');
    if (container != null) {
        container.innerHTML = '';
        let todos = getBoardTasks('done');
        for (let i = 0; i < todos.length; i++) {
            templateBoardDone(container, todos, i);
            renderBoardAssignings(todos[i], i);
            renderProgressBar(todos[i], container, i)
        }
    }
}

const statuses = ["todo", "inProgress", "feedback", "done"];

/**
 * Moves a task to the next or previous section within the task board.
 *
 * @param {Event} event - The event object triggering the move.
 * @param {string} id - The ID of the task to be moved.
 * @param {number} moveCount - The number of sections to move the task (positive for moving down, negative for moving up).
 */
async function moveToSection(event, id, moveCount) {
    event.stopPropagation();
    let test = allTasks[id];
    let currentStatusNum = statuses.findIndex(status => test.status === status);
    let nextCategoryNum = currentStatusNum + moveCount;
    let nextCategory = statuses[nextCategoryNum];
    await moveTo(nextCategory, id);
}

let currentDraggedElement;

/**
 * allows to start dragging
 * 
 * @param {number} id - id of task
 */
function startDragging(id) {
    currentDraggedElement = id;
}

/**
 * to allow dropping the dragged item
 * 
 * @param {Event} ev - event of hovering above other html element
 */
function allowDrop(ev) {
    ev.preventDefault();
}

/**
 * function to assign new category to task after moving it with drag n drop
 *
 * @param {string} category - name of new category
 * @param {number} id - with this you can choose if you want to take a certain task. By default, currentDraggedElement is used
 */
async function moveTo(category, id) {
    allTasks[id || currentDraggedElement]['status'] = category;
    await uploadTasks();
    await initBoard();
}

/**
 * highlights the area while hovering above it to show where you can drop items
 * 
 * @param {number} id - id of task
 */
async function highlight(id) {
    document.getElementById(id).classList.add('drag-area-highlight');
}

/**
 * removes highlighting of dropable area after drop
 * 
 * @param {number} id - id of task
 */
async function removeHighlight(id) {
    document.getElementById(id).classList.remove('drag-area-highlight');
}

/**
 * removes display none of popup and calls other function to render content
 * 
 * @param {number} taskId  - task id
 */
function openTaskDetails(taskId) {
    event.stopPropagation();
    document.getElementById('show-details').classList.remove('d-none');
    getAllTaskInfo(taskId);
}

/**
 * Generates and sets HTML elements for displaying detailed information about a task.
 *
 * @param {HTMLElement} container - The container element to which the task information HTML will be set.
 * @param {string} taskId - The ID of the task.
 * @param {Object} task - The task object containing information to be displayed.
 */
function templateTaskInfo(container, taskId, task) {
    container.innerHTML = /*html*/`
        <div class="task-info" id="card-detail">
            <div class="close-btn-container" onclick="closeWindow()">
                <img src="../../assets/img/icons/cross.svg" alt="Close button">
            </div>
            <div class="delete-edit-container">
                <img class="del-btn" src="../../assets/img/icons/delete-btn-bright.svg" alt="Delete button" onclick="deleteTask(${taskId})">
                <img class="edit-btn" src="../../assets/img/icons/edit-btn-dark.svg" alt="Edit button" onclick="editTask(${taskId})">
            </div>
            <div class="category mg-det-view ${task.catColor}Cat">
                <h3>${task.category}</h3>
            </div>    
                <div class="det-title">
                    <h1>${task['title']}</h1>
                </div>
                <div class="text-type">
                    <span>${task['description']}</span>
                </div>
                <div class="text-type">
                    <h2>Due Date:</h2>
                    <span>${task['dueDate']}</span>
                </div> 
                <div class="text-type">
                    <h2>Priority:</h2>
                    <span id="getPrio">${task['prio']}</span>
                </div>
                <div class="text-type">
                    <h2>Subtasks:</h2>
                    <div sub-tasks></div>
                </div>
                <div>
                    <h2>Assigned to:</h2>
                </div>
                <div class="contact-mobile-detail">${showResponsiveWorker(task)}</div>
            </div>
        <div class="popup-bg" onclick="closeWindow()"></div>
        `;
}

/**
 * renders task in detail view
 * 
 * @param {number} taskId  - task id
 */
function getAllTaskInfo(taskId) {
    let container = document.getElementById('show-details');
    container.innerHTML = '';

    const task = allTasks[taskId];
    templateTaskInfo(container, taskId, task);
    prioStatusDetailView(taskId);
    loadSubtasks(task);
}

/**
 * Loads and displays subtasks for a given task.
 *
 * @param {Object} task - The task object for which subtasks will be loaded.
 */
function loadSubtasks(task){
    let subtaskDiv = document.querySelector("[sub-tasks]");
    subtaskDiv.innerHTML = "";
    let isChecked;
    task.subtasks.forEach((subtask, subtaskNum) =>{
        if (subtask.completed){
            isChecked = `checked = "checked"`
        } else {
            isChecked = undefined;
        }
        subtaskDiv.innerHTML += createSubtaskHTML(subtask, isChecked, task, subtaskNum);
    })
}

/**
 * Creates HTML representation for a subtask.
 *
 * @param {Object} subtask - The subtask object.
 * @param {string|undefined} isChecked - The checked attribute for completed subtasks.
 * @param {Object} task - The task object to which the subtask belongs.
 * @param {number} subtaskNum - The index of the subtask in the array.
 * @returns {string} - The HTML representation of the subtask.
 */
function createSubtaskHTML(subtask, isChecked, task, subtaskNum) {
    return `
                <label class="control control-checkbox">
            ${subtask.taskText}
            <input type="checkbox" ${isChecked} onchange="saveCheck(${task['task-id']}, ${subtaskNum})"/>
            <div class="control_indicator"></div>
        </label>
        `;
}

/**
 * Saves the completion status of a subtask and updates the task board.
 *
 * @param {string} taskId - The ID of the task to which the subtask belongs.
 * @param {number} subtaskNum - The index of the subtask in the array.
 * @returns {Promise<void>} - A Promise that resolves when the subtask completion status is saved and the task board is updated.
 */
async function saveCheck(taskId, subtaskNum){
    allTasks[taskId].subtasks[subtaskNum].completed = !allTasks[taskId].subtasks[subtaskNum].completed;
    await uploadTasks();
    await initBoard();
}

/**
 * Fetches the information about the status of the clicked task and displays it in the openTaksDetails view.
 * @param {number} taskId - task id
 */
function prioStatusDetailView(taskId) {
    let task = allTasks[taskId];
    if (task.prio === 'Urgent' || task.prio === 'urgent') {
        document.getElementById('getPrio').innerHTML = /*html*/ `
                    <div class="urgent activeUrgent activePick border-status">
                        Urgent <span class="prio-img"><img src="../img/icons/urgent-nofill-orange.svg" alt=""></span>
                    </div>`;

    } else if (task.prio === 'Medium' || task.prio === 'medium') {
        document.getElementById('getPrio').innerHTML = /*html*/ `
                    <div class="medium activeMedium activePick border-status">
                        Medium <span class="prio-img"><img src="../img/icons/medium_nofill_orange.svg" alt=""></span>
                    </div>`;

    } else if (task.prio === 'Low' || task.prio === 'low') {
        document.getElementById('getPrio').innerHTML = /*html*/ `
                    <div class="low activeLow activePick border-status">
                        Low <span class="prio-img"><img src="../img/icons/low_nofill_green.svg" alt=""></span>
                    </div>`;
    }
}
