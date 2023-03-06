'use strict';
// Workshop - TODO list

// declare the variables with which we will work
// let taskId = Math.floor(Math.random() * 100);
const form = document.querySelector('.create-task-form');
const clearBtn = document.querySelector('.clear-tasks');
const taskInput = document.querySelector('.task-input');
const filter = document.querySelector('.filter-input');
const taskList = document.querySelector('.collection');

// event listeners
// run the showTasks function when all HTML is loaded
document.addEventListener('DOMContentLoaded', showTasks);
// run the addTask function when we submit the form (click the "Add Task" button)
form.addEventListener('submit', addTask);
// run the editTask function when the click hits the <ul> list
taskList.addEventListener('click', editTask);
// run the deleteTask function when the click hits the <ul> list
taskList.addEventListener('click', deleteTask);
// run the function after clicking the "Delete all elements" button
clearBtn.addEventListener('click', removeAllTasks);
// run the filterTasks function after releasing the key (when the focus is on the "Search Tasks" input)
filter.addEventListener('keyup', filterTasks);

function showTasks() {
	// Get tasks from local storage
	const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
	// Add tasks to DOM
	tasks.forEach((task) => {
		const listItem = document.createElement('li');
		const listText = document.createTextNode(task.task);
		listItem.appendChild(listText);
		listItem.setAttribute('data-task-id', task.id);
    listItem.classList.add('task');

		const editIcon = document.createElement('button');
		editIcon.innerHTML = '<i class="fas fa-pencil-alt"></i>';
		editIcon.className = 'edit-button';
		listItem.appendChild(editIcon);

		//editIcon.addEventListener('click', editTask);

		const removeButton = document.createElement('button');
		removeButton.innerHTML = 'x';
		removeButton.className = 'remove-task';
		listItem.appendChild(removeButton);

		taskList.appendChild(listItem);
	});
}

// create a task
function addTask(event) {
	event.preventDefault();
	const value = taskInput.value.trim();

	if (value === '') {
		return;
	}

  const taskId = Math.floor(Math.random() * 100);

	const li = document.createElement('li');
	li.setAttribute('data-task-id', taskId);
	li.classList.add('task');
	li.innerHTML = value;

	const editIcon = document.createElement('button');
	editIcon.innerHTML = '<i class="fas fa-pencil-alt"></i>';
	editIcon.className = 'edit-button';
	li.appendChild(editIcon);

	const removeButton = document.createElement('button');
	removeButton.innerHTML = 'x';
	removeButton.className = 'remove-task';
	li.appendChild(removeButton);

	taskList.appendChild(li);

	let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
	const taskObject = {
    id: taskId,
    task: value,
  };
	tasks.push(taskObject);
	localStorage.setItem('tasks', JSON.stringify(tasks));

	taskInput.value = '';
}

function deleteTask(event) {
	// check if the clicked element is a delete button
	if (event.target.classList.contains('remove-task')) {
		// show a confirmation message before deleting the task
		if (window.confirm("Are you sure you want to delete the task?")) {
			// get the task list item that contains the delete button
			const taskItem = event.target.parentElement;
			// get the task ID from the data-task-id attribute
			const taskId = parseInt(taskItem.getAttribute('data-task-id'));

			// remove the task from the DOM
			taskItem.remove();

			// get the tasks array from local storage
			let tasks = JSON.parse(localStorage.getItem('tasks')) || [];


      const newTasks = tasks.filter((item) => item.id !== taskId);
			// // find the index of the task with the specified ID in the tasks array
			// const taskIndex = tasks.findIndex((task) => task.id === taskId);

			// // remove the task from the tasks array
			// tasks.splice(taskIndex, 1);

			// update the tasks in local storage
			localStorage.setItem('tasks', JSON.stringify(newTasks));
		}
	}
}


function editTask(event) {
	const target = event.target.closest('.edit-button');

	if (!target) return;

	const listItem = target.parentElement;
	const taskId = listItem.getAttribute('data-task-id');
	const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

	const task = tasks.find((task) => task.id.toString() === taskId);
	if (!task) return;

	const newName = prompt('Enter a new task', task.task);

	if (!newName) return;

	task.task = newName;

	// update the task in the DOM
	listItem.firstChild.nodeValue = newName;

	// update the task in local storage
	localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateLocalStorage(taskId) {
	let tasks;
	if (localStorage.getItem('tasks') !== null) {
		tasks = JSON.parse(localStorage.getItem('tasks'));
		tasks = tasks.filter(task => task.id !== parseInt(taskId));
		localStorage.setItem('tasks', JSON.stringify(tasks));
	}
}

function removeTaskFromLocalStorage(taskElement) {
	// declare the variable that will be used for the list of tasks
	let tasks;

	// check whether localStorage already has any tasks
	if (localStorage.getItem('tasks') !== null) {
		// if they are there - extract them and assign them to the variable
		tasks = JSON.parse(localStorage.getItem('tasks'));
	} else {
		// if they are not there - assign the variable the value of an empty array
		tasks = []
	}

	// filter the tasks and return those that pass the condition
	const filteredTasks = tasks.filter((task) => {
		if (task !== taskElement.firstChild.textContent) {
			return task
		}
	})

	// launch new tasks in Local Storage
	localStorage.setItem('tasks', JSON.stringify(filteredTasks));
}

// delete all tasks
function removeAllTasks() {
	if (confirm('Are you sure you want to delete all items?')) {
		// delete all content inside the list
		taskList.innerHTML = '';
		// remove all items from Local Storage
		removeAllTaskFromLocalStorage();
	}
}

function removeAllTaskFromLocalStorage() {
	// clean Local Storage
	localStorage.clear()
}

function filterTasks(event) {
	// get all elements of the list
	const itemList = document.querySelectorAll('.task');
	// get the value of the input "Task search" and make it lowercase
	const searchQuery = event.target.value.toLowerCase();

	// we go through each task element
	itemList.forEach((item) => {
		// get the task text
		const itemValue = item.firstChild.textContent.toLowerCase();

		//we check whether the text of the task contains the input value "Search for tasks"
		if (itemValue.includes(searchQuery)) {
			// if it has, then display = list-item
			item.classList.remove('hide');
		} else {
			// if not - hide this list element
			item.classList.add('hide');
		}
	})
}
