function addTask() {
    const inputField = document.getElementById('inputTask');
    const taskText = inputField.value.trim();

    if (taskText === "") {
        alert("Please enter a task!");
        return;
    }

    const newTask = document.createElement('li');
    const tasklist = document.getElementById('tasklist');
    newTask.textContent = taskText;
    
   
    deleteTask(newTask);

  
    tasklist.appendChild(newTask);

    
    inputField.value = "";
}

function deleteTask(newTask) {
    const deleteBtn = document.createElement('button'); 
    deleteBtn.textContent = "Delete";
    deleteBtn.style.marginLeft = "10px";
    deleteBtn.style.background = "red";
    deleteBtn.style.color = "white";
    deleteBtn.style.border = "none";
    deleteBtn.style.padding = "5px";
    deleteBtn.style.borderRadius = "5px";
    deleteBtn.style.cursor = "pointer";

    newTask.appendChild(deleteBtn);

    deleteBtn.onclick = function () {
        newTask.remove();
    };
}


document.getElementById("inputTask").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        addTask();
    }
});
