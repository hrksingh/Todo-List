import { todo } from "./todo";
import { project as projectClass } from "./project";

function storageAvailable(type) {
  let storage;
  try {
    storage = window[type];
    const x = "__storage_test__";
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return (
      e instanceof DOMException &&
      e.name === "QuotaExceededError" &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage &&
      storage.length !== 0
    );
  }
}

function setStorage(projects) {
  if (storageAvailable("localStorage")) {
    localStorage.setItem("projects", JSON.stringify(projects));
  } else {
    // Too bad, no localStorage for us
    alert("unavailable Storage");
  }
}

function getStorage() {
  const AllTasks = [];
  const AllProjects = [];
  let projectList;
  try {
    projectList = JSON.parse(localStorage.getItem("projects"));
  } catch (error) {
    console.log("Error parsing Json");
    return { AllTasks, AllProjects };
  }

  if (projectList) {
    projectList.forEach((project) => {
      Object.setPrototypeOf(project, projectClass.prototype);
      project.tasks.forEach((task) => {
        Object.setPrototypeOf(task, todo.prototype);
        AllTasks.push(task);
      });
      AllProjects.push(project);
    });
  }

  console.log(AllTasks);
  console.log(AllProjects);

  return { AllTasks, AllProjects };
}

export { setStorage, getStorage };
