import React, { useState, useEffect } from 'react';
import API from '../api'; // Подключение к API

const Table = ({ block }) => {
  const [tableData, setTableData] = useState({
    rows: [],
    columns: [],
  });

  useEffect(() => {
    if (block.content) {
      try {
        const data = JSON.parse(block.content);
        setTableData(data);
      } catch (err) {
        console.error('Error parsing table content:', err);
      }
    }
  }, [block.content]);

  // Сохранение изменений в API
  const saveTable = async (data) => {
    try {
      await API.put(`/blocks/${block._id}`, { content: JSON.stringify(data) });
      setTableData(data);
    } catch (err) {
      console.error('Failed to save table:', err);
    }
  };

  // Добавление строки
  const addRow = () => {
    const newRows = [...tableData.rows, Array(tableData.columns.length).fill('')];
    saveTable({ ...tableData, rows: newRows });
  };

  // Добавление столбца
  const addColumn = () => {
    const newColumns = [...tableData.columns, `Column ${tableData.columns.length + 1}`];
    const newRows = tableData.rows.map((row) => [...row, '']);
    saveTable({ ...tableData, columns: newColumns, rows: newRows });
  };

  // Удаление строки
  const deleteRow = (rowIndex) => {
    const newRows = tableData.rows.filter((_, idx) => idx !== rowIndex);
    saveTable({ ...tableData, rows: newRows });
  };

  // Удаление столбца
  const deleteColumn = (colIndex) => {
    const newColumns = tableData.columns.filter((_, idx) => idx !== colIndex);
    const newRows = tableData.rows.map((row) => row.filter((_, idx) => idx !== colIndex));
    saveTable({ ...tableData, columns: newColumns, rows: newRows });
  };

  // Обновление содержимого ячейки
  const updateCell = (rowIndex, colIndex, value) => {
    const newRows = tableData.rows.map((row, idx) => {
      if (idx === rowIndex) {
        const newRow = [...row];
        newRow[colIndex] = value;
        return newRow;
      }
      return row;
    });
    saveTable({ ...tableData, rows: newRows });
  };

  return (
    <div className="table-container">
      <div className="table-actions">
        <button onClick={addRow}>Додати рядок</button>
        <button onClick={addColumn}>Додати стовпець</button>
      </div>
      <table>
        <thead>
          <tr>
            {tableData.columns.map((col, colIndex) => (
              <th key={colIndex}>
                <input
                  type="text"
                  value={col}
                  onChange={(e) => {
                    const newColumns = [...tableData.columns];
                    newColumns[colIndex] = e.target.value;
                    saveTable({ ...tableData, columns: newColumns });
                  }}
                />
                <button onClick={() => deleteColumn(colIndex)}>Видалити</button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, colIndex) => (
                <td key={colIndex}>
                  <input
                    type="text"
                    value={cell}
                    onChange={(e) => updateCell(rowIndex, colIndex, e.target.value)}
                  />
                </td>
              ))}
              <td>
                <button onClick={() => deleteRow(rowIndex)}>Видалити рядок</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;