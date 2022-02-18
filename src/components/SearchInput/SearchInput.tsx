import { ReactElement, useRef } from 'react';
import { InputGroup, InputLeftElement, InputRightElement, Input } from '@chakra-ui/react';
import { SearchIcon, SmallCloseIcon } from '@chakra-ui/icons';

type Props = {
  onClear?: () => void;
  placeholder?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  defaultValue?: string;
  onChange?: (text: string) => void;
  className?: string;
};

const SearchInput = ({ placeholder, size, defaultValue, onChange, onClear, className }: Props) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  return (
    <InputGroup className={className || ''}>
      <InputLeftElement pointerEvents="none" color="gray.300" fontSize="1.2em">
        <SearchIcon ml={2} />
      </InputLeftElement>
      <Input
        ref={inputRef}
        size={size || 'md'}
        placeholder={placeholder}
        defaultValue={defaultValue}
        onChange={(ev) => {
          onChange && onChange(ev.target.value);
        }}
      />
      <InputRightElement onClick={onClear}>
        <SmallCloseIcon
          mr={2}
          color="gray.400"
          onClick={() => {
            if (inputRef.current) {
              inputRef.current.value = '';
            }
          }}
        />
      </InputRightElement>
    </InputGroup>
  );
};

export default SearchInput;
