const GarmentItem = require('../models/GarmentItem');

exports.getAllGarments = async (req, res) => {
  try {
    const { category } = req.query;
    let filter = { isActive: true };
    if (category && category !== 'All') {
      filter.category = category;
    }
    const items = await GarmentItem.find(filter, { order: 1 });
    return res.json({ success: true, count: items.length, items });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve garment pricing' });
  }
};

exports.updateGarmentPrice = async (req, res) => {
  try {
    const { id } = req.params;
    const { dryCleanPrice, steamIronPrice, premiumCarePrice, name, category, fabricAdvice, description } = req.body;

    const updates = {};
    if (dryCleanPrice !== undefined) updates.dryCleanPrice = Number(dryCleanPrice);
    if (steamIronPrice !== undefined) updates.steamIronPrice = Number(steamIronPrice);
    if (premiumCarePrice !== undefined) updates.premiumCarePrice = Number(premiumCarePrice);
    if (name) updates.name = name;
    if (category) updates.category = category;
    if (fabricAdvice) updates.fabricAdvice = fabricAdvice;
    if (description !== undefined) updates.description = description;

    const updated = await GarmentItem.findByIdAndUpdate(id, updates, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Garment item not found' });
    }
    return res.json({ success: true, message: 'Price updated successfully', item: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update price' });
  }
};

exports.createGarmentItem = async (req, res) => {
  try {
    const { name, category, dryCleanPrice, steamIronPrice, premiumCarePrice, fabricAdvice, icon } = req.body;
    const newItem = await GarmentItem.create({
      name,
      category,
      dryCleanPrice: Number(dryCleanPrice || 0),
      steamIronPrice: Number(steamIronPrice || 0),
      premiumCarePrice: Number(premiumCarePrice || 0),
      fabricAdvice: fabricAdvice || 'Treated with fabric-safe dry cleaning technology.',
      icon: icon || 'shirt',
      isActive: true,
      order: Date.now()
    });
    return res.status(201).json({ success: true, message: 'Garment added', item: newItem });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to add garment item' });
  }
};

exports.deleteGarmentItem = async (req, res) => {
  try {
    const { id } = req.params;
    await GarmentItem.findByIdAndDelete(id);
    return res.json({ success: true, message: 'Garment deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete garment item' });
  }
};
