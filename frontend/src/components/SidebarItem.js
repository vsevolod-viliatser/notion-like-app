// src/components/SidebarItem.js
import React from 'react';

const SidebarItem = ({ page, pages, onSelectPage, onAddSubPage, onDeletePage }) => {
  const childPages = pages.filter((p) => p.parentPageId === page._id);

  return (
    <li>
      <div className="sidebar-item">
        <span onClick={() => onSelectPage(page)}>{page.title}</span>
        <button onClick={() => onAddSubPage(page._id)}>Add Subpage</button>
        <button onClick={() => onDeletePage(page._id)}>Delete</button>
      </div>
      {childPages.length > 0 && (
        <ul>
          {childPages.map((childPage) => (
            <SidebarItem
              key={childPage._id}
              page={childPage}
              pages={pages}
              onSelectPage={onSelectPage}
              onAddSubPage={onAddSubPage}
              onDeletePage={onDeletePage}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

export default SidebarItem;
