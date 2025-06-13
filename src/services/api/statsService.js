import taskService from './taskService';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class StatsService {
  async getOverallStats() {
    await delay(250);
const tasks = await taskService.getAll();
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Today's stats
    const todayTasks = tasks.filter(t => {
      const taskDate = new Date(t.createdAt || t.created_at);
      return taskDate >= today;
    });
    const todayCompleted = todayTasks.filter(t => t.completed).length;

    // Weekly stats
const weekTasks = tasks.filter(t => {
      const taskDate = new Date(t.createdAt || t.created_at);
      return taskDate >= weekAgo;
    });
    const weekCompleted = weekTasks.filter(t => t.completed).length;

    // Calculate streak
    let currentStreak = 0;
    let checkDate = new Date(today);
    
    for (let i = 0; i < 30; i++) { // Check last 30 days
      const dayTasks = tasks.filter(t => {
        const taskDate = new Date(t.createdAt || t.created_at);
        return taskDate.toDateString() === checkDate.toDateString();
      });
      
      const dayCompleted = dayTasks.filter(t => t.completed).length;
      
      if (dayCompleted > 0) {
        currentStreak++;
      } else if (i > 0) { // Don't break on today if no tasks
        break;
      }
      
      checkDate.setDate(checkDate.getDate() - 1);
    }

    return {
      todayCompleted,
      todayTotal: todayTasks.length,
      weekCompleted,
      weekTotal: weekTasks.length,
      currentStreak,
      totalTasks: tasks.length,
      completedTasks: tasks.filter(t => t.completed).length,
overdueTasks: tasks.filter(t => {
        return !t.completed && (t.dueDate || t.due_date) && new Date(t.dueDate || t.due_date) < now;
      }).length
    };
  }

  async getCategoryStats() {
    await delay(200);
    const tasks = await taskService.getAll();
    const categories = {};

    tasks.forEach(task => {
      if (!categories[task.category]) {
        categories[task.category] = {
          total: 0,
          completed: 0,
          pending: 0
        };
      }
      
      categories[task.category].total++;
      if (task.completed) {
        categories[task.category].completed++;
      } else {
        categories[task.category].pending++;
      }
    });

    return categories;
  }

  async getPriorityStats() {
    await delay(200);
    const tasks = await taskService.getAll();
    const priorities = {
      high: { total: 0, completed: 0 },
      medium: { total: 0, completed: 0 },
      low: { total: 0, completed: 0 }
    };

    tasks.forEach(task => {
      const priority = task.priority.toLowerCase();
      if (priorities[priority]) {
        priorities[priority].total++;
        if (task.completed) {
          priorities[priority].completed++;
        }
      }
    });

    return priorities;
  }
}

export default new StatsService();