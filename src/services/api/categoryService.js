import categoryData from '../mockData/categories.json';
import taskService from './taskService';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class CategoryService {
  constructor() {
    this.categories = [...categoryData];
  }

  async getAll() {
    await delay(200);
    // Update task counts dynamically
    const tasks = await taskService.getAll();
    
    return this.categories.map(category => ({
      ...category,
      taskCount: tasks.filter(t => t.category === category.name).length
    }));
  }

  async getById(id) {
    await delay(200);
    const category = this.categories.find(c => c.id === id);
    if (!category) return null;

    const tasks = await taskService.getAll();
    return {
      ...category,
      taskCount: tasks.filter(t => t.category === category.name).length
    };
  }

  async create(categoryData) {
    await delay(300);
    const newCategory = {
      id: Date.now().toString(),
      ...categoryData,
      taskCount: 0
    };
    this.categories.push(newCategory);
    return { ...newCategory };
  }

  async update(id, updateData) {
    await delay(300);
    const index = this.categories.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Category not found');
    
    this.categories[index] = { ...this.categories[index], ...updateData };
    
    const tasks = await taskService.getAll();
    return {
      ...this.categories[index],
      taskCount: tasks.filter(t => t.category === this.categories[index].name).length
    };
  }

  async delete(id) {
    await delay(300);
    const index = this.categories.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Category not found');
    
    const deletedCategory = this.categories.splice(index, 1)[0];
    return { ...deletedCategory };
  }
}

export default new CategoryService();