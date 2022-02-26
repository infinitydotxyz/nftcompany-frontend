import {
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Button,
  useMediaQuery
} from '@chakra-ui/react';
import { DataColumns } from 'components/TrendingList/DataColumns';
import React, { Dispatch, SetStateAction } from 'react';
import TrendingFilter from './TrendingFilter';
import styles from './styles.module.scss';

interface Props {
  dataColumns: DataColumns;
  setDataColumns: Dispatch<SetStateAction<DataColumns>>;
}

function TrendingDrawer(props: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isMobileSmall] = useMediaQuery('(max-width: 600px)');

  return (
    <>
      <Button borderRadius={100} variant="outline" onClick={onOpen}>
        Filter
      </Button>

      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size={isMobileSmall ? 'full' : 'xs'}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <div className={styles.drawerHeader}>
            <div className={styles.title}>Filter</div>
            <div className={styles.subtitle}>Select up to 5</div>
          </div>

          <DrawerBody>
            <TrendingFilter setDataColumns={props.setDataColumns} dataColumns={props.dataColumns} onClose={onClose} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default TrendingDrawer;
