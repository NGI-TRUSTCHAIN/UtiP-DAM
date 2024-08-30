import React, { useEffect, useRef } from 'react';

import Masonry from 'masonry-layout';

const MasonryLayout = ({ children }) => {
  const masonryRef = useRef(null);

  useEffect(() => {
    if (masonryRef.current) {
      var msnry = new Masonry(masonryRef.current, {
        itemSelector: '.masonry-item',
        columnWidth: '.masonry-sizer',
        percentPosition: true,
        gutter: 20,
      });
      msnry.layout();
      msnry.reloadItems();
    }
  }, [children]);

  return (
    <div ref={masonryRef} className="masonry">
      {children}
    </div>
  );
};

export default MasonryLayout;
