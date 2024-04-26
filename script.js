// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || {};
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

// Function to generate a unique task id
function generateTaskId() {
    return nextId++;
}

// Function to create a task card
function createTaskCard(task) {
    return `
        <div class="task" id="task-${task.id}">
            <h3>${task.title}</h3>
            <p>${task.description}</p>
            <p><strong>Deadline:</strong> ${task.deadline}</p>
            <button class="btn-delete" data-task-id="${task.id}">Delete</button>
        </div>
    `;
}

// Function to render the task list and make cards draggable
function renderTaskList() {
    $('.tasks').empty();

    for (let taskId in taskList) {
        let task = taskList[taskId];
        let column = $(`#${task.status}-tasks`);
        column.append(createTaskCard(task));
    }

    $('.task').draggable({
        revert: "invalid",
        stack: ".task"
    });
}

// Function to handle adding a new task
function handleAddTask(event) {
    event.preventDefault();

    let title = $('#task-title').val();
    let description = $('#task-description').val();
    let deadline = $('#task-deadline').val();

    if (title.trim() !== '' && description.trim() !== '' && deadline.trim() !== '') {
        let newTask = {
            id: generateTaskId(),
            title: title,
            description: description,
            deadline: deadline,
            status: 'not-started' // Initial status
        };

        taskList[newTask.id] = newTask;
        saveTasks();

        $('#task-modal').css('display', 'none');
        $('#task-form')[0].reset();

        renderTaskList();
    } else {
        alert('Please fill in all fields');
    }
}

// Function to handle deleting a task
function handleDeleteTask(event) {
    let taskId = $(this).data('task-id');
    delete taskList[taskId];
    saveTasks();
    renderTaskList();
}

// Function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    let taskId = ui.draggable.attr('id').split('-')[1];
    let newStatus = $(this).attr('id').split('-')[0];
    taskList[taskId].status = newStatus;
    saveTasks();
}

// Function to save tasks and nextId to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(taskList));
    localStorage.setItem('nextId', JSON.stringify(nextId));
}

// When the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList();

    $('.tasks').droppable({
        drop: handleDrop
    });

    $(document).on('click', '.btn-delete', handleDeleteTask);

    $('#task-form').submit(handleAddTask);

    $('#task-deadline').datepicker();
});
