const tasks = [];

const taskList = document.querySelector("#task-list");
const todoInput = document.querySelector("#todo-input");
const todoForm = document.querySelector("#todo-form");

function isDuplicateTask(newTitle, excludeIndex = -1) {
	const isDuplicate = tasks.some((task, index) => {
		return (
			task.title.toLowerCase() === newTitle.toLowerCase() &&
			index !== excludeIndex
		);
	});

	return isDuplicate;
}

// const arrLocal = [];

// for (let i = 0; i < localStorage.length; i++) {
// 	arrLocal.push(localStorage.key(i));
// }

// for (let task of arrLocal) {
// 	const parse = JSON.parse(localStorage.getItem(task));

// 	tasks.push(parse);
// }

// console.log(arrLocal);

function handleTaskActions(e) {
	const taskItem = e.target.closest(".task-item");
	const taskIndex = +taskItem.getAttribute("task-index");
	const task = tasks[taskIndex];

	if (e.target.closest(".edit")) {
		let newValue = prompt("Enter the new task title", task.title);

		if (newValue === null) return;

		newValue = newValue.trim();

		if (!newValue) {
			alert(
				"Task title can't empty - please write a new title if you want change"
			);
			return;
		}

		const newTitle = isDuplicateTask(newValue, taskIndex);

		if (newTitle) {
			alert(
				"Task with this title already exists! Please use a different title"
			);
			return;
		}

		task.title = newValue;
		renderTasks();
		return;
	}

	if (e.target.closest(".done")) {
		if (!task.completed) {
			task.completed = true;
			renderTasks();
		} else {
			task.completed = false;
			renderTasks();
		}

		return;
	}

	if (e.target.closest(".delete")) {
		const certainDelete = confirm("Are you sure you deleted that right?");
		if (certainDelete) {
			localStorage.removeItem(arrLocal[taskIndex]);
			tasks.splice(taskIndex, 1);
			renderTasks();
		}
	}
}

function addTask(e) {
	e.preventDefault();

	const value = todoInput.value.trim();

	if (!value) {
		alert("Please write something!");
		return;
	}

	const newTitle = isDuplicateTask(value);

	if (newTitle) {
		alert(
			"Task with this title already exists! Please use a different title"
		);
		todoInput.value = "";
		return;
	}

	tasks.push({
		title: value,
		completed: false,
	});

	tasks.forEach((task, index) => {
		localStorage.setItem(`task${index}`, JSON.stringify(task));
	});

	renderTasks();

	todoInput.value = "";
}

function renderTasks() {
	if (!tasks.length) {
		taskList.innerHTML = `<li class="empty-message">No tasks available</li>`;
		return;
	}

	const html = tasks
		.map((task, index) => {
			return `
		<li class="task-item ${
			task.completed ? "completed" : ""
		}" task-index = "${index}">
			<span class="task-title">${task.title}</span>
			<div class="task-action">
				<button class="task-btn edit">Edit</button>
				<button class="task-btn done">
					${task.completed ? "Mark as undone" : "Mark as done"}
				</button>
				<button class="task-btn delete">Delete</button>
			</div>
		</li>

	`;
		})
		.join("");

	taskList.innerHTML = html;
}

renderTasks();

todoForm.addEventListener("submit", addTask);
taskList.addEventListener("click", handleTaskActions);
