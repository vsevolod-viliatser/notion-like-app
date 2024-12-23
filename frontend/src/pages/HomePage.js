import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import PageEditor from './PageEditor';
import ProductivityDashboard from '../components/ProductivityDashboard';
import API from '../api';

const HomePage = () => {
  const [pages, setPages] = useState([]);
  const [selectedPageId, setSelectedPageId] = useState(null);
  const [view, setView] = useState('pages'); // 'pages' or 'productivity'

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const res = await API.get('/pages');
        setPages(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPages();
  }, []);

  const handleAddPage = async (parentPageId = null) => {
    try {
      const res = await API.post('/pages', { title: 'New Page', parentPageId });
      setPages([...pages, res.data]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePage = async (pageId) => {
    try {
      await API.delete(`/pages/${pageId}`);
      setPages(pages.filter((page) => page._id !== pageId));
      if (selectedPageId === pageId) setSelectedPageId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectPage = (pageId) => {
    setSelectedPageId(pageId);
    setView('pages'); // Ensure we are in "pages" view when a page is selected
  };

  const handleUpdatePage = (updatedPage) => {
    setPages((prevPages) =>
      prevPages.map((page) =>
        page._id === updatedPage._id ? { ...page, title: updatedPage.title } : page
      )
    );
  };

  return (
    <div className="home">
      <Sidebar
        pages={pages}
        onAddPage={handleAddPage}
        onSelectPage={handleSelectPage}
        onDeletePage={handleDeletePage}
        onSwitchView={setView}
      />
      <div className="content">
        {view === 'pages' ? (
          selectedPageId ? (
            <PageEditor pageId={selectedPageId} onUpdatePage={handleUpdatePage} />
          ) : (
            <div>Виберіть сторінку для редагування</div>
          )
        ) : (
          <ProductivityDashboard />
        )}
      </div>
    </div>
  );
};

export default HomePage;
