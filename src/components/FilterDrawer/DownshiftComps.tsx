import React from 'react';
import styled from '@emotion/styled';

export const SelectWrapper = styled.div`
  position: relative;
  display: inline-block;
  min-width: 6rem;
  max-width: 25rem;
  margin-right: 5px;
  width: 150px;
`;

export const Control = styled.div`
  border: 1px solid #eee;
  border-radius: 2px;
  padding: 5px 0 5px 5px;
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
`;

export const Label = styled.label`
  display: inline-block;
  cursor: pointer;
  max-width: calc(100% - 30px);
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const DropdownButton = styled.button`
  width: 30px;
  float: right;
  appearance: none;
  border: none;
  background: none;
  cursor: pointer;
`;

export function ArrowIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      preserveAspectRatio="none"
      width={11}
      fill="transparent"
      stroke="#333"
      strokeWidth="3px"
      transform={isOpen ? 'rotate(180)' : undefined}
    >
      <path d="M1,6 L10,15 L19,6" />
    </svg>
  );
}

export const Menu = styled.div`
  position: absolute;
  width: 100%;
  border: 1px solid darkgray;
  box-shadow: 0 2px 3px darkgray;
  background-color: white;
  z-index: 1 !important;
`;

export const SearchField = styled.input`
  width: 100%;
`;

type ListItemContainerProps = {
  selected?: boolean;
  highlighted?: boolean;
};

const ListItemContainer = styled.div`
  font-weight: ${(props: ListItemContainerProps) => (props.selected ? 'bold' : 'normal')};
  background-color: ${(props: ListItemContainerProps) =>
    props.highlighted ? 'var(--chakra-colors-brandBlue, red)' : 'transparent'};
  color: ${(props: ListItemContainerProps) => (props.highlighted ? 'white' : 'inherit')};
  white-space: nowrap;
  overflow: hidden;
  cursor: pointer;
`;

const Checkbox = styled.input`
  appearance: none;
  background: ${(props) => (props.checked ? 'black' : 'none')};
  border: 1px solid #555;
  width: 10px;
  height: 10px;
  vertical-align: middle;
  margin: 0 5px;
`;

export function ListItem({ children, ...containerProps }: any) {
  const { selected } = containerProps;

  return (
    <ListItemContainer {...containerProps} title={children}>
      <Checkbox type="checkbox" readOnly checked={selected} />
      {children}
    </ListItemContainer>
  );
}
