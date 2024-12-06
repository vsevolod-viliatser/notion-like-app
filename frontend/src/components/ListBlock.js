import React, { useState, useEffect } from 'react';
import API from '../api';
const ListBlock = ({ block, setBlocks, blocks }) => {
  const [items, setItems] = useState([]);
  const [listType, setListType] = useState('unordered');

  useEffect(() => {
    if (block.content) {
      try {
        const data = JSON.parse(block.content);
        setItems(data.items || []);
        setListType(data.listType || 'unordered');
      } catch {
        setItems([]);
        setListType('unordered');
      }
    }
  }, [block.content]);

  const saveList = async (updatedItems) => {
    const updatedContent = JSON.stringify({ items: updatedItems, listType });
    try {
      await API.put(`/blocks/${block._id}`, { content: updatedContent });
      setItems(updatedItems);
    } catch (err) {
      console.error('Failed to save list block:', err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      saveList([...items, '']);
    } else if (e.key === 'Shift' && e.key === 'Enter') {
      console.log('List completed');
      // Logic to complete list or add a new block
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [items]);

  return (
    <div className="list-block">
      <select
        value={listType}
        onChange={(e) => {
          setListType(e.target.value);
          saveList(items);
        }}
      >
        <option value="unordered">Bulleted List</option>
        <option value="ordered">Numbered List</option>
      </select>
      {listType === 'ordered' ? (
        <ol>
          {items.map((item, index) => (
            <li key={index}>
              <input
                type="text"
                value={item}
                onChange={(e) =>
                  saveList(items.map((i, idx) => (idx === index ? e.target.value : i)))
                }
              />
              <button onClick={() => saveList(items.filter((_, i) => i !== index))}>
                Delete
              </button>
            </li>
          ))}
        </ol>
      ) : (
        <ul>
          {items.map((item, index) => (
            <li key={index}>
              <input
                type="text"
                value={item}
                onChange={(e) =>
                  saveList(items.map((i, idx) => (idx === index ? e.target.value : i)))
                }
              />
              <button onClick={() => saveList(items.filter((_, i) => i !== index))}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};


export default ListBlock;
