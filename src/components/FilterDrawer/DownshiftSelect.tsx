import React, { Component, createRef } from 'react';
import Downshift from 'downshift';
import { FixedSizeList } from 'react-window';
import {
  ListItem,
  Label,
  Menu,
  DropdownButton,
  ArrowIcon,
  SelectWrapper,
  Control,
  SimpleListItem
} from './DownshiftComps';
import memoizeOne from 'memoize-one';
import styles from './FilterDrawer.module.scss';

// DownshiftSelect - multi-select. Example: https://codesandbox.io/s/567w0rj74?file=/components.js

export type SelectItem = {
  label: string;
  id: string; // value
};

const CheckboxItemRenderer = ({ data, index, style }: any) => {
  const { getItemProps, items, highlightedIndex, isItemSelected } = data;
  const item = items[index];
  return (
    <ListItem
      {...getItemProps({
        style,
        index,
        item,
        key: item.id,
        highlighted: highlightedIndex === index,
        selected: isItemSelected(item)
      })}
    >
      <span className={styles.dropdownCheckboxItem}>{item.label}</span>
    </ListItem>
  );
};

const ItemRenderer = ({ data, index, style }: any) => {
  const { getItemProps, items, highlightedIndex, isItemSelected } = data;
  const item = items[index];
  return (
    <SimpleListItem
      {...getItemProps({
        style,
        index,
        item,
        key: item.id,
        highlighted: highlightedIndex === index,
        selected: isItemSelected(item)
      })}
    >
      <span className={styles.dropdownItem}>{item.label}</span>
    </SimpleListItem>
  );
};

const ITEM_HEIGHT = 30;
const MAX_LIST_HEIGHT = 240;

interface Props {
  options: SelectItem[];
  placeholder?: string;
  isMulti?: boolean;
  selectedItems?: SelectItem[];
  onChange?: (items: SelectItem | SelectItem[]) => void;
  disabled?: boolean;
}

export class DownshiftSelect extends Component<Props> {
  listRef = createRef();
  searchFieldRef = createRef();
  state = { selectedItems: [], filteredOptions: this.props.options };

  getFilteredOptions = memoizeOne((options: SelectItem[], inputValue) =>
    options.filter((item) => item.label.includes(inputValue))
  );

  getSelectedItems(): SelectItem[] {
    return this.props.selectedItems || this.state.selectedItems;
  }

  stateReducer = (state: any, changes: any) => {
    switch (changes.type) {
      case Downshift.stateChangeTypes.keyDownEnter:
      case Downshift.stateChangeTypes.clickItem:
        return {
          ...changes,
          highlightedIndex: this.props.isMulti ? state.highlightedIndex : changes.highlightedIndex,
          isOpen: this.props.isMulti,
          inputValue: ''
        };
      default:
        return changes;
    }
  };

  selectItem(item: any) {
    const { onChange = () => undefined } = this.props;
    if (this.props.selectedItems) {
      onChange([...this.props.selectedItems, item]);
    } else {
      this.setState(
        (prevState: any) => ({
          selectedItems: [...prevState.selectedItems, item]
        }),
        () => onChange(this.state.selectedItems)
      );
    }
  }

  deselectItem(item: any) {
    const { onChange = () => undefined } = this.props;
    if (this.props.selectedItems) {
      onChange(this.props.selectedItems.filter((i) => i !== item));
    } else {
      this.setState(
        (prevState: any) => ({
          selectedItems: prevState.selectedItems.filter((obj: SelectItem) => obj !== item)
        }),
        () => onChange(this.state.selectedItems)
      );
    }
  }

  onStateChange = (changes: any) => {
    if (changes.hasOwnProperty('highlightedIndex')) {
      if (this.listRef.current) {
        (this.listRef.current as any).scrollToItem(changes.highlightedIndex);
      }
    }
  };

  onChange = (selectedItem: any) => {
    if (!this.props.isMulti) {
      return this.props.onChange && this.props.onChange(selectedItem);
    }
    if (this.getSelectedItems().includes(selectedItem)) {
      this.deselectItem(selectedItem);
    } else {
      this.selectItem(selectedItem);
    }
  };

  focusSearchField() {
    if (this.searchFieldRef.current) {
      (this.searchFieldRef.current as any).focus();
    }
  }

  getLabelText(selectedItem: any) {
    if (this.props.isMulti) {
      return this.getSelectedItems().reduce((acc, item) => (acc ? acc + ', ' + item.label : item.label), '');
    }
    return selectedItem ? selectedItem.label : '';
  }

  render() {
    return (
      <Downshift
        itemToString={(i) => (i ? i.label : '')}
        onStateChange={this.onStateChange}
        stateReducer={this.stateReducer}
        onChange={this.onChange}
        selectedItem={this.props.isMulti ? null : undefined}
      >
        {(d) => {
          const filteredOptions = this.getFilteredOptions(this.props.options, d.inputValue);
          const labelText = this.getLabelText(d.selectedItem);

          const listHeight = Math.min(filteredOptions.length * ITEM_HEIGHT, MAX_LIST_HEIGHT);

          d.setItemCount(filteredOptions.length);

          return (
            <SelectWrapper {...d.getRootProps()}>
              <Control>
                <Label
                  {...d.getLabelProps({
                    onFocus: () => {
                      d.openMenu();
                      requestAnimationFrame(() => this.focusSearchField());
                    },
                    title: labelText,
                    tabIndex: 0
                  })}
                  disabled={this.props.disabled}
                >
                  {labelText || this.props.placeholder}
                </Label>
                <DropdownButton {...d.getToggleButtonProps()}>
                  <ArrowIcon isOpen={d.isOpen} />
                </DropdownButton>
              </Control>

              {d.isOpen && (
                <Menu>
                  {/* <SearchField
                    {...d.getInputProps({
                      placeholder: 'Search',
                      ref: this.searchFieldRef
                    })}
                  /> */}
                  <FixedSizeList
                    {...d.getMenuProps({
                      refKey: 'outerRef'
                    })}
                    height={listHeight}
                    itemCount={filteredOptions.length}
                    itemSize={ITEM_HEIGHT}
                    itemData={{
                      items: filteredOptions,
                      getItemProps: d.getItemProps,
                      highlightedIndex: d.highlightedIndex,
                      isItemSelected: this.props.isMulti
                        ? (item: SelectItem) => {
                            const arr: SelectItem[] = this.getSelectedItems();
                            const isSelected = !!arr.find((obj: SelectItem) => obj.id === item.id);
                            return isSelected;
                          }
                        : (item: SelectItem) => item === d.selectedItem
                    }}
                    width="100%"
                    ref={this.listRef}
                    style={{ zIndex: 1 }}
                  >
                    {this.props.isMulti === true ? CheckboxItemRenderer : ItemRenderer}
                  </FixedSizeList>
                </Menu>
              )}
            </SelectWrapper>
          );
        }}
      </Downshift>
    );
  }
}
