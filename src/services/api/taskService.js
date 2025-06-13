import { toast } from 'react-toastify';

class TaskService {
  constructor() {
    this.apperClient = null;
    this.initClient();
  }

  initClient() {
    if (typeof window !== 'undefined' && window.ApperSDK) {
      const { ApperClient } = window.ApperSDK;
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
    }
  }

  async getAll() {
    try {
      if (!this.apperClient) this.initClient();
      
      const params = {
        Fields: ['Id', 'title', 'category', 'priority', 'due_date', 'completed', 'created_at', 'notes'],
        orderBy: [
          { FieldName: 'completed', SortType: 'ASC' },
          { FieldName: 'due_date', SortType: 'ASC' },
          { FieldName: 'created_at', SortType: 'DESC' }
        ]
      };
      
      const response = await this.apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return (response.data || []).map(task => ({
        id: task.Id,
        title: task.title,
        category: task.category,
        priority: task.priority,
        dueDate: task.due_date,
        completed: task.completed,
        createdAt: task.created_at,
        notes: task.notes
      }));
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return [];
    }
  }

  async getById(id) {
    try {
      if (!this.apperClient) this.initClient();
      
      const params = {
        fields: ['Id', 'title', 'category', 'priority', 'due_date', 'completed', 'created_at', 'notes']
      };
      
      const response = await this.apperClient.getRecordById('task', id, params);
      
      if (!response || !response.data) {
        return null;
      }
      
      const task = response.data;
      return {
        id: task.Id,
        title: task.title,
        category: task.category,
        priority: task.priority,
        dueDate: task.due_date,
        completed: task.completed,
        createdAt: task.created_at,
        notes: task.notes
      };
    } catch (error) {
      console.error(`Error fetching task with ID ${id}:`, error);
      return null;
    }
  }

  async getByCategory(category) {
    try {
      if (!this.apperClient) this.initClient();
      
      const params = {
        Fields: ['Id', 'title', 'category', 'priority', 'due_date', 'completed', 'created_at', 'notes'],
        where: [
          {
            FieldName: 'category',
            Operator: 'ExactMatch',
            Values: [category]
          }
        ]
      };
      
      const response = await this.apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return (response.data || []).map(task => ({
        id: task.Id,
        title: task.title,
        category: task.category,
        priority: task.priority,
        dueDate: task.due_date,
        completed: task.completed,
        createdAt: task.created_at,
        notes: task.notes
      }));
    } catch (error) {
      console.error('Error fetching tasks by category:', error);
      return [];
    }
  }

  async getByStatus(completed) {
    try {
      if (!this.apperClient) this.initClient();
      
      const params = {
        Fields: ['Id', 'title', 'category', 'priority', 'due_date', 'completed', 'created_at', 'notes'],
        where: [
          {
            FieldName: 'completed',
            Operator: 'ExactMatch',
            Values: [completed]
          }
        ]
      };
      
      const response = await this.apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return (response.data || []).map(task => ({
        id: task.Id,
        title: task.title,
        category: task.category,
        priority: task.priority,
        dueDate: task.due_date,
        completed: task.completed,
        createdAt: task.created_at,
        notes: task.notes
      }));
    } catch (error) {
      console.error('Error fetching tasks by status:', error);
      return [];
    }
  }

  async search(query) {
    try {
      if (!this.apperClient) this.initClient();
      
      const params = {
        Fields: ['Id', 'title', 'category', 'priority', 'due_date', 'completed', 'created_at', 'notes'],
        where: [
          {
            FieldName: 'title',
            Operator: 'Contains',
            Values: [query]
          }
        ]
      };
      
      const response = await this.apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return (response.data || []).map(task => ({
        id: task.Id,
        title: task.title,
        category: task.category,
        priority: task.priority,
        dueDate: task.due_date,
        completed: task.completed,
        createdAt: task.created_at,
        notes: task.notes
      }));
    } catch (error) {
      console.error('Error searching tasks:', error);
      return [];
    }
  }

