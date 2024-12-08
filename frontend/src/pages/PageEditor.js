import React, { useState, useEffect } from 'react';
import API from '../api';
import BlockList from '../components/BlockList';

const PageEditor = ({ pageId }) => {
  const [pageTitle, setPageTitle] = useState('');
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTitle, setEditingTitle] = useState(false);

  useEffect(() => {
    // Ensure pageId is valid before proceeding
    if (!pageId || typeof pageId !== 'string' || !pageId.match(/^[0-9a-fA-F]{24}$/)) {
      console.error('Invalid Page ID:', pageId);
      return;
    }

    const fetchPageData = async () => {
      try {
        console.log('Fetching page data for Page ID:', pageId);
        const pageRes = await API.get(`/pages/${pageId}`);
        console.log('Page data fetched:', pageRes.data);
        setPageTitle(pageRes.data.title);

        const blocksRes = await API.get(`/blocks/page/${pageId}`);
        console.log('Blocks fetched:', blocksRes.data);
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
      console.log('Saving page title:', pageTitle);
      await API.put(`/pages/${pageId}`, { title: pageTitle });
      setEditingTitle(false);
    } catch (err) {
      console.error('Failed to update title:', err);
    }
  };

  if (!pageId || typeof pageId !== 'string' || !pageId.match(/^[0-9a-fA-F]{24}$/)) {
    return <div>Invalid Page ID. Please check the URL or selection.</div>;
  }

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
            <button onClick={handleSaveTitle}>Save</button>
            <button onClick={() => setEditingTitle(false)}>Cancel</button>
          </div>
        ) : (
          <h1>
            {pageTitle}
            <button onClick={() => setEditingTitle(true)}>Edit</button>
          </h1>
        )}
      </div>
      <BlockList blocks={blocks} setBlocks={setBlocks} pageId={pageId} />
    </div>
  );
};

export default PageEditor;
