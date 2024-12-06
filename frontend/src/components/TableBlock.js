import React, { useState, useEffect } from "react";
import API from "../api";

const TableBlock = ({ block }) => {
  const [tableData, setTableData] = useState({ rows: [], columns: [] });

  useEffect(() => {
    if (block.content) {
      try {
        setTableData(JSON.parse(block.content));
      } catch {
        setTableData({ rows: [], columns: [] });
      }
    }
  }, [block.content]);

  const saveTableData = async (updatedData) => {
    try {
      await API.put(`/blocks/${block._id}`, {
        content: JSON.stringify(updatedData),
      });
      setTableData(updatedData);
    } catch (err) {
      console.error('Failed to save table data:', err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.ctrlKey && e.key === 'a') {
      e.preventDefault();
      console.log('Add row (Ctrl+A)');
      const updatedRows = [...tableData.rows, Array(tableData.columns.length).fill('')];
      saveTableData({ ...tableData, rows: updatedRows });
    }
    if (e.ctrlKey && e.key === 'c') {
      e.preventDefault();
      console.log('Add column (Ctrl+C)');
      const updatedColumns = [...tableData.columns, `Column ${tableData.columns.length + 1}`];
      const updatedRows = tableData.rows.map((row) => [...row, '']);
      saveTableData({ ...tableData, columns: updatedColumns, rows: updatedRows });
    }
    if (e.ctrlKey && e.key === 'd') {
      e.preventDefault();
      console.log('Delete last row (Ctrl+D)');
      const updatedRows = tableData.rows.slice(0, -1);
      saveTableData({ ...tableData, rows: updatedRows });
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [tableData]);

  return (
    <div className="table-block">
      <table>
        <thead>
          <tr>
            {tableData.columns.map((col, colIdx) => (
              <th key={colIdx}>
                <input
                  type="text"
                  value={col}
                  onChange={(e) =>
                    saveTableData({
                      ...tableData,
                      columns: tableData.columns.map((c, idx) =>
                        idx === colIdx ? e.target.value : c
                      ),
                    })
                  }
                />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.rows.map((row, rowIdx) => (
            <tr key={rowIdx}>
              {row.map((cell, colIdx) => (
                <td key={colIdx}>
                  <input
                    type="text"
                    value={cell}
                    onChange={(e) => {
                      const updatedRows = tableData.rows.map((r, rIdx) =>
                        rIdx === rowIdx
                          ? r.map((c, cIdx) => (cIdx === colIdx ? e.target.value : c))
                          : r
                      );
                      saveTableData({ ...tableData, rows: updatedRows });
                    }}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};



export default TableBlock;
