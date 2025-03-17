import { todo } from "./todo";
export class project {
  constructor(title) {
    this.title = title;
    this.tasks = [];
  }

  addtoproject(todo) {
    this.tasks.push(todo);
  }

  displayAllTasks() {
    this.tasks.map((element) => console.log(element));
  }
}
