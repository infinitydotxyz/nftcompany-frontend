import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './FilterPanel.module.css';
import PriceSlider from './PriceSlider';
import { Box } from '@chakra-ui/react';
import { SearchFilter, useSearchContext } from 'hooks/useSearch';

type Props = {
  isExpanded: boolean;
  setExpanded?: any;
  onChangeFilter: (updatedFilter: SearchFilter) => {};
  searchState: any;
};

const FilterPanel = ({ isExpanded, setExpanded, onChangeFilter }: Props) => {
  const handleChanges = async (changes: SearchFilter) => {
    const updatedFilter = { ...filterState, ...changes };
    setFilterState(updatedFilter);
    onChangeFilter(updatedFilter);
  };

  const { setFilterState, filterState } = useSearchContext();

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
              {/* <span className={styles.item}>
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
              </span> */}

              <span className={styles.item}>
                {/* <NiceSelect
                  placeholder="Sort by price"
                  id="filter2"
                  value={filterState?.sortByPrice}
                  onChange={(ev) => handleChanges({ ...filterState, sortByPrice: ev.target.value })}
                >
                  <option
                    key="DESC"
                    value="DESC"
                    data-value={'DESC'}
                    data-selected={filterState?.sortByPrice === 'DESC'}
                  >
                    Highest price
                  </option>
                  <option key="ASC" value="ASC" data-value={'ASC'} data-selected={filterState?.sortByPrice === 'ASC'}>
                    Lowest price
                  </option>
                </NiceSelect> */}
              </span>

              <Box w="300px" ml="5" display="flex" alignItems="center">
                <PriceSlider />
              </Box>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </section>
  );
};

FilterPanel.displayName = 'FilterPanel';

export default FilterPanel;
