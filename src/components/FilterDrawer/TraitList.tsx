import { useState } from 'react';
import { Box, Checkbox } from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import styles from './TraitList.module.scss';

type ValueMapItem = {
  [k: string]: boolean;
};

type TypeValueMap = {
  [k: string]: ValueMapItem;
};

type OpenState = {
  [k: string]: boolean;
};

// transform typeValueMap into array of traitTypes & traitValues
// example: { Shirt: { Black: true, White: true } } => ['Shirt'] and ['Black|White']
const getSelections = (typeValueMap: TypeValueMap) => {
  const traitTypes = [];
  const traitValues: string[] = [];
  for (const type of Object.keys(typeValueMap)) {
    const map = typeValueMap[type];
    const arr = [];
    for (const val of Object.keys(map)) {
      if (map[val] === true) {
        arr.push(val);
      }
    }
    if (arr.length > 0) {
      traitTypes.push(type);
      traitValues.push(arr.join('|'));
    }
  }
  return [traitTypes, traitValues];
};

type TraitData = {
  trait_type: string;
  values: string[];
};

type Props = {
  traitData: TraitData[];
  onChange: (traitTypes: string[], traitValues: string[]) => void;
};

function TraitList({ traitData, onChange }: Props) {
  const [openState, setOpenState] = useState<OpenState>({});
  const [typeValueMap, setTypeValueMap] = useState<TypeValueMap>({});
  if (!traitData || traitData.length === 0) {
    return <></>;
  }

  return (
    <Box textAlign="left">
      <Box mt={3} mb={3}>
        Properties
      </Box>

      <Box>
        {traitData.map((item) => {
          return (
            <Box key={item.trait_type}>
              <Box
                pt={2}
                pb={2}
                display="flex"
                alignItems="center"
                borderTop="1px solid #eee"
                cursor="pointer"
                onClick={() => {
                  const newOpenState = { ...openState, [item.trait_type]: !openState[item.trait_type] };
                  setOpenState(newOpenState);
                }}
              >
                {item.trait_type}
                <Box flex={1}></Box>
                {openState[item.trait_type] ? <ChevronUpIcon /> : <ChevronDownIcon />}
              </Box>

              {openState[item.trait_type] && (
                <Box className={styles.traitValuesBox}>
                  {item.values.map((value) => {
                    return (
                      <Box key={`${item.trait_type}_${value}`} pt={1} pb={1} className={styles.traitValue}>
                        <label>
                          <Checkbox
                            ml={2}
                            mr={3}
                            defaultChecked={(typeValueMap[item.trait_type] || {})[value]}
                            onChange={(ev) => {
                              typeValueMap[item.trait_type] = typeValueMap[item.trait_type] || {};
                              typeValueMap[item.trait_type][value] = ev.target.checked;

                              const [traitTypes, traitValues] = getSelections(typeValueMap);
                              if (onChange) {
                                onChange(traitTypes, traitValues);
                              }
                            }}
                          />{' '}
                          {value}
                        </label>
                      </Box>
                    );
                  })}
                </Box>
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

export default TraitList;
