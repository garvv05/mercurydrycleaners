const FAQ = require('../models/FAQ');

exports.getPublicFaqs = async (req, res) => {
  try {
    const { category } = req.query;
    let filter = { isActive: true };
    if (category && category !== 'All') {
      filter.category = category;
    }
    const faqs = await FAQ.find(filter, { order: 1 });
    return res.json({ success: true, count: faqs.length, faqs });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve FAQs' });
  }
};

exports.getAllFaqsAdmin = async (req, res) => {
  try {
    const faqs = await FAQ.find({}, { order: 1 });
    return res.json({ success: true, count: faqs.length, faqs });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve FAQs' });
  }
};

exports.createFaq = async (req, res) => {
  try {
    const { question, answer, category, order } = req.body;
    const faq = await FAQ.create({
      question,
      answer,
      category: category || 'General',
      order: Number(order || Date.now()),
      isActive: true
    });
    return res.status(201).json({ success: true, message: 'FAQ created', faq });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to create FAQ' });
  }
};

exports.updateFaq = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await FAQ.findByIdAndUpdate(id, req.body, { new: true });
    return res.json({ success: true, message: 'FAQ updated', faq: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update FAQ' });
  }
};

exports.deleteFaq = async (req, res) => {
  try {
    const { id } = req.params;
    await FAQ.findByIdAndDelete(id);
    return res.json({ success: true, message: 'FAQ removed' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete FAQ' });
  }
};
