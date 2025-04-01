const tasks = JSON.parse(localStorage.getItem("tasks")) ?? [];

const taskInput = document.querySelector("#todo-input");
const taskForm = document.querySelector("#todo-form");
const taskList = document.querySelector("#task-list");

function handleTask(e) {
	const taskElement = e.target.closest(".task-item");
	const taskIndex = taskElement.dataset.index;
	const taskItem = tasks[taskIndex];

	if (e.target.closest(".edit")) {
		const newTitle = prompt("Please enter the new title", taskItem.title);
		if (!newTitle) return;

		taskItem.title = newTitle;
		renderTask();
		localStorage.setItem("tasks", JSON.stringify(tasks));
		return;
	}

	if (e.target.closest(".done")) {
		if (!taskItem.completed) {
			taskItem.completed = true;
			renderTask();
			localStorage.setItem("tasks", JSON.stringify(tasks));
		} else {
			taskItem.completed = false;
			renderTask();
			localStorage.setItem("tasks", JSON.stringify(tasks));
		}

		return;
	}

	if (e.target.closest(".delete")) {
		const certainDelete = confirm("Are you sure you want to delete");

		if (certainDelete) {
			tasks.splice(taskIndex, 1);
			renderTask();
			localStorage.setItem("tasks", JSON.stringify(tasks));
		}
	}
}

function duplicate(value) {
	const taskDuplicate = tasks.some((task) => {
		return task.title.toLowerCase() === value.toLowerCase();
	});

	return taskDuplicate;
}

function addTask(e) {
	e.preventDefault();

	const valueTitle = taskInput.value.trim();

	if (!valueTitle) {
		alert("please write the value you want to add");
		return;
	}

	const isDuplicate = duplicate(valueTitle);

	if (isDuplicate) {
		alert("the value was exits-please write the diffrent value ");
		taskInput.value = "";
		return;
	}

	tasks.push({
		title: valueTitle,
		completed: false,
	});

	localStorage.setItem("tasks", JSON.stringify(tasks));

	renderTask();

	taskInput.value = "";
}

function renderTask() {
	const html = tasks
		.map((task, index) => {
			return `
		<li class="task-item ${
			task.completed ? "completed" : ""
		}" data-index = ${index}>
			<span class="task-title">${task.title}</span>
			<div class="task-action">
				<button class="task-btn edit">Edit</button>
				<button class="task-btn done">${
					task.completed ? "Mask as undone" : "Mark as done"
				}</button>
				<button class="task-btn delete">Delete</button>
			</div>
		</li>
`;
		})
		.join("");

	taskList.innerHTML = html;
}

renderTask();

taskList.addEventListener("click", handleTask);
taskForm.addEventListener("submit", addTask);
