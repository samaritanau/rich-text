import React, { FunctionComponent, Fragment } from 'react';

type StrongProps = {
  children: Fragment;
};

const Strong: FunctionComponent<StrongProps> = ({ children }) => {
  return <strong>{children}</strong>;
};

export default Strong;
