const Service = require('../models/Service');

exports.getAllServices = async (req, res) => {
  try {
    const { category, activeOnly } = req.query;
    let filter = {};
    if (activeOnly === 'true') {
      filter.isActive = true;
    }
    if (category && category !== 'All Services') {
      filter.category = category;
    }

    let services = await Service.find(filter, { order: 1 });
    // Safety fallback: if isActive filtered out unflagged records, fetch all
    if ((!services || services.length === 0) && filter.isActive) {
      delete filter.isActive;
      services = await Service.find(filter, { order: 1 });
    }
    return res.json({ success: true, count: services.length, services });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve services' });
  }
};

exports.getServiceBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    let service = await Service.findOne({ slug });
    if (!service) {
      service = await Service.findById(slug);
    }
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    return res.json({ success: true, service });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error retrieving service details' });
  }
};

exports.createService = async (req, res) => {
  try {
    const { name, shortDescription, description, category, startingPrice, estimatedTime, image, features, careTips, included } = req.body;
    
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    
    const existing = await Service.findOne({ slug });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Service with similar name already exists' });
    }

    const newService = await Service.create({
      name,
      slug,
      shortDescription,
      description,
      category,
      startingPrice: Number(startingPrice),
      estimatedTime: estimatedTime || '48 Hours',
      image: image || '/assets/services/dryclean.jpg',
      features: features ? (Array.isArray(features) ? features : features.split('\n')) : [],
      careTips: careTips ? (Array.isArray(careTips) ? careTips : careTips.split('\n')) : [],
      included: included ? (Array.isArray(included) ? included : included.split('\n')) : [],
      isActive: true,
      order: Date.now()
    });

    return res.status(201).json({ success: true, message: 'Service created successfully', service: newService });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to create service' });
  }
};

exports.updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };
    if (updates.startingPrice) updates.startingPrice = Number(updates.startingPrice);

    const updated = await Service.findByIdAndUpdate(id, updates, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    return res.json({ success: true, message: 'Service updated', service: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update service' });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    await Service.findByIdAndDelete(id);
    return res.json({ success: true, message: 'Service removed' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete service' });
  }
};

exports.reorderServices = async (req, res) => {
  try {
    const { orderedIds } = req.body; // array of service IDs in new order
    if (Array.isArray(orderedIds)) {
      for (let i = 0; i < orderedIds.length; i++) {
        await Service.findByIdAndUpdate(orderedIds[i], { order: i });
      }
    }
    return res.json({ success: true, message: 'Service ordering updated' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to reorder services' });
  }
};
