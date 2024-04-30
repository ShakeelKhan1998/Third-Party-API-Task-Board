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

    console.log("Adding task..."); // Check if this function is being called

let title = $('#task-title').val();
let description = $('#task-description').val();
let deadline = $('#task-deadline').val();
console.log(title, description, deadline);

//if (title.trim() != '' && description.trim() != '' && deadline.trim() != '') {
    let newTask = {
        id: generateTaskId(),
        title: title,
        description: description,
        deadline: deadline,
        status: 'not-started' // Initial status
    };

    taskList[newTask.id] = newTask;
    localStorage.setItem("tasks",JSON.stringify(taskList))

    $('#task-modal').css('display', 'none');
    $('#task-form')[0].reset();

    renderTaskList(tasks);                                        //focus on this
// //} else {
//     alert('Please fill in all fields');
//     }
}

// Function to render the task list                         
function renderTaskList() {
    console.log("Rendering task list...");

    $('.tasks').empty();

    for (let taskId in taskList) {
        let task = taskList[taskId];
        let column = $(`#${task.status}-cards`);
        let taskHtml = createTaskCard(task);
        console.log("Task HTML:", taskHtml); // Log the HTML for each task
        console.log("Inserting task into column:", column.attr('id')); // Log the container ID
        column.append(taskHtml);
    }

    $('.task').draggable({
        revert: "invalid",
        stack: ".task"
    });
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){

}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {

}


// When the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
console.log($('#task-form').length);
$(document).ready(function () {
    renderTaskList();

    $('#task-form').on('submit', function(event) {
        handleAddTask(event);
        });

    $('.tasks').droppable({
        drop: handleDrop
    });
    
    $(document).on('click', '.btn-delete', handleDeleteTask);
    
    $('#task-form').submit(handleAddTask);
    
    $('#task-deadline').datepicker();
    
});
