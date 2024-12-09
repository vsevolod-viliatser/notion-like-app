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

  const handleTitleBlur = async () => {
    try {
      const updatedPage = await API.put(`/pages/${pageId}`, { title: pageTitle });
      onUpdatePage(updatedPage.data); // Update the title in the HomePage
    } catch (err) {
      console.error('Failed to update title:', err);
    } finally {
      setEditingTitle(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="page-editor">
      <div className="page-header">
        {editingTitle ? (
          <input
            type="text"
            value={pageTitle}
            onChange={(e) => setPageTitle(e.target.value)}
            onBlur={handleTitleBlur}
            autoFocus
          />
        ) : (
          <h2 onClick={() => setEditingTitle(true)} className="editable-title">
            {pageTitle}
          </h2>
        )}
      </div>
      <BlockList blocks={blocks} setBlocks={setBlocks} pageId={pageId} />
    </div>
  );
};

export default PageEditor;
