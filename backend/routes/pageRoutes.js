const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { createPage, getPage, updatePage, deletePage, getAllPages, getPageTree } = require('../controllers/pageController');

router.post('/', protect, createPage); // Create a page
router.get('/:id', protect, getPage); // Get a single page
router.put('/:id', protect, updatePage); // Update a page
router.delete('/:id', protect, deletePage); // Delete a page
router.get('/', protect, getAllPages); // Add route for getting all pages
router.get('/tree', protect, getPageTree);

module.exports = router;
