import { Box, Input, Tag, TagLabel, TagCloseButton, Wrap } from '@chakra-ui/react';
import { ChangeEvent, ClipboardEvent, KeyboardEvent, useState } from 'react';

interface Props3 {
  value: string[];
  onChange: (value: string[]) => void;
}

export const ChipInput = ({ value, onChange }: Props3): JSX.Element => {
  const [inputValue, setInputValue] = useState('');
  const [chips, setChips] = useState<string[]>(value);

  const updateChips = (newChips: string[]) => {
    setChips(newChips);
    onChange(newChips);
  };

  const chipExists = (data: string) => chips.includes(data);

  const isValid = (data: string) => {
    return data && data.length > 0;
  };

  const addChips = (chipsToAdd: string[]) => {
    const validateChips = chipsToAdd.map((e) => e.trim()).filter((data) => isValid(data) && !chipExists(data));

    const newChips = [...chips, ...validateChips];

    setInputValue('');

    updateChips(newChips);
  };

  const removeChip = (data: string) => {
    const index = chips.findIndex((e) => e === data);
    if (index !== -1) {
      const newChips = [...chips];
      newChips.splice(index, 1);

      updateChips(newChips);
    }
  };

  const handlePaste = (e: ClipboardEvent) => {
    e.preventDefault();

    const pastedData = e?.clipboardData?.getData('text');

    if (pastedData) {
      const pastedChips = pastedData.split(',');
      addChips(pastedChips);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (['Enter', 'Tab', ','].includes(e.key)) {
      e.preventDefault();

      const inputChips = inputValue.split(',');
      addChips(inputChips);
    }
  };

  const handleCloseClick = (data: string) => {
    removeChip(data);
  };

  return (
    <>
      <Box>
        <Input
          type="text"
          placeholder="Enter Collection Address"
          onPaste={handlePaste}
          onKeyDown={handleKeyDown}
          onChange={handleChange}
          value={inputValue}
        />
      </Box>

      <ChipList chips={chips} onCloseClick={handleCloseClick} />
    </>
  );
};

// ----------------------------------------------------------

interface Props {
  data: string;
  onCloseClick: (data: string) => void;
}

export const Chip = ({ data, onCloseClick }: Props): JSX.Element => (
  <Tag key={data} borderRadius="full" variant="solid" colorScheme="green">
    <TagLabel>{data}</TagLabel>
    <TagCloseButton
      onClick={() => {
        onCloseClick(data);
      }}
    />
  </Tag>
);

// ----------------------------------------------------------

interface Props2 {
  chips: string[];
  onCloseClick: (chip: string) => void;
}

export const ChipList = ({ chips = [], onCloseClick }: Props2): JSX.Element => (
  <Wrap spacing={1} my={2}>
    {chips.map((chip) => (
      <Chip data={chip} key={chip} onCloseClick={onCloseClick} />
    ))}
  </Wrap>
);
