
import "./styles.css"
import { format, addDays, differenceInDays, isWeekend } from 'date-fns';
import { todo } from "./todo";
import { project as projectClass } from "./project";
import { setStorage,getStorage } from "./localStorage";

function uiController() {

    const addTask = document.querySelector(".addtask");
    const todoBoard = document.querySelector(".maincontent");
    const cancel = document.querySelector("dialog>form .cancel");
    const dialog = document.querySelector("dialog");
    const titleinput = document.querySelector("dialog form>input");
    const descriptioninput = document.querySelector("dialog form #description")
    const submitNewTask = document.querySelector("form .submit")
    submitNewTask.disabled = true;
    const dateinput = document.querySelector("#date-picker")
    const priorityinput = document.querySelector("dialog form .form-wrapper #priority")
    const project = document.querySelector("dialog form #addtoproject")
    const today = document.querySelector(".sidebar .today")
    const upcomingTasks = document.querySelector(".sidebar .upcoming")
    const addproject = document.querySelector(".sidebar .projects .myprojects")
    const projectDialog = document.getElementById("projectDialog");
    const closeDialog = document.getElementById("closeDialog");
    const projectInput = document.querySelector(".projectInput")
    const projectSubmit = document.querySelector("#submitProject")
    const projectList = document.querySelector(".project-list");

   const {AllTasks,AllProjects}=getStorage();
   let  currentProjectOfTask=""
    let clickedTask=''
    //avoid selecting past dates with date input in dialog
    const todaydate = new Date().toISOString().slice(0, 10);
    dateinput.setAttribute("min", todaydate);

    let taskIndex;
    const personalPresent=AllProjects.findIndex(element=>element.title=="Personal")
    if(personalPresent==-1){
        const defaultProject = new projectClass('Personal');
        let isUpdating = false;
        AllProjects.push(defaultProject)
        setStorage(AllProjects)
    }
    let isUpdating = false;
    DisplayProjects()


    setStorage(AllProjects)

    upcomingTasks.addEventListener('click', () => {
        upcomingTasks.classList.add('active');
        displayAllTasks();
    })
    upcomingTasks.click()

    today.addEventListener('click', () => {
        upcomingTasks.classList.remove('active');
        DisplayTodayTasks()

    })

    function DisplayTodayTasks() {
        todoBoard.innerHTML = ''
        AllTasks.forEach((element, index) => {
            if (element.date === todaydate) {
                createCard(element.title, element.description, element.date, element.priority, element, index);
            }
        })
    }

    const elementsArray = document.querySelectorAll("dialog form>input ,#date-picker,dialog form .form-wrapper #priority")

    //disabling add button if title is empty 
    const validate = () => {
        if (isUpdating === false && document.querySelector("dialog form>input").value == "" || !dateinput.value || priorityinput.value === "labeler") {
            submitNewTask.disabled = true;
        }
        else {
            submitNewTask.disabled = false;
        }
    }
    elementsArray.forEach(element => {
        element.addEventListener("input", validate)
    })

    addproject.addEventListener("click", () => {
        projectDialog.showModal()

    })

    closeDialog.addEventListener('click', () => {
        projectInput.value = ""
        projectDialog.close()
    })

    projectSubmit.addEventListener("click", () => {
        if (!projectInput.value.trim()) {
            projectInput.reportValidity();
        }
        else {

            const copystring = projectInput.value[0].toUpperCase() + projectInput.value.slice(1)
            const newProject = new projectClass(copystring);
            AllProjects.push(newProject)
            closeDialog.click()
            setStorage(AllProjects)
        }
        DisplayProjects();

    })

    function DisplayProjects() {
        projectList.innerHTML = ""
        for (let i = 1; i < project.length; i++) {
            project[i].remove;
        }

        AllProjects.forEach(element => {

            const li = document.createElement("button");
            li.textContent = element.title;
            projectList.appendChild(li);
            if (element.title != 'Personal') {
                project.options[project.options.length] = new Option(`${element.title}`, `${element.title}`)
            }
        })
        const projectButtons = projectList.querySelectorAll("*")
        projectButtons.forEach(element => {
            element.addEventListener("click", (event) => {
                DisplayProjectTasks(event.target.textContent);

            })
        })

    }

    function DisplayProjectTasks(projectTitle) {
        todoBoard.innerHTML = ""
        AllProjects.forEach((project) => {
            if (project.title === projectTitle) {
                project.tasks.forEach((element) => {
                    let index = AllTasks.findIndex(t => t.title === element.title && t.date === element.date)
                    createCard(element.title, element.description, element.date, element.priority, element, index);
                })
            }
        })
        console.log(projectTitle)

        let button=[...projectList.querySelectorAll('button')].find(
            btn=>btn.textContent==projectTitle
        )
        if(button){
            button.focus()
        }

    }

    submitNewTask.addEventListener("click", (e) => {
        e.preventDefault();
        if (isUpdating == false) {

            let index = AllProjects.findIndex(element => element.title === project.value);
            const task = new todo(titleinput.value, descriptioninput.textContent, dateinput.value, priorityinput.value)
            AllProjects[index].addtoproject(task);
            AllTasks.push(task);
            setStorage(AllProjects)
            cancel.click();
            upcomingTasks.click()
            upcomingTasks.focus()
        }
        else if (isUpdating == true && taskIndex != -1) {
            
            if(clickedTask.title==titleinput.value && clickedTask.description==descriptioninput.textContent && clickedTask.date==dateinput.value &&  clickedTask.priority==priorityinput.value &&  currentProjectOfTask==getProjectOfTask(clickedTask)){
                cancel.click()
                return;
            }

            const SelectedprojectIndex = AllProjects.findIndex(element => element.title ===project.value);

            if (SelectedprojectIndex === -1) {
                console.error("Project not found!");
                return;
            }

            const currentProjectIndex = AllProjects.findIndex(proj => proj.tasks.includes(AllTasks[taskIndex]));
            if (currentProjectIndex !== -1 && currentProjectIndex !== SelectedprojectIndex) {
                AllProjects[currentProjectIndex].tasks = AllProjects[currentProjectIndex].tasks.filter(task => task !== AllTasks[taskIndex]);
                AllProjects[SelectedprojectIndex].tasks.push(AllTasks[taskIndex]);
            }
            AllTasks[taskIndex].updateTodo(titleinput.value, descriptioninput.textContent, dateinput.value, priorityinput.value);
            displayAllTasks()
            console.log(AllTasks);
            isUpdating = false;
            setStorage(AllProjects)
            cancel.click();
        }

        else {
            alert('error');
        }
    })

    function displayAllTasks() {
        todoBoard.innerHTML = ''
        AllTasks.forEach((element, index) => {
            createCard(element.title, element.description, element.date, element.priority, element, index);
        })
    }

    function createCard(title, description, date, priority, taskobj, index) {

        const taskCard = document.createElement('div')
        const checkbox = document.createElement("input")
        const titleWrapper = document.createElement("div")
        const editbutton = document.createElement('button')
        const deletebutton = document.createElement('button')
        editbutton.classList.add("edit-button")
        editbutton.innerHTML = "&nbsp";
        deletebutton.classList.add("delete-button")
        let monthNum = ""
        let day = ""
        const parsedDate = new Date(date);
        monthNum = format(parsedDate, 'MMMM');
        day = format(parsedDate, "dd");

        titleWrapper.classList.add("title-wrapper")
        checkbox.type = "checkbox";
        checkbox.value = "completed";
        checkbox.setAttribute('id', 'completed');
        titleWrapper.setAttribute('style', 'gap:5px; display:flex;margin-bottom: 3px;padding:7px 20px;border-bottom: 1px solid #eee; width:100%;')

        taskCard.classList.add("task-card");
        const titleHeading = document.createElement('label')
        editbutton.setAttribute("data-index", `${index}`)
        deletebutton.setAttribute("data-index", `${index}`)
        titleHeading.setAttribute('for', 'completed')
        titleHeading.setAttribute('id', 'heading')
        const descriptionCard = document.createElement('p');
        const dateCard = document.createElement("div");
        dateCard.classList.add("date-display");

        if(taskobj.completed==true){
            console.log("checked")
            checkbox.checked=true;
            titleHeading.setAttribute('style', 'text-decoration: line-through;color:gray')
            dateCard.setAttribute('style', 'color:gray;')
            descriptionCard.setAttribute('style', 'color:gray;')
            editbutton.disabled = true;
            deletebutton.disabled = true;
        }

        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                taskobj.setCompleted(true);
                titleHeading.setAttribute('style', 'text-decoration: line-through;color:gray')
                dateCard.setAttribute('style', 'color:gray;')
                descriptionCard.setAttribute('style', 'color:gray;')
                editbutton.disabled = true;
                deletebutton.disabled = true;
                console.log(taskobj)
                setStorage(AllProjects)
            }
            else {
                taskobj.setCompleted(false);
                titleHeading.setAttribute('style', 'text-decoration: none;color:black')
                dateCard.setAttribute('style', 'color:black;')
                descriptionCard.setAttribute('style', 'color:black;')
                editbutton.disabled = false;
                deletebutton.disabled = false
                setStorage(AllProjects)
            }
        })


        editbutton.addEventListener("click", (event) => {
            taskIndex = event.target.dataset.index;
             clickedTask = AllTasks[taskIndex]

            titleinput.value = clickedTask.title;
            descriptioninput.textContent = clickedTask.description;
            dateinput.value = clickedTask.date;
            priorityinput.value = clickedTask.priority;
            project.value=getProjectOfTask(clickedTask)
            currentProjectOfTask=project.value
            isUpdating = true;
            dialog.showModal();

        })


        deletebutton.addEventListener('click', (event) => {

            let currentProjectTitle;
            taskIndex = event.target.dataset.index;
            const titleTask = AllTasks[taskIndex]
            for (const project of AllProjects) {
                const index = project.tasks.findIndex(task => task.title === titleTask.title)

                if (index != -1) {
                    project.tasks.splice(index, 1)
                    currentProjectTitle = project.title
                    break;
                }

            }
            AllTasks.splice(taskIndex, 1)
            DisplayProjectTasks(currentProjectTitle);
            setStorage(AllProjects)
        })

        if (priority === 'high') {
            taskCard.setAttribute('style', 'border-top:10px solid red;')
        }
        else if (priority === 'medium') {
            taskCard.setAttribute('style', 'border-top:10px solid yellow;')
        }
        else if (priority === 'low') {
            taskCard.setAttribute('style', 'border-top:10px solid green;')
        }

        titleHeading.textContent = title;
        if (date < todaydate) {
            dateCard.setAttribute('style', "color:#db0000;")
        }

        descriptionCard.textContent = description;
        dateCard.textContent = `${day} ${monthNum}`;
        titleWrapper.appendChild(checkbox);
        titleWrapper.appendChild(titleHeading);
        titleWrapper.appendChild(editbutton)
        titleWrapper.appendChild(deletebutton);
        taskCard.appendChild(titleWrapper)
        taskCard.appendChild(descriptionCard)
        taskCard.appendChild(dateCard)
        todoBoard.appendChild(taskCard);
    }


    function getProjectOfTask(task){
        for(const project of AllProjects){
            if(project.tasks.includes(task)){
                return project.title
            }
        }
        return "Personal"

    }

    //sidebar addTask
    addTask.addEventListener("click", () => {
        upcomingTasks.classList.remove('active');
        dialog.showModal();
    })

    //dialog cancel
    cancel.addEventListener("click", (e) => {
        e.preventDefault();
        addTask.blur()
        titleinput.value = "";
        descriptioninput.textContent = "";
        dateinput.value = ""
        priorityinput.value = "labeler"
        dialog.close();
        displayAllTasks()
    });
}

document.addEventListener("DOMContentLoaded", () => {
    uiController();
})