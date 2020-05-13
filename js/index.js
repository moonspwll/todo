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
                return task.date !== Number(date);
            });
            this.setToLocalStorage();
            return tasks;
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
    let tasks = storage.getTasks();
    let tasksWithTemplate = [];
    let toHigh = false;
    let toNew = true;

    // remove task

    taskList.addEventListener("click", (e) => {
        if (e.target.dataset.date) {
            const deletedElement = document.querySelector(`li[data-date=${CSS.escape(e.target.dataset.date)}]`);
            deletedElement.style.transform = "scale(0)";
            tasks = storage.deleteTask(e.target.dataset.date);
            console.log(tasks)
            setTimeout(() => {
                deletedElement.remove();
            }, 250);
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
                    color: "#d3c279",
                },
                [PRIORITY_MID]: {
                    text: "Пора бы начинать делать",
                    color: "#ee9459",
                },
                [PRIORITY_HIGH]: {
                    text: "Меня уже пиздят палками",
                    color: "#e44646",
                },
            };
            return priorities[index] || priorities[PRIORITY_MID];
        },
        useTemplate() {
            tasksWithTemplate = [];
            
            return tasks.forEach((task) => {
                tasksWithTemplate.push(this.template(task));
            });
        },
        renderAll() {
            this.useTemplate();

            let content = "";

            tasksWithTemplate.forEach((task) => {
                content += task;
            });
            console.log(content)
            taskList.insertAdjacentHTML("beforeend", content);
        },
        template({ date, text, priorityIndex }) {
            return `<li data-date=${date} style="background-color: ${this.priorityName(priorityIndex).color}">
                <div class="task">
                    <div class="status-line">
                        <span class="date">
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
            </li>`;
        },
        renderTask(task) {
            taskList.insertAdjacentHTML("beforeend", this.template(task));
        },
        prioritySort() {
            taskList.innerHTML = "";
            if (toHigh) {
                tasks.sort((a, b) => a.priorityIndex - b.priorityIndex);
                toHigh = false;
            } else {
                tasks.sort((a, b) => b.priorityIndex - a.priorityIndex);
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
todo.renderAll();
