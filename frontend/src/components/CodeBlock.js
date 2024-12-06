// src/components/CodeBlock.js

import React, { useState, useEffect } from 'react';
import API from '../api';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coy } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CodeBlock = ({ block }) => {
  const [content, setContent] = useState(block.content || '');
  const [language, setLanguage] = useState('javascript');

  useEffect(() => {
    setContent(block.content || '');
  }, [block.content]);

  const saveContent = async (newContent) => {
    setContent(newContent);
    try {
      await API.put(`/blocks/${block._id}`, { content: newContent });
    } catch (err) {
      console.error('Failed to save code content:', err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      console.log('Saving code block (Ctrl+S)');
      saveContent(content);
    }
    if (e.ctrlKey && e.key === 'l') {
      e.preventDefault();
      console.log('Change language (Ctrl+L)');
      const nextLanguage = language === 'javascript' ? 'python' : 'javascript';
      setLanguage(nextLanguage);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [content, language]);

  return (
    <div className="block block-code">
      <select value={language} onChange={(e) => setLanguage(e.target.value)}>
        <option value="javascript">JavaScript</option>
        <option value="python">Python</option>
        {/* Add more languages as needed */}
      </select>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Enter your code..."
      />
      <SyntaxHighlighter language={language} style={coy}>
        {content}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;
