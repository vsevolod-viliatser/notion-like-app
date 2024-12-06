const Table = require('../models/Table');

// Table Controller
exports.createTable = async (req, res) => {
  const { pageId, rows, columns } = req.body;
  try {
    const table = new Table({ pageId, userId: req.user.id, rows, columns });
    await table.save();
    res.status(201).json(table);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// Add a row
exports.addRow = async (req, res) => {
  try {
    const table = await Table.findOne({ _id: req.params.tableId, userId: req.user.id });
    if (!table) return res.status(404).json({ message: 'Table not found' });
    table.rows.push(req.body.row);
    await table.save();
    res.status(200).json(table);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// Add a column
exports.addColumn = async (req, res) => {
  try {
    const table = await Table.findOne({ _id: req.params.tableId, userId: req.user.id });
    if (!table) return res.status(404).json({ message: 'Table not found' });
    table.columns.push(req.body.column);
    table.rows.forEach(row => row.push(null)); // Add null values for the new column in each row
    await table.save();
    res.status(200).json(table);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// Update cell content
exports.updateCell = async (req, res) => {
  const { rowIndex, columnIndex, content } = req.body;
  try {
    const table = await Table.findOne({ _id: req.params.tableId, userId: req.user.id });
    if (!table) return res.status(404).json({ message: 'Table not found' });
    table.rows[rowIndex][columnIndex] = content;
    await table.save();
    res.status(200).json(table);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// Delete a row
exports.deleteRow = async (req, res) => {
  try {
    const table = await Table.findOne({ _id: req.params.tableId, userId: req.user.id });
    if (!table) return res.status(404).json({ message: 'Table not found' });
    table.rows.splice(req.params.rowIndex, 1);
    await table.save();
    res.status(200).json(table);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// Delete a column
exports.deleteColumn = async (req, res) => {
  try {
    const table = await Table.findOne({ _id: req.params.tableId, userId: req.user.id });
    if (!table) return res.status(404).json({ message: 'Table not found' });
    const columnIndex = req.params.columnIndex;
    table.columns.splice(columnIndex, 1);
    table.rows.forEach(row => row.splice(columnIndex, 1)); // Remove corresponding cells
    await table.save();
    res.status(200).json(table);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// Get all tables for a page
exports.getAllTables = async (req, res) => {
  try {
    const tables = await Table.find({ pageId: req.params.pageId, userId: req.user.id });
    res.status(200).json(tables);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// Get one table
exports.getTable = async (req, res) => {
  try {
    const table = await Table.findOne({ _id: req.params.id, userId: req.user.id });
    if (!table) return res.status(404).json({ message: 'Table not found' });
    res.status(200).json(table);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// Delete a table
exports.deleteTable = async (req, res) => {
  try {
    const table = await Table.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!table) return res.status(404).json({ message: 'Table not found' });
    res.status(200).json({ message: 'Table deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};
exports.updateColumnName = async (req, res) => {
  const { columnName } = req.body;
  const { columnIndex } = req.params;

  try {
    const table = await Table.findOne({ _id: req.params.tableId, userId: req.user.id });
    if (!table) return res.status(404).json({ message: 'Table not found' });

    if (!table.columns[columnIndex]) {
      return res.status(400).json({ message: 'Invalid column index' });
    }

    table.columns[columnIndex] = columnName;
    await table.save();
    res.status(200).json(table);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};
exports.reorderRows = async (req, res) => {
  const { newOrder } = req.body; // [index1, index2, ...] - новый порядок индексов
  try {
    const table = await Table.findOne({ _id: req.params.tableId, userId: req.user.id });
    if (!table) return res.status(404).json({ message: 'Table not found' });

    const reorderedRows = newOrder.map(index => table.rows[index]);
    if (reorderedRows.length !== table.rows.length) {
      return res.status(400).json({ message: 'Invalid new order' });
    }

    table.rows = reorderedRows;
    await table.save();
    res.status(200).json(table);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};
exports.reorderColumns = async (req, res) => {
  const { newOrder } = req.body; // [index1, index2, ...] - новый порядок индексов
  try {
    const table = await Table.findOne({ _id: req.params.tableId, userId: req.user.id });
    if (!table) return res.status(404).json({ message: 'Table not found' });

    const reorderedColumns = newOrder.map(index => table.columns[index]);
    if (reorderedColumns.length !== table.columns.length) {
      return res.status(400).json({ message: 'Invalid new order' });
    }

    table.columns = reorderedColumns;
    table.rows = table.rows.map(row => newOrder.map(index => row[index]));
    await table.save();
    res.status(200).json(table);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};
exports.getTableStructure = async (req, res) => {
  try {
    const table = await Table.findOne({ _id: req.params.tableId, userId: req.user.id });
    if (!table) return res.status(404).json({ message: 'Table not found' });

    res.status(200).json({ columns: table.columns });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};
