import React, { useEffect, useState } from 'react';

interface NavItem {
  title: string;
  onClick?: () => void;
}

interface Props {
  items: NavItem[];
  defaultIndex?: number;
  onChange?: (currentIndex: number) => void;
}

export default function RoundedNav({ items, defaultIndex, onChange }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(defaultIndex ?? 0);
  }, [defaultIndex]);

  return (
    <nav className="flex justify-between space-x-4 bg-gray-200 rounded-2xl" aria-label="Tabs">
      {items.map((item, index: number) => {
        const isActive = index === activeIndex;
        const activeCx = isActive ? 'bg-gray-900 text-white' : '';
        return (
          <a
            key={item.title}
            href="javascript:;"
            className={`px-10 py-2 font-medium rounded-3xl text-sm bg-gray-200 ${activeCx}`}
            onClick={() => {
              setActiveIndex(index);
              if (onChange) {
                onChange(index);
              }
            }}
          >
            {item.title}
          </a>
        );
      })}
    </nav>
  );
}
