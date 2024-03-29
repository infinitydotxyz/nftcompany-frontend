import React from 'react';
import { CollectionCards } from 'components/CollectionCards/CollectionCards';

export default function FeaturedCollections() {
  return (
    <div>
      <div className="section-bar">
        <div className="tg-title">Featured</div>
      </div>
      <CollectionCards rows={1} featuredCollections />
    </div>
  );
}
