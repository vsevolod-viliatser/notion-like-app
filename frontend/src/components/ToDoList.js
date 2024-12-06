import React, { useState, useEffect } from 'react';
import API from '../api';
const ToDoList = ({ block }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (block.content) {
      try {
        const data = JSON.parse(block.content);
        setItems(data || []);
      } catch {
        setItems([]);
      }
    }
  }, [block.content]);

  const toggleItem = (index) => {
    const updatedItems = items.map((item, idx) =>
      idx === index ? { ...item, completed: !item.completed } : item
    );
    saveItems(updatedItems);
  };

  const addItem = () => {
    const newItems = [...items, { text: '', completed: false }];
    saveItems(newItems);
  };

  const updateItem = (index, text) => {
    const updatedItems = items.map((item, idx) =>
      idx === index ? { ...item, text } : item
    );
    saveItems(updatedItems);
  };

  const deleteItem = (index) => {
    const updatedItems = items.filter((_, idx) => idx !== index);
    saveItems(updatedItems);
  };

  const saveItems = async (updatedItems) => {
    try {
      await API.put(`/blocks/${block._id}`, { content: JSON.stringify(updatedItems) });
      setItems(updatedItems);
    } catch (err) {
      console.error('Failed to save To-Do list:', err);
    }
  };

  return (
    <div className="todo-list">
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            <input
              type="checkbox"
              checked={item.completed}
              onChange={() => toggleItem(index)}
            />
            <input
              type="text"
              value={item.text}
              onChange={(e) => updateItem(index, e.target.value)}
            />
            <button onClick={() => deleteItem(index)}>Delete</button>
          </li>
        ))}
      </ul>
      <button onClick={addItem}>Add Item</button>
    </div>
  );
};

export default ToDoList;