  async create(taskData) {
    try {
      if (!this.apperClient) this.initClient();
      
      const params = {
        records: [
          {
            title: taskData.title,
            category: taskData.category,
            priority: taskData.priority,
            due_date: taskData.dueDate || null,
            completed: false,
            created_at: new Date().toISOString(),
            notes: taskData.notes || ''
          }
        ]
      };
      
      const response = await this.apperClient.createRecord('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create task:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const task = successfulRecords[0].data;
          return {
            id: task.Id,
            title: task.title,
            category: task.category,
            priority: task.priority,
            dueDate: task.due_date,
            completed: task.completed,
            createdAt: task.created_at,
            notes: task.notes
          };
        }
      }
      
      throw new Error('Failed to create task');
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  async update(id, updateData) {
    try {
      if (!this.apperClient) this.initClient();
      
      const params = {
        records: [
          {
            Id: parseInt(id),
            ...updateData,
            due_date: updateData.dueDate !== undefined ? updateData.dueDate : undefined,
            created_at: updateData.createdAt !== undefined ? updateData.createdAt : undefined
          }
        ]
      };
      
      // Remove undefined fields
      Object.keys(params.records[0]).forEach(key => {
        if (params.records[0][key] === undefined) {
          delete params.records[0][key];
        }
      });
      
      const response = await this.apperClient.updateRecord('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update task:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const task = successfulRecords[0].data;
          return {
            id: task.Id,
            title: task.title,
            category: task.category,
            priority: task.priority,
            dueDate: task.due_date,
            completed: task.completed,
            createdAt: task.created_at,
            notes: task.notes
          };
        }
      }
      
      throw new Error('Failed to update task');
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }

  async delete(id) {
    try {
      if (!this.apperClient) this.initClient();
      
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await this.apperClient.deleteRecord('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete task:${JSON.stringify(failedDeletions)}`);
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error('Failed to delete task');
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }

  async bulkUpdate(ids, updateData) {
    try {
      if (!this.apperClient) this.initClient();
      
      const records = ids.map(id => ({
        Id: parseInt(id),
        ...updateData
      }));
      
      const params = { records };
      
      const response = await this.apperClient.updateRecord('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} tasks:${JSON.stringify(failedRecords)}`);
        }
        
        return successfulRecords.map(result => ({
          id: result.data.Id,
          title: result.data.title,
          category: result.data.category,
          priority: result.data.priority,
          dueDate: result.data.due_date,
          completed: result.data.completed,
          createdAt: result.data.created_at,
          notes: result.data.notes
        }));
      }
      
      return [];
    } catch (error) {
      console.error('Error bulk updating tasks:', error);
      return [];
    }
  }

  async bulkDelete(ids) {
    try {
      if (!this.apperClient) this.initClient();
      
      const params = {
        RecordIds: ids.map(id => parseInt(id))
      };
      
      const response = await this.apperClient.deleteRecord('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} tasks:${JSON.stringify(failedDeletions)}`);
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error bulk deleting tasks:', error);
      return false;
    }
  }

  async getOverdue() {
    try {
      if (!this.apperClient) this.initClient();
      
      const now = new Date().toISOString();
      const params = {
        Fields: ['Id', 'title', 'category', 'priority', 'due_date', 'completed', 'created_at', 'notes'],
        where: [
          {
            FieldName: 'completed',
            Operator: 'ExactMatch',
            Values: [false]
          },
          {
            FieldName: 'due_date',
            Operator: 'LessThan',
            Values: [now]
          }
        ]
      };
      
      const response = await this.apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return (response.data || []).map(task => ({
        id: task.Id,
        title: task.title,
        category: task.category,
        priority: task.priority,
        dueDate: task.due_date,
        completed: task.completed,
        createdAt: task.created_at,
        notes: task.notes
      }));
    } catch (error) {
      console.error('Error fetching overdue tasks:', error);
      return [];
    }
  }
}

export default new TaskService();