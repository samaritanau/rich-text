import React, { FunctionComponent, Fragment } from 'react';

type DocumentProps = {
  children: Fragment;
};

const Document: FunctionComponent<DocumentProps> = ({ children }) => {
  return <section>{children}</section>;
};

export default Document;
