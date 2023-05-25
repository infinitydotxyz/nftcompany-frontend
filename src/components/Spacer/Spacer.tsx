import React from 'react';

type Props = {
  height?: number;
  width?: number;
};

export const ExtraSpace = ({ height = 20, width = 0 }: Props): JSX.Element => {
  return <div style={{ height: height, width: width }} />;
};
