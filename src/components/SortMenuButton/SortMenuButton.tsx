import React from 'react';
import NiceSelect from 'components/NiceSelect/NiceSelect';
import styles from './SortMenuButton.module.scss';
import { SearchFilter, useSearchContext } from 'hooks/useSearch';

type Props = {
  onChangeFilter: (updatedFilter: SearchFilter) => {};
};

const SortMenuButton = ({ onChangeFilter }: Props) => {
  const { setFilterState, filterState } = useSearchContext();

  const handleChanges = async (changes: SearchFilter) => {
    const updatedFilter = { ...filterState, ...changes };
    setFilterState(updatedFilter);
    onChangeFilter(updatedFilter);
  };

  /* use this later maybe
    <div className={styles.item}>
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
  */

  return (
    <NiceSelect
      placeholder="Sort by price"
      id="select-price"
      value={filterState?.sortByPrice}
      onChange={(ev) => handleChanges({ ...filterState, sortByPrice: ev.target.value })}
    >
      <option key="DESC" value="DESC" data-value={'DESC'} data-selected={filterState?.sortByPrice === 'DESC'}>
        Highest price
      </option>

      <option key="ASC" value="ASC" data-value={'ASC'} data-selected={filterState?.sortByPrice === 'ASC'}>
        Lowest price
      </option>
    </NiceSelect>
  );
};

SortMenuButton.displayName = 'SortMenuButton';

export default SortMenuButton;
