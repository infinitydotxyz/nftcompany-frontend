import React from 'react';
import { Page } from 'components/page';

interface AssertDetailProps {
  onTitle: (title: string) => void;
}

export const AssertDetail: React.FC<AssertDetailProps> = ({ onTitle }: AssertDetailProps) => {
  return (
    <Page>
      <h1> Assert Detail Page</h1>
    </Page>
  );
};
