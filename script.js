const boards = document.querySelectorAll('.board');

boards.forEach(board => {
    const column = board.querySelector('.column');

    column.addEventListener('dragover', e => {
        e.preventDefault();
    });

    column.addEventListener('drop', e => {
        e.preventDefault();
        const draggedElement = document.querySelector('.dragging');
        column.appendChild(draggedElement);
        draggedElement.classList.remove('dragging');
        updateLocalStorage(board); // Update local storage after drop
    });

    const form = column.querySelector('form');

    form.addEventListener('submit', addTask);
    column.addEventListener('click', deleteTask); // Add click event listener for task deletion

    // Load tasks from local storage when the page loads
    loadTasks(column);
});

function addTask(event) {
    event.preventDefault();

    const currentForm = event.target; // current form element
    const value = currentForm.querySelector('input').value.trim(); // value written in form's input

    if (!value) return; // if input is empty, do nothing

    const ticket = createTicket(value); // create new task

    currentForm.parentNode.appendChild(ticket); // add new task to column
    updateLocalStorage(ticket.parentNode.parentNode); // Update local storage after adding task

    currentForm.reset(); // clearing form
}

function createTicket(value) {
    const ticket = document.createElement('div'); // Create a div to contain both text and delete icon
    ticket.classList.add('ticket');

    const text = document.createElement('p'); // Create a paragraph for the task text
    text.textContent = value;
    ticket.appendChild(text);

    const deleteIcon = document.createElement('span'); // Create a span for the delete icon
    deleteIcon.innerHTML = '&#10006;'; // Unicode for '✖' symbol (you can use an actual icon here)
    deleteIcon.classList.add('delete-icon');
    ticket.appendChild(deleteIcon);

    ticket.setAttribute('draggable', true);

    ticket.addEventListener('dragstart', () => {
        ticket.classList.add('dragging');
    });

    ticket.addEventListener('dragend', () => {
        ticket.classList.remove('dragging');
    });

    deleteIcon.addEventListener('click', () => {
        ticket.remove(); // Remove the task element when delete icon is clicked
        updateLocalStorage(ticket.parentNode.parentNode); // Update local storage after deleting task
    });

    return ticket;
}

function deleteTask(event) {
    const clickedElement = event.target;

    if (clickedElement.classList.contains('delete-icon')) {
        const ticket = clickedElement.parentNode;
        ticket.remove(); // Remove the task element if the delete icon is clicked
        updateLocalStorage(ticket.parentNode.parentNode); // Update local storage after deleting task
    }
}

function updateLocalStorage(board) {
    const columns = board.querySelectorAll('.column');
    const tasks = {};

    columns.forEach((column, index) => {
        const columnId = `column-${index}`;
        const columnTasks = Array.from(column.querySelectorAll('.ticket')).map(task => task.textContent);
        tasks[columnId] = columnTasks;
    });

    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks(column) {
    const tasks = JSON.parse(localStorage.getItem('tasks'));

    if (tasks) {
        Object.keys(tasks).forEach(columnId => {
            const columnIndex = parseInt(columnId.split('-')[1]);
            const columnElement = document.querySelectorAll('.column')[columnIndex];

            tasks[columnId].forEach(taskText => {
                const ticket = createTicket(taskText);
                columnElement.appendChild(ticket);
            });
        });
    }
}
