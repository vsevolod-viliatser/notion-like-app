// Page Controller
const Page = require('../models/Page');
const mongoose = require('mongoose');

exports.getAllPages = async (req, res) => {
  try {
    const pages = await Page.find({ userId: req.user.id });
    res.status(200).json(pages);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.createPage = async (req, res) => {
  const { title, parentPageId } = req.body;
  console.log("Received data:", { title, parentPageId });

  // Check if parentPageId is valid
  let parentId = null;
  if (parentPageId && mongoose.Types.ObjectId.isValid(parentPageId)) {
    parentId = new mongoose.Types.ObjectId(parentPageId);
  } else if (parentPageId) {
    // If parentPageId is invalid, return an error
    return res.status(400).json({ message: 'Invalid parentPageId' });
  }

  try {
    // If parentPageId is provided, check if the parent page exists
    if (parentId) {
      const parentPage = await Page.findOne({ _id: parentId, userId: req.user.id });
      if (!parentPage) {
        return res.status(400).json({ message: 'Parent page not found' });
      }
    }

    // Create and save the new page
    const page = new Page({
      userId: req.user.id,
      title,
      parentPageId: parentId, // Ensure parentPageId is a valid ObjectId or null
    });

    await page.save();
    res.status(201).json(page); // Send the saved page as the response
  } catch (err) {
    console.error('Error saving page:', err);  // Log specific error details
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// Get a single page
exports.getPage = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.error('Invalid Page ID:', id);
    return res.status(400).json({ message: 'Invalid Page ID' });
  }

  try {

    const page = await Page.findOne({ _id: id, userId: req.user.id }).populate('parentPageId');
    if (!page) {
      console.log('Page not found for ID:', id);
      return res.status(404).json({ message: 'Page not found' });
    }

    res.status(200).json(page);
  } catch (err) {
    console.error('Error fetching page:', err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// Update a page
exports.updatePage = async (req, res) => {
  const { title } = req.body;
  try {
    const page = await Page.findOneAndUpdate({ _id: req.params.id, userId: req.user.id }, { title }, { new: true });
    if (!page) return res.status(404).json({ message: 'Page not found' });
    res.status(200).json(page);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Delete a page
exports.deletePage = async (req, res) => {
  try {
    const page = await Page.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!page) return res.status(404).json({ message: 'Page not found' });
    res.status(200).json({ message: 'Page deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get page tree
exports.getPageTree = async (req, res) => {
  try {
    const userId = req.user.id; // Предполагается, что пользователь авторизован
    const pages = await Page.find({ userId });

    // Построение дерева страниц
    const buildTree = (parentId) => {
      return pages
        .filter((page) => String(page.parentPageId) === String(parentId))
        .map((page) => ({
          _id: page._id,
          title: page.title,
          parentPageId: page.parentPageId,
          children: buildTree(page._id),
        }));
    };

    const pageTree = buildTree(null); // Начинаем с корневых страниц
    res.json(pageTree);
  } catch (error) {
    console.error('Error fetching page tree:', error);
    res.status(500).json({ message: 'Failed to fetch page tree' });
  }
};