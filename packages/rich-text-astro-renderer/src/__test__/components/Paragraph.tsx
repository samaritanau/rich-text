import React, { FunctionComponent, Fragment } from 'react';

type ParagraphProps = {
  children: Fragment;
};

const Paragraph: FunctionComponent<ParagraphProps> = ({ children }) => {
  return <p>{children}</p>;
};

export default Paragraph;
