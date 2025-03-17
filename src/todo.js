export class todo {
  constructor(title, description, date, priority) {
    this.title = title;
    this.description = description;
    this.date = date;
    this.priority = priority;
    this.completed = false;
  }

  setCompleted(comp) {
    this.completed = comp;
  }

  updateTodo(title, description, date, priority) {
    this.title = title;
    this.description = description;
    this.date = date;
    this.priority = priority;
    console.log("updated");
  }
}
