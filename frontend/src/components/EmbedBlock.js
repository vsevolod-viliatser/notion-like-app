// src/components/EmbedBlock.js

import React, { useState } from 'react';
import Dropzone from 'react-dropzone';
import API from '../api';

const EmbedBlock = ({ block }) => {
  const [embedUrl, setEmbedUrl] = useState(block.content || '');

  const handleFileUpload = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await API.post(`/blocks/${block._id}/upload`, formData);
      setEmbedUrl(res.data.url);
      await API.put(`/blocks/${block._id}`, { content: res.data.url });
    } catch (err) {
      console.error('Failed to upload file:', err);
    }
  };

  return (
    <div className="block block-embed">
      {embedUrl ? (
        // Adjust this to handle different file types (images, videos, etc.)
        <img src={embedUrl} alt="Embedded content" />
      ) : (
        <Dropzone onDrop={handleFileUpload}>
          {({ getRootProps, getInputProps }) => (
            <div {...getRootProps()} className="dropzone">
              <input {...getInputProps()} />
              <p>Drag & drop a file here, or click to select one</p>
            </div>
          )}
        </Dropzone>
      )}
    </div>
  );
};

export default EmbedBlock;