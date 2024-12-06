import React from 'react';
import Block from './Block';
import NewBlock from './NewBlock';

const BlockList = ({ blocks, setBlocks, pageId }) => {
  const sortedBlocks = blocks.sort((a, b) => a.position - b.position);

  return (
    <div className="block-list">
      {sortedBlocks.map((block) => (
        <Block
          key={block._id}
          block={block}
          setBlocks={setBlocks}
          blocks={blocks}
          pageId={pageId}
        />
      ))}
      <NewBlock setBlocks={setBlocks} blocks={blocks} pageId={pageId} />
    </div>
  );
};

export default BlockList;
