import React from 'react';
import styled from '@emotion/styled';

export const SelectWrapper = styled.div`
  position: relative;
  display: inline-block;
  min-width: 6rem;
  max-width: 25rem;
  margin-right: 5px;
  width: 100px;
`;

export const Control = styled.div`
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 7px 5px 5px 5px;
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  height: 2rem;
`;

export const Label = styled.label`
  display: inline-block;
  max-width: calc(100% - 30px);
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  height: 100%;
  position: absolute;
  color: ${(props: any) => (props.disabled === true ? 'lightgray' : 'inherit')};
  cursor: ${(props: any) => (props.disabled === true ? 'default' : 'pointer')};
`;

export const DropdownButton = styled.button`
  width: 1.5rem;
  float: right;
  appearance: none;
  border: none;
  background: none;
  cursor: pointer;
  margin-top: -2px;
`;

export function ArrowIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      preserveAspectRatio="none"
      width={12}
      fill="transparent"
      stroke="#222"
      strokeWidth="4px"
      transform={isOpen ? 'rotate(180)' : undefined}
    >
      <path d="M1,6 L10,15 L19,6" />
    </svg>
  );
}

export const Menu = styled.div`
  position: absolute;
  width: 120%;
  border: 1px solid;
  // box-shadow: 0 2px 3px inherit;
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
    props.highlighted ? 'var(--chakra-colors-brandColor, red)' : 'transparent'};
  color: ${(props: ListItemContainerProps) => (props.highlighted ? 'white' : 'inherit')};
  white-space: nowrap;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  align-items: center;
`;

const Checkbox = styled.input`
  appearance: none;
  border: ${(props: any) => (props.highlighted ? '1px solid white' : '1px solid var(--chakra-colors-brandColor)')};
  border-radius: 2px;
  min-width: 14px;
  min-height: 14px;
  margin: 0px 5px;
  vertical-align: middle;
  :before {
    content: '';
    display: block;
  }
  :checked:before {
    width: 4px;
    height: 9px;
    margin: 2px auto;
    border-bottom: ${(props: any) =>
      props.highlighted ? '2px solid white' : '2px solid var(--chakra-colors-brandColor)'};
    border-right: ${(props: any) =>
      props.highlighted ? '2px solid white' : '2px solid var(--chakra-colors-brandColor)'};
    transform: rotate(45deg);
  }
`;

export function ListItem({ children, ...containerProps }: any) {
  const { selected } = containerProps;
  const highlighted = { highlighted: containerProps.highlighted };

  return (
    <ListItemContainer {...containerProps} title={children}>
      <Checkbox type="checkbox" readOnly checked={selected} {...highlighted} />
      {children}
    </ListItemContainer>
  );
}

export function SimpleListItem({ children, ...containerProps }: any) {
  return (
    <ListItemContainer {...containerProps} title={children}>
      {children}
    </ListItemContainer>
  );
}
