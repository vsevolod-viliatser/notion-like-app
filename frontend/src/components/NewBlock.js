import React, { useState } from "react";
import API from "../api";
import { useHotkeys } from 'react-hotkeys-hook';

const NewBlock = ({ setBlocks, blocks, pageId }) => {
  const [newBlockContent, setNewBlockContent] = useState('');
  const [selectedType, setSelectedType] = useState('text');
  const [tableRows, setTableRows] = useState('');
  const [tableColumns, setTableColumns] = useState('');

  // Горячие клавиши для выбора типа блока
  useHotkeys('ctrl+1', () => setSelectedType('text'));
  useHotkeys('ctrl+2', () => setSelectedType('header'));
  useHotkeys('ctrl+3', () => setSelectedType('table'));
  useHotkeys('ctrl+4', () => setSelectedType('list'));
  useHotkeys('ctrl+5', () => setSelectedType('quote'));
  useHotkeys('ctrl+6', () => setSelectedType('code'));
  useHotkeys('ctrl+7', () => setSelectedType('to-do'));
  useHotkeys('ctrl+8', () => setSelectedType('embed'));

  const addBlock = async () => {
    let content = '';

    if (selectedType === 'table') {
      const rows = parseInt(tableRows, 10);
      const columns = parseInt(tableColumns, 10);

      if (!rows || rows <= 0 || !columns || columns <= 0) {
        alert('Please enter valid numbers for rows and columns.');
        return;
      }

      content = JSON.stringify({
        rows: Array.from({ length: rows }, () => Array(columns).fill('')),
        columns: Array.from({ length: columns }, (_, idx) =>`Column ${idx + 1}`),
      });
    } else if (selectedType === 'to-do') {
      content = JSON.stringify([]);
    } else {
      content = newBlockContent;
    }

    try {
      const res = await API.post('/blocks', {
        pageId,
        type: selectedType,
        content,
        position: blocks.length,
      });
      setBlocks([...blocks, res.data]);
      setNewBlockContent('');
      setTableRows('');
      setTableColumns('');
    } catch (err) {
      console.error('Failed to add block:', err);
    }
  };

  return (
    <div className="new-block">
      <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
        <option value="text">Text</option>
        <option value="header">Header</option>
        <option value="quote">Quote</option>
        <option value="code">Code</option>
        <option value="list">List</option>
        <option value="to-do">To-Do</option>
        <option value="embed">Embed</option>
        <option value="table">Table</option>
      </select>

      {selectedType === 'table' && (
        <div className="table-setup">
          <label>
            Rows:
            <input
              type="number"
              value={tableRows}
              onChange={(e) => setTableRows(e.target.value)}
              placeholder="Enter number of rows"
              min="1"
            />
          </label>
          <label>
            Columns:
            <input
              type="number"
              value={tableColumns}
              onChange={(e) => setTableColumns(e.target.value)}
              placeholder="Enter number of columns"
              min="1"
            />
          </label>
        </div>
      )}

      {selectedType !== 'table' && selectedType !== 'to-do' && selectedType !== 'list'&& (
        <input
          type="text"
          value={newBlockContent}
          onChange={(e) => setNewBlockContent(e.target.value)}
          placeholder={`Enter ${selectedType} content...`}
        />
      )}

      <button onClick={addBlock}>Add Block</button>
    </div>
  );
};

export default NewBlock;