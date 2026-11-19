const { getStatus } = require('../config/db');
const { getCollection } = require('../services/storageService');

function createDualModel(collectionName, mongooseModel) {
  return {
    mongoose: mongooseModel,
    collectionName,

    async find(filter = {}, sort = null) {
      if (getStatus()) {
        const query = mongooseModel.find(filter);
        if (sort) query.sort(sort);
        return await query.lean();
      }
      const store = getCollection(collectionName);
      let results = await store.find(filter);
      if (sort && typeof sort === 'object') {
        const sortKey = Object.keys(sort)[0];
        const dir = sort[sortKey] === -1 ? -1 : 1;
        results.sort((a, b) => {
          if (a[sortKey] < b[sortKey]) return -1 * dir;
          if (a[sortKey] > b[sortKey]) return 1 * dir;
          return 0;
        });
      }
      return results;
    },

    async findOne(filter = {}) {
      if (getStatus()) {
        return await mongooseModel.findOne(filter).lean();
      }
      const store = getCollection(collectionName);
      return await store.findOne(filter);
    },

    async findById(id) {
      if (getStatus()) {
        return await mongooseModel.findById(id).lean();
      }
      const store = getCollection(collectionName);
      return await store.findById(id);
    },

    async create(doc) {
      if (getStatus()) {
        const created = await mongooseModel.create(doc);
        return created.toObject ? created.toObject() : created;
      }
      const store = getCollection(collectionName);
      return await store.create(doc);
    },

    async insertMany(docs) {
      if (getStatus()) {
        return await mongooseModel.insertMany(docs);
      }
      const store = getCollection(collectionName);
      return await store.insertMany(docs);
    },

    async findByIdAndUpdate(id, updates, options = { new: true }) {
      if (getStatus()) {
        return await mongooseModel.findByIdAndUpdate(id, updates, { new: true, runValidators: true }).lean();
      }
      const store = getCollection(collectionName);
      return await store.findByIdAndUpdate(id, updates, options);
    },

    async findOneAndUpdate(filter, updates, options = { new: true }) {
      if (getStatus()) {
        return await mongooseModel.findOneAndUpdate(filter, updates, { new: true, runValidators: true }).lean();
      }
      const store = getCollection(collectionName);
      return await store.findOneAndUpdate(filter, updates, options);
    },

    async findByIdAndDelete(id) {
      if (getStatus()) {
        return await mongooseModel.findByIdAndDelete(id).lean();
      }
      const store = getCollection(collectionName);
      return await store.findByIdAndDelete(id);
    },

    async deleteMany(filter = {}) {
      if (getStatus()) {
        return await mongooseModel.deleteMany(filter);
      }
      const store = getCollection(collectionName);
      return await store.deleteMany(filter);
    },

    async countDocuments(filter = {}) {
      if (getStatus()) {
        return await mongooseModel.countDocuments(filter);
      }
      const store = getCollection(collectionName);
      return await store.countDocuments(filter);
    }
  };
}

module.exports = { createDualModel };
