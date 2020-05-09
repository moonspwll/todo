const storage = (function () {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    return {
        serializedTasks() {
            return JSON.stringify(tasks);
        },
        setToLocalStorage() {
            localStorage.setItem("tasks", this.serializedTasks());
        },
        getTasks() {
            return tasks;
        },
        newTask(task) {
            if (task) {
                tasks.push(task);
                this.setToLocalStorage();
            }
        },
        deleteTask(date) {
            tasks = tasks.filter((task) => { 
                return task.date !== date 
            });
            console.log(tasks)
            this.setToLocalStorage();
            // console.log(localStorage.tasks);
        },
    };
})();

const todo = (function () {
    const addTaskButton = document.querySelector(".add-task_button");
    const input = document.querySelector(".task-text");
    const prioritySelect = document.querySelector(".priority");
    const taskList = document.querySelector(".task-list");
    const prioritySort = document.querySelector(".priority-sort");
    const dateSort = document.querySelector(".date-sort");
    let tasks = storage.getTasks() || [];
    let toHigh = false;
    let toNew = false;

    // remove task

    taskList.addEventListener("click", (e) => {
        if (e.target.dataset.date) {
            const deletedElement = document.querySelector(
                `li[data-date=${CSS.escape(e.target.dataset.date)}]`
            );

            deletedElement.style.transform = "translateX(-200%)";
            setTimeout(() => {
                deletedElement.remove();
                storage.deleteTask(e.target.dataset.date);
            }, 300);
        }
    });

    // add task

    addTaskButton.addEventListener("click", (e) => {
        e.preventDefault();
        if (input.value.trim()) {
            todo.addTask({
                date: new Date().getTime(),
                text: input.value,
                priorityIndex: prioritySelect.selectedIndex + 1,
            });
            input.value = "";
        }
    });

    // add task "enter"

    input.addEventListener("keyup", (e) => {
        if (e.keyCode === 13) {
            addTaskButton.click();
        }
    });

    // priority sort

    prioritySort.addEventListener("click", () => {
        todo.prioritySort();
    });

    // date sort

    dateSort.addEventListener("click", () => {
        todo.dateSort();
    });

    return {
        addTask(task) {
            storage.newTask(task);
            this.renderTask(task);
        },
        priorityName(index) {
            const PRIORITY_LOW = 1;
            const PRIORITY_MID = 2;
            const PRIORITY_HIGH = 3;
            const priorities = {
                [PRIORITY_LOW]: {
                    text: "Подождёт до завтра",
                    color: "#09B378",
                },
                [PRIORITY_MID]: {
                    text: "Пора бы начинать делать",
                    color: "#FB992E",
                },
                [PRIORITY_HIGH]: {
                    text: "Меня уже пиздят палками",
                    color: "#E56C6C",
                },
            };
            return priorities[index] || priorities[PRIORITY_MID];
        },
        renderAll() {
            tasks.forEach((task) => {
                return this.renderTask(task);
            });
        },
        renderTask({ date, text, priorityIndex }) {
            taskList.insertAdjacentHTML(
                "beforeend",
                `<li data-date=${date} style="background-color: ${
                    this.priorityName(priorityIndex).color
                }">
					<div class="task">
                        <div class="status-line">
                            <span class="date">"
                                ${new Date(date).toLocaleString()}
                            </span>
                            <span class="status">
                                ${this.priorityName(priority).text}
                            </span>
                        </div>
                        <div class="text">
                            ${text}
                        </div>
                        <div class="actions">
                            <button class="finish-task" data-date=${date}>Завершить</button>
                        </div>
                    </div>
			    </li>`
            );
        },
        deleteTask(id) {
            let i;
            tasks.forEach((element, index) => {
                if (element.date === id) {
                    i = index;
                }
            });
            tasks.splice(i, 1);
            localStorage.removeItem(id);
        },
        prioritySort() {
            taskList.innerHTML = "";
            if (toHigh) {
                tasks.sort((a, b) => a.priority - b.priority);
                toHigh = false;
            } else {
                tasks.sort((a, b) => b.priority - a.priority);
                toHigh = true;
            }
            this.renderAll();
        },
        dateSort() {
            taskList.innerHTML = "";
            if (toNew) {
                tasks.sort((a, b) => a.date - b.date);
                toNew = false;
            } else {
                tasks.sort((a, b) => b.date - a.date);
                toNew = true;
            }
            this.renderAll();
        },
        getTasks() {
            return tasks;
        },
    };
})();

// todo.setTasks();
todo.renderAll();
