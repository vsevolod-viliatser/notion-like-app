const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { createBlock, updateBlock, deleteBlock, getAllBlocks, getBlock,reorderBlocks} = require('../controllers/blockController');

router.post('/', protect, createBlock); // Create a block
router.put('/:id', protect, updateBlock); // Update a block
router.delete('/:id', protect, deleteBlock); // Delete a block
router.get('/page/:pageId', protect, getAllBlocks); // Get all blocks for a page
router.get('/:id', protect, getBlock); // Get a single block
// In blockRoutes.js
router.put('/reorder', protect, reorderBlocks );

module.exports = router;
