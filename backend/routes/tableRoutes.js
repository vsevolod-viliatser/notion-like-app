const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { createTable, addRow, addColumn,
     updateCell, deleteRow, deleteColumn,
      getAllTables, getTable, deleteTable,
    updateColumnName,reorderRows,reorderColumns,
    getTableStructure } = require('../controllers/tableController');

router.post('/', protect, createTable); // Create a table
router.post('/:tableId/row', protect, addRow); // Add a row
router.post('/:tableId/column', protect, addColumn); // Add a column
router.put('/:tableId/cell', protect, updateCell); // Update a cell
router.delete('/:tableId/row/:rowIndex', protect, deleteRow); // Delete a row
router.delete('/:tableId/column/:columnIndex', protect, deleteColumn); // Delete a column
router.get('/page/:pageId', protect, getAllTables); // Get all tables for a page
router.get('/:id', protect, getTable); // Get a single table
router.delete('/:id', protect, deleteTable); // Delete a table
router.put('/:tableId/column/:columnIndex', protect, updateColumnName);
router.put('/:tableId/rows/reorder', protect, reorderRows);
router.put('/:tableId/columns/reorder', protect, reorderColumns);
router.get('/:tableId/structure', protect, getTableStructure);
module.exports = router;