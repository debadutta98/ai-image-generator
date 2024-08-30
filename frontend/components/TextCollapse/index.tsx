'use client';

import Collapse from '@mui/material/Collapse';
import React, { HTMLProps, useState } from 'react';

const TextCollapse: React.FC<HTMLProps<HTMLParagraphElement>> = function ({ children, ...props }) {
  const [expanded, setExpanded] = useState<boolean>(false);
  return (
    <>
      <Collapse collapsedSize={100} in={expanded}>
        <p {...props}>{children}</p>
      </Collapse>
      <button className="text-colWhite80 font-semibold" onClick={() => setExpanded(!expanded)}>
        {expanded ? '- Show less' : '+ Show more'}
      </button>
    </>
  );
};

export default TextCollapse;
