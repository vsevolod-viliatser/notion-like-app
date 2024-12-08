import React, { useState, useEffect } from 'react';
import API from '../api';
import BlockList from '../components/BlockList';

const PageEditor = ({ pageId, onUpdatePage }) => {
  const [pageTitle, setPageTitle] = useState('');
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTitle, setEditingTitle] = useState(false);

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const pageRes = await API.get(`/pages/${pageId}`);
        setPageTitle(pageRes.data.title);

        const blocksRes = await API.get(`/blocks/page/${pageId}`);
        setBlocks(blocksRes.data);
      } catch (err) {
        console.error('Failed to fetch page data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPageData();
  }, [pageId]);

  const handleSaveTitle = async () => {
    try {
      const updatedPage = await API.put(`/pages/${pageId}`, { title: pageTitle });
      onUpdatePage(updatedPage.data); // Update the title in the HomePage
      setEditingTitle(false);
    } catch (err) {
      console.error('Failed to update title:', err);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="page-editor">
      <div className="page-header">
        {editingTitle ? (
          <div>
            <input
              type="text"
              value={pageTitle}
              onChange={(e) => setPageTitle(e.target.value)}
            />
            <button onClick={handleSaveTitle}>Зберегти</button>
            <button onClick={() => setEditingTitle(false)}>Скасувати</button>
          </div>
        ) : (
          <h1>
            {pageTitle}
            <button onClick={() => setEditingTitle(true)}>Редагувати</button>
          </h1>
        )}
      </div>
      <BlockList blocks={blocks} setBlocks={setBlocks} pageId={pageId} />
    </div>
  );
};

export default PageEditor;
