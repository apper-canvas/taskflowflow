import { toast } from 'react-toastify';

class CategoryService {
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
        Fields: ['Id', 'Name', 'color', 'task_count']
      };
      
      const response = await this.apperClient.fetchRecords('category', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      // Get task counts dynamically
      const taskCountsResponse = await this.apperClient.fetchRecords('task', {
        Fields: ['category'],
        groupBy: ['category']
      });
      
      const taskCounts = {};
      if (taskCountsResponse.success && taskCountsResponse.data) {
        taskCountsResponse.data.forEach(item => {
          taskCounts[item.category] = item.count || 0;
        });
      }
      
      return (response.data || []).map(category => ({
        id: category.Id,
        name: category.Name,
        color: category.color,
        taskCount: taskCounts[category.Name] || 0
      }));
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }

  async getById(id) {
    try {
      if (!this.apperClient) this.initClient();
      
      const params = {
        fields: ['Id', 'Name', 'color', 'task_count']
      };
      
      const response = await this.apperClient.getRecordById('category', id, params);
      
      if (!response || !response.data) {
        return null;
      }
      
      const category = response.data;
      
      // Get task count for this category
      const taskCountResponse = await this.apperClient.fetchRecords('task', {
        Fields: ['Id'],
        where: [
          {
            FieldName: 'category',
            Operator: 'ExactMatch',
            Values: [category.Name]
          }
        ]
      });
      
      const taskCount = taskCountResponse.success ? (taskCountResponse.data || []).length : 0;
      
      return {
        id: category.Id,
        name: category.Name,
        color: category.color,
        taskCount: taskCount
      };
    } catch (error) {
      console.error(`Error fetching category with ID ${id}:`, error);
      return null;
    }
  }

  async create(categoryData) {
    try {
      if (!this.apperClient) this.initClient();
      
      const params = {
        records: [
          {
            Name: categoryData.name,
            color: categoryData.color,
            task_count: 0
          }
        ]
      };
      
      const response = await this.apperClient.createRecord('category', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create category:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const category = successfulRecords[0].data;
          return {
            id: category.Id,
            name: category.Name,
            color: category.color,
            taskCount: 0
          };
        }
      }
      
      throw new Error('Failed to create category');
    } catch (error) {
      console.error('Error creating category:', error);
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
            Name: updateData.name,
            color: updateData.color
          }
        ]
      };
      
      const response = await this.apperClient.updateRecord('category', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update category:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const category = successfulRecords[0].data;
          
          // Get updated task count
          const taskCountResponse = await this.apperClient.fetchRecords('task', {
            Fields: ['Id'],
            where: [
              {
                FieldName: 'category',
                Operator: 'ExactMatch',
                Values: [category.Name]
              }
            ]
          });
          
          const taskCount = taskCountResponse.success ? (taskCountResponse.data || []).length : 0;
          
          return {
            id: category.Id,
            name: category.Name,
            color: category.color,
            taskCount: taskCount
          };
        }
      }
      
      throw new Error('Failed to update category');
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  }

  async delete(id) {
    try {
      if (!this.apperClient) this.initClient();
      
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await this.apperClient.deleteRecord('category', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete category:${JSON.stringify(failedDeletions)}`);
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error('Failed to delete category');
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  }
}

export default new CategoryService();