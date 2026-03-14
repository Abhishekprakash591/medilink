class MockStore {
  constructor() {
    this.storage = {
      patients: [],
      appointments: [],
      visits: []
    };
  }

  get(table) {
    return this.storage[table] || [];
  }

  set(table, data) {
    this.storage[table] = data;
  }
}

const store = new MockStore();

// Simulated network delay wrapper
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const apiClient = {
  async get(resource) {
    await delay();
    return { data: store.get(resource) };
  },
  
  async getById(resource, id) {
    await delay();
    const items = store.get(resource);
    const item = items.find(i => i.id === id);
    if (!item) throw new Error(`${resource} with id ${id} not found`);
    return { data: item };
  },

  async post(resource, data) {
    await delay();
    const items = store.get(resource);
    const newItem = { 
      id: Math.random().toString(36).substring(2, 9), 
      createdAt: new Date().toISOString(),
      ...data 
    };
    store.set(resource, [...items, newItem]);
    return { data: newItem };
  },

  async put(resource, id, data) {
    await delay();
    let items = store.get(resource);
    const index = items.findIndex(i => i.id === id);
    if (index === -1) throw new Error(`${resource} with id ${id} not found`);
    
    const updatedItem = { ...items[index], ...data, updatedAt: new Date().toISOString() };
    items[index] = updatedItem;
    store.set(resource, items);
    return { data: updatedItem };
  },

  async delete(resource, id) {
    await delay();
    let items = store.get(resource);
    store.set(resource, items.filter(i => i.id !== id));
    return { success: true };
  }
};

export default apiClient;
