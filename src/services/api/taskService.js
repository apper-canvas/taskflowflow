import taskData from '../mockData/tasks.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class TaskService {
  constructor() {
    this.tasks = [...taskData];
  }

  async getAll() {
    await delay(300);
    return [...this.tasks];
  }

  async getById(id) {
    await delay(200);
    const task = this.tasks.find(t => t.id === id);
    return task ? { ...task } : null;
  }

  async getByCategory(category) {
    await delay(250);
    return this.tasks.filter(t => t.category === category).map(t => ({ ...t }));
  }

  async getByStatus(completed) {
    await delay(250);
    return this.tasks.filter(t => t.completed === completed).map(t => ({ ...t }));
  }

  async search(query) {
    await delay(200);
    const searchTerm = query.toLowerCase();
    return this.tasks
      .filter(t => 
        t.title.toLowerCase().includes(searchTerm) ||
        t.notes.toLowerCase().includes(searchTerm)
      )
      .map(t => ({ ...t }));
  }

  async create(taskData) {
    await delay(300);
    const newTask = {
      id: Date.now().toString(),
      ...taskData,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    this.tasks.push(newTask);
    return { ...newTask };
  }

  async update(id, updateData) {
    await delay(300);
    const index = this.tasks.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Task not found');
    
    this.tasks[index] = { ...this.tasks[index], ...updateData };
    return { ...this.tasks[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.tasks.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Task not found');
    
    const deletedTask = this.tasks.splice(index, 1)[0];
    return { ...deletedTask };
  }

  async bulkUpdate(ids, updateData) {
    await delay(400);
    const updatedTasks = [];
    
    for (const id of ids) {
      const index = this.tasks.findIndex(t => t.id === id);
      if (index !== -1) {
        this.tasks[index] = { ...this.tasks[index], ...updateData };
        updatedTasks.push({ ...this.tasks[index] });
      }
    }
    
    return updatedTasks;
  }

  async bulkDelete(ids) {
    await delay(400);
    const deletedTasks = [];
    
    for (const id of ids) {
      const index = this.tasks.findIndex(t => t.id === id);
      if (index !== -1) {
        deletedTasks.push({ ...this.tasks[index] });
        this.tasks.splice(index, 1);
      }
    }
    
    return deletedTasks;
  }

  async getOverdue() {
    await delay(250);
    const now = new Date();
    return this.tasks
      .filter(t => !t.completed && t.dueDate && new Date(t.dueDate) < now)
      .map(t => ({ ...t }));
  }
}

export default new TaskService();