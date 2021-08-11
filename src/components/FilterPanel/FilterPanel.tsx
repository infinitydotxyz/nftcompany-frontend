import * as React from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NiceSelect from 'components/NiceSelect/NiceSelect';
import PriceRange from './PriceRange';
import styles from './FilterPanel.module.css';

type Filter = {
  sortByLikes?: string;
  sortByPrice?: string;
};

type Props = {
  isExpanded: boolean;
  setExpanded?: any;
  onChange?: (filter: Filter) => void;
};
export default ({ isExpanded, setExpanded, onChange }: Props) => {
  const [filter, setFilter] = useState<Filter | null>(null);
  const [values, setValues] = useState([5]);

  React.useEffect(() => {
    // console.log('isExpanded', isExpanded);
  }, [isExpanded]);

  const handleChanges = async (changes: Filter) => {
    const updatedFilter = { ...changes };
    console.log('updatedFilter', updatedFilter);
    setFilter(updatedFilter);
    if (onChange) {
      onChange(updatedFilter);
    }
  };

  // By using `AnimatePresence` to mount and unmount the contents, we can animate
  // them in and out while also only rendering the contents of open accordions
  return (
    <section className={styles.main}>
      <motion.header
        initial={false}
        animate={{ backgroundColor: isExpanded ? '#FF0088' : '#0055FF' }}
        onClick={() => setExpanded(!!isExpanded)}
      />
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.section
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: 'auto' },
              collapsed: { opacity: 0, height: 0 }
            }}
            transition={{ duration: 0.5, ease: [0.04, 0.62, 0.23, 0.98] }}
          >
            <div className={styles.container}>
              <span className={styles.item}>
                <NiceSelect
                  placeholder="Sort by likes"
                  id="filter"
                  value={filter?.sortByLikes}
                  onChange={(ev) => handleChanges({ sortByLikes: ev.target.value })}
                >
                  <option
                    key={'DESC'}
                    value={'DESC'}
                    data-value={'DESC'}
                    data-selected={filter?.sortByLikes === 'DESC'}
                  >
                    Most liked
                  </option>
                  <option key={'ASC'} value={'ASC'} data-value={'ASC'} data-selected={filter?.sortByLikes === 'ASC'}>
                    Least liked
                  </option>
                </NiceSelect>
              </span>

              <span className={styles.item}>
                <NiceSelect
                  placeholder="Sort by price"
                  id="filter2"
                  value={filter?.sortByPrice}
                  onChange={(ev) => handleChanges({ sortByPrice: ev.target.value })}
                >
                  <option key="DESC" value="DESC" data-value={'DESC'} data-selected={filter?.sortByPrice === 'DESC'}>
                    Highest price
                  </option>
                  <option key="ASC" value="ASC" data-value={'ASC'} data-selected={filter?.sortByPrice === 'ASC'}>
                    Lowest price
                  </option>
                </NiceSelect>
              </span>

              <PriceRange values={values} setValues={setValues} className={styles.item} style={{ width: 200 }} />
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </section>
  );
};
