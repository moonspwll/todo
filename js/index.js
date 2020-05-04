const todo = (function () {
  const addTaskButton = document.querySelector(".add-task_button");
  const input = document.querySelector(".task-text");
  const priority = document.querySelector(".priority");
  const taskList = document.querySelector(".task-list");
  const prioritySort = document.querySelector(".priority-sort");
  const dateSort = document.querySelector(".date-sort");
  const tasks = [];
  let toHigh = false;
  let toNew = false;
  return {
    addTask({ date, text, priorityIndex }) {
      localStorage.setItem(
        date,
        JSON.stringify({
          date,
          text,
          priority: priorityIndex
        })
      );
      tasks.push({
        date,
        text,
        priority: priorityIndex
      });
      this.renderTask({
        date,
        text,
        priority: priorityIndex
      });
    },
    priorityName(index) {
      switch (index) {
        case 1:
          return {
            text: "Подождёт до завтра",
            color: "#09B378"
          };
        case 2:
          return {
            text: "Пора бы начинать делать",
            color: "#FB992E"
          };
        case 3:
          return {
            text: "Меня уже пиздят палками",
            color: "#E56C6C"
          };
      }
    },
    setTasks() {
      for (const key in localStorage) {
        if (!localStorage.hasOwnProperty(key)) {
          continue;
        }
        tasks.push(JSON.parse(localStorage.getItem(key)));
      }
      tasks.sort((a, b) => a.date - b.date);
    },
    renderAll() {
      tasks.forEach(({ date, text, priority }) => {
        taskList.insertAdjacentHTML(
          "beforeend",
          `<li data-index=${date} style="background-color: ${
            this.priorityName(priority).color
          }">
						<div class="task">
							<div class="status-line">
								<span class="date">${new Date(date).toLocaleString()}</span>
								<span class="status">${this.priorityName(priority).text}</span>
							</div>
							<div class="text">
								${text}
							</div>
							<div class="actions">
								<button class="finish-task" data-index=${date}>Завершить</button>
							</div>
						</div>
					</li>`
        );
      });
    },
    renderTask({ date, text, priority }) {
      taskList.insertAdjacentHTML(
        "beforeend",
        `<li data-index=${date} style="background-color: ${
          this.priorityName(priority).color
        }">
						<div class="task">
							<div class="status-line">
								<span class="date">"${new Date(date).toLocaleString()}</span>
								<span class="status">${this.priorityName(priority).text}</span>
							</div>
							<div class="text">
								${text}
							</div>
							<div class="actions">
								<button class="finish-task" data-index=${date}>Завершить</button>
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
    }
  };
})();

todo.setTasks();
todo.renderAll();

// remove task

taskList.addEventListener("click", (e) => {
  if (e.target.dataset.index) {
    const deletedElement = document.querySelector(
      `li[data-index=${CSS.escape(e.target.dataset.index)}]`
    );

    deletedElement.style.transform = "translateX(-200%)";
    setTimeout(() => {
      deletedElement.remove();
      todo.deleteTask(e.target.dataset.index);
    }, 300);
  }
});

// add task

addTaskButton.addEventListener("click", (e) => {
  e.preventDefault();
  if (input.value.length > 0 && input.value.trim()) {
    todo.addTask({
      date: new Date().getTime(),
      text: input.value,
      priorityIndex: priority.selectedIndex + 1
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
