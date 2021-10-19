import React, { useState } from 'react';
import styles from './CheckTransactionModal.module.scss';
import ModalDialog from 'components/ModalDialog/ModalDialog';
import { apiPost } from 'utils/apiUtil';
import { useAppContext } from 'utils/context/AppContext';
import { GenericError } from 'types';
import { Button, Input, Radio, RadioGroup, Stack } from '@chakra-ui/react';

const isServer = typeof window === 'undefined';

interface IProps {
  onClose: () => void;
}

const CheckTransactionModal: React.FC<IProps> = ({ onClose }: IProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [txnHash, setTxnHash] = useState('');
  const [actionType, setActionType] = useState('fulfill');
  const { user, showAppError, showAppMessage } = useAppContext();

  const checkTransaction = async () => {
    if (!txnHash) {
      showAppError('Transaction has is missing');
      return;
    }

    setIsSubmitting(true);

    try {
      const body = { actionType, txnHash };

      const { result, error } = await apiPost(`/u/${user?.account}/wyvern/v1/txns/check`, {}, body);

      if (error) {
        showAppError('Transaction not found');
      } else {
        showAppMessage(result);
      }
    } catch (err) {
      showAppError((err as GenericError)?.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {!isServer && (
        <ModalDialog onClose={onClose}>
          <div>
            <div className={styles.title}>Check Transaction</div>

            <Input
              value={txnHash}
              onChange={(e) => setTxnHash(e.target.value)}
              placeholder="Transaction Hash"
              size="sm"
            />

            <RadioGroup mt={4} onChange={setActionType} value={actionType}>
              <Stack>
                <Radio value="fulfill">Purchase / Sale</Radio>
                <Radio value="cancel">Cancel</Radio>
              </Stack>
            </RadioGroup>

            <div className={styles.buttons}>
              <Button
                disabled={isSubmitting}
                onClick={async () => {
                  await checkTransaction();
                  onClose();
                }}
              >
                Confirm
              </Button>

              <Button colorScheme="gray" disabled={isSubmitting} onClick={() => onClose()}>
                Cancel
              </Button>
            </div>
          </div>
        </ModalDialog>
      )}
    </>
  );
};

export default CheckTransactionModal;
