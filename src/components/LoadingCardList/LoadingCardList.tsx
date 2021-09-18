import React from 'react';
import ContentLoader from 'react-content-loader';

const LoadingCard = (props: any) => (
  <ContentLoader
    speed={2}
    width={250}
    height={200}
    viewBox="0 0 250 200"
    backgroundColor="#f3f3f3"
    foregroundColor="#e3e3e3"
    {...props}
  >
    <rect x="16" y="175" rx="2" ry="2" width="140" height="10" />
    <rect x="16" y="190" rx="2" ry="2" width="140" height="10" />
    <rect x="13" y="0" rx="2" ry="2" width="250" height="170" />
    <rect x="200" y="175" rx="2" ry="2" width="140" height="10" />
  </ContentLoader>
);

const LoadingCardList = () => {
  return (
    <div style={{ marginTop: 40 }}>
      <LoadingCard style={{ marginRight: '5%' }} />

      <LoadingCard/>
    </div>
  );
};

export default LoadingCardList;
