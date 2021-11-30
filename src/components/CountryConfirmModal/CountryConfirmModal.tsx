import React, { useState } from 'react';
import { useAppContext } from 'utils/context/AppContext';
import { apiPost } from 'utils/apiUtil';
import ModalDialog from 'components/ModalDialog/ModalDialog';
import { Button } from '@chakra-ui/react';

import styles from './CountryConfirmModal.module.scss';

const isServer = typeof window === 'undefined';
interface IProps {
  onSubmit: () => void;
  onClose: () => void;
}

const CountryConfirmModal: React.FC<IProps> = ({ onSubmit, onClose }: IProps) => {
  const { user, showAppError } = useAppContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClickConfirm = async () => {
    const { result, error } = await apiPost(`/u/${user?.account}/usperson`, null, { usPerson: 'no' });
    if (error) {
      showAppError('Failed to update country origin.');
    } else {
      if (result.usPerson === 'NO') {
        onSubmit(); // confirmed successfully => close modal
      } else {
        onClose();
      }
    }
  };

  return (
    <>
      {!isServer && (
        <ModalDialog onClose={onClose}>
          <div>
            <div className={styles.title}>By accessing the airdrop, you agree to the following terms</div>

            <div className={styles.space}>
              <div>&nbsp;</div>
              <div>
                The $NFT token airdrop is not for persons or entities who reside, are citizens of, are located in,
                incorporated in, or have a registered office in the United States of America.
              </div>
              <div>&nbsp;</div>
              <div>
                By clicking the Confirm button, you hereby agree, represent, and warrant that you do not meet the above
                criteria that would cause you to be ineligible.
              </div>
            </div>

            <div className={styles.buttons}>
              <Button onClick={handleClickConfirm} disabled={isSubmitting}>
                Confirm
              </Button>

              <Button colorScheme="gray" disabled={isSubmitting} onClick={() => onClose && onClose()}>
                Cancel
              </Button>
            </div>
          </div>
        </ModalDialog>
      )}
    </>
  );
};

export default CountryConfirmModal;
