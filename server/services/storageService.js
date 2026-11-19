const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

class JsonCollection {
  constructor(name) {
    this.name = name;
    this.filePath = path.join(DATA_DIR, `${name}.json`);
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify([], null, 2), 'utf-8');
    }
  }

  _read() {
    try {
      const content = fs.readFileSync(this.filePath, 'utf-8');
      return JSON.parse(content || '[]');
    } catch (err) {
      console.error(`Error reading ${this.name}.json:`, err.message);
      return [];
    }
  }

  _write(data) {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
      return true;
    } catch (err) {
      console.error(`Error writing ${this.name}.json:`, err.message);
      return false;
    }
  }

  async find(filter = {}) {
    const list = this._read();
    return list.filter(item => {
      for (const key of Object.keys(filter)) {
        if (filter[key] !== undefined) {
          // When filtering by isActive: true, treat undefined as true for backwards compatibility
          if (key === 'isActive' && filter[key] === true) {
            if (item.isActive === false) return false;
            continue;
          }
          if (item[key] !== filter[key]) {
            return false;
          }
        }
      }
      return true;
    });
  }

  async findOne(filter = {}) {
    const list = this._read();
    return list.find(item => {
      for (const key of Object.keys(filter)) {
        if (filter[key] !== undefined && item[key] !== filter[key]) {
          return false;
        }
      }
      return true;
    }) || null;
  }

  async findById(id) {
    const list = this._read();
    return list.find(item => item._id === id || item.id === id) || null;
  }

  async create(doc) {
    const list = this._read();
    const newDoc = {
      _id: doc._id || 'doc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      ...doc,
      createdAt: doc.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    list.push(newDoc);
    this._write(list);
    return newDoc;
  }

  async insertMany(docs) {
    const list = this._read();
    const prepared = docs.map((doc, idx) => ({
      _id: doc._id || 'doc_' + (Date.now() + idx) + '_' + Math.random().toString(36).substr(2, 6),
      ...doc,
      createdAt: doc.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));
    list.push(...prepared);
    this._write(list);
    return prepared;
  }

  async findByIdAndUpdate(id, updates, options = { new: true }) {
    const list = this._read();
    const index = list.findIndex(item => item._id === id || item.id === id);
    if (index === -1) return null;

    const updated = {
      ...list[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    list[index] = updated;
    this._write(list);
    return updated;
  }

  async findOneAndUpdate(filter, updates, options = { new: true }) {
    const list = this._read();
    const index = list.findIndex(item => {
      for (const key of Object.keys(filter)) {
        if (item[key] !== filter[key]) return false;
      }
      return true;
    });
    if (index === -1) return null;

    const updated = {
      ...list[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    list[index] = updated;
    this._write(list);
    return updated;
  }

  async findByIdAndDelete(id) {
    const list = this._read();
    const index = list.findIndex(item => item._id === id || item.id === id);
    if (index === -1) return null;
    const removed = list.splice(index, 1)[0];
    this._write(list);
    return removed;
  }

  async deleteMany(filter = {}) {
    if (Object.keys(filter).length === 0) {
      this._write([]);
      return { deletedCount: 0 };
    }
    const list = this._read();
    const remaining = list.filter(item => {
      for (const key of Object.keys(filter)) {
        if (item[key] === filter[key]) return false;
      }
      return true;
    });
    const deletedCount = list.length - remaining.length;
    this._write(remaining);
    return { deletedCount };
  }

  async countDocuments(filter = {}) {
    const results = await this.find(filter);
    return results.length;
  }
}

const collections = {};

const getCollection = (name) => {
  if (!collections[name]) {
    collections[name] = new JsonCollection(name);
  }
  return collections[name];
};

module.exports = { getCollection, JsonCollection };
