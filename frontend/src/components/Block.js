import React from 'react';
import TableBlock from './TableBlock';
import ListBlock from './ListBlock'
import ToDoList from "./ToDoList"
import API from '../api';

import { useHotkeys } from 'react-hotkeys-hook';

const Block = ({ block, setBlocks, blocks }) => {
  const deleteBlock = async () => {
    try {
      await API.delete(`/blocks/${block._id}`);
      const updatedBlocks = blocks.filter((b) => b._id !== block._id);
      setBlocks(updatedBlocks);
    } catch (err) {
      console.error('Failed to delete block:', err);
    }
  };

  // Горячие клавиши для управления блоком
  useHotkeys('ctrl+d', deleteBlock, { enableOnTags: ['INPUT', 'TEXTAREA'] });

  const moveBlock = (direction) => {
    const currentIndex = blocks.findIndex((b) => b._id === block._id);
    const targetIndex = currentIndex + direction;

    if (targetIndex < 0 || targetIndex >= blocks.length) return;

    const updatedBlocks = [...blocks];
    [updatedBlocks[currentIndex], updatedBlocks[targetIndex]] = [
      updatedBlocks[targetIndex],
      updatedBlocks[currentIndex],
    ];
    setBlocks(updatedBlocks);
  };

  useHotkeys('ctrl+up', () => moveBlock(-1), { enableOnTags: ['INPUT', 'TEXTAREA'] });
  useHotkeys('ctrl+down', () => moveBlock(1), { enableOnTags: ['INPUT', 'TEXTAREA'] });

  const renderBlockContent = () => {
    switch (block.type) {
      case 'text':
        return <p>{block.content}</p>;
      case 'header':
        return <h2>{block.content}</h2>;
      case 'quote':
        return <blockquote>{block.content}</blockquote>;
      case 'code':
        return (
          <pre>
            <code>{block.content}</code>
          </pre>
        );
      case 'list':
        return <ListBlock block={block} setBlocks={setBlocks} blocks={blocks} />;
      case 'to-do':
        return <ToDoList block={block} setBlocks={setBlocks} blocks={blocks} />;
      case 'table':
        return <TableBlock block={block} />;
      case 'embed':
        return (
          <div className="embed-block">
            <iframe src={block.content} title="Embedded Content" frameBorder="0"></iframe>
          </div>
        );
      default:
        return <p>Unsupported block type</p>;
    }
  };

  return (
    <div className="block">
      {renderBlockContent()}
      <button onClick={deleteBlock}>Delete</button>
    </div>
  );
};


export default Block;