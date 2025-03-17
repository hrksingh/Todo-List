//project dialog event listeners
addproject.addEventListener("click", () => {
  projectDialog.showModal();
});
closeDialog.addEventListener("click", () => {
  projectInput.value = "";
  projectDialog.close();
});
projectSubmit.addEventListener("click", () => {
  if (!projectInput.value.trim()) {
    projectInput.reportValidity();
  } else {
    const copystring =
      projectInput.value[0].toUpperCase() + projectInput.value.slice(1);
    console.log(copystring);
    const newProject = new projectClass(copystring);
    AllProjects.push(newProject);
    closeDialog.click();
  }
  DisplayProjects();
});

function DisplayProjects() {
  projectList.innerHTML = "";
  for (let i = 1; i < project.length; i++) {
    project[i].remove;
  }

  AllProjects.forEach((element) => {
    const li = document.createElement("button");
    li.textContent = element.title;
    projectList.appendChild(li);
    if (element.title != "Personal") {
      project.options[project.options.length] = new Option(
        `${element.title}`,
        `${element.title}`
      );
    }
  });
  const projectButtons = projectList.querySelectorAll("*");
  projectButtons.forEach((element) => {
    element.addEventListener("click", (event) => {
      console.log(event.target.textContent);
      DisplayProjectTasks(event.target.textContent);
    });
  });
  console.log(project);
  console.log(projectButtons);
}

function DisplayProjectTasks(projectTitle) {
  AllProjects.forEach((element) => {
    if (element.title == projectTitle) {
      console.log(element);
    }
  });
}
