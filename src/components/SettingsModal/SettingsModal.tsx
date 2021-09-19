import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import styles from './SettingsModal.module.scss';
import { useAppContext } from 'utils/context/AppContext';
import { apiGet, apiPost } from 'utils/apiUtil';
import { Button, Input } from '@chakra-ui/react';
const Modal = dynamic(() => import('hooks/useModal'));
const isServer = typeof window === 'undefined';

interface Props {
  onClose: () => void;
}

const SettingsModal: React.FC<Props> = ({ onClose }: Props) => {
  const [email, setEmail] = useState('');

  const { user, showAppError } = useAppContext();

  const updateEmail = async (email: string) => {
    if (user != null && email?.length > 0) {
      const response = await apiPost(`/u/${user?.account}/setEmail`, null, { user: user!.account, email: email });

      if (response.status == 200) {
        onClose();
      }
    }
  };

  const getEmail = async () => {
    if (!user || !user?.account) {
      setEmail('');
      return;
    }

    const { result, error } = await apiGet(`/u/${user?.account}/getEmail`);
    if (error) {
      showAppError(`${error.message}`);
      return;
    }

    setEmail(result?.address || '');
  };

  React.useEffect(() => {
    getEmail();
  }, [user]);

  return (
    <>
      {!isServer && (
        <Modal
          brandColor={'blue'}
          isActive={true}
          onClose={onClose}
          activator={({ setShow }: any) => (
            <div onClick={() => setShow(true)} className={'nftholder'}>
              &nbsp;
            </div>
          )}
        >
          <div className={`modal ${'ntfmodal'}`} style={{ background: 'white', borderColor: 'blue' }}>
            <div className="modal-body">
              <div className={styles.main}>
                <div className={styles.title}>Settings</div>
                <Input
                  fontWeight={500}
                  variant="filled"
                  placeholder="Email"
                  value={email}
                  onSubmit={() => {
                    updateEmail(email);
                  }}
                  onChange={(e: any) => setEmail(e.target.value)}
                />

                <div className={styles.buttons}>
                  <Button colorScheme="gray" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button colorScheme="blue" onClick={() => updateEmail(email)}>
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default SettingsModal;
