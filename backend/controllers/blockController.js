const Block = require('../models/Block');
const mongoose = require('mongoose');

// Block Controller
exports.createBlock = async (req, res) => {
  const { pageId, type, content, position, parentBlockId } = req.body;
  try {
    const allowedTypes = ['text', 'header', 'list', 'to-do', 'quote', 'code', 'embed', 'table'];
    console.log('Incoming request body:', req.body); // Логируем тело запроса

    if (!allowedTypes.includes(type)) {
      console.log(`Invalid block type: ${type}`);
      return res.status(400).json({ message: `Invalid block type: ${type}` });
    }

    if (type === 'table' && (!content || typeof content !== 'string')) {
      console.log('Table block missing valid content. Rejecting.');
      return res.status(400).json({ message: 'Table block requires valid content.' });
    }

    const block = new Block({
      pageId,
      userId: req.user.id,
      type,
      content,
      position,
      parentBlockId,
    });

    console.log('Block to be saved:', block); // Логируем перед сохранением
    await block.save();
    res.status(201).json(block);
  } catch (err) {
    console.error('Error creating block:', err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};



// Get all blocks for a page
exports.getAllBlocks = async (req, res) => {
  const { pageId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(pageId)) {
    console.error('Invalid Page ID:', pageId);
    return res.status(400).json({ message: 'Invalid Page ID' });
  }

  try {
    console.log('Fetching blocks for Page ID:', pageId);
    console.log('Request User ID:', req.user.id);

    const blocks = await Block.find({ pageId, userId: req.user.id });
    res.status(200).json(blocks);
  } catch (err) {
    console.error('Error fetching blocks:', err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// Get one block
exports.getBlock = async (req, res) => {
  try {
    const block = await Block.findOne({ _id: req.params.id, userId: req.user.id });
    if (!block) return res.status(404).json({ message: 'Block not found' });
    res.status(200).json(block);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Update a block
exports.updateBlock = async (req, res) => {
  const { type, content, position } = req.body;
  try {
    const block = await Block.findOneAndUpdate({ _id: req.params.id, userId: req.user.id }, { type, content, position }, { new: true });
    if (!block) return res.status(404).json({ message: 'Block not found' });
    res.status(200).json(block);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Delete a block
exports.deleteBlock = async (req, res) => {
  try {
    const block = await Block.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!block) return res.status(404).json({ message: 'Block not found' });
    res.status(200).json({ message: 'Block deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};
exports.reorderBlocks = async (req, res) => {
  const { pageId, blockOrder } = req.body;

  try {
    for (let position = 0; position < blockOrder.length; position++) {
      const blockId = blockOrder[position];
      await Block.updateOne({ _id: blockId, pageId }, { position });
    }
    res.status(200).json({ message: 'Blocks reordered successfully' });
  } catch (err) {
    console.error('Error reordering blocks:', err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};