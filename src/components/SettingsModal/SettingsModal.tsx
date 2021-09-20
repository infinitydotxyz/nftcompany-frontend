import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import styles from './SettingsModal.module.scss';
import { useAppContext } from 'utils/context/AppContext';
import { apiGet, apiPost } from 'utils/apiUtil';
import { Button, Input, Link } from '@chakra-ui/react';
const Modal = dynamic(() => import('hooks/useModal'));
const isServer = typeof window === 'undefined';

interface Props {
  onClose: () => void;
}

const SettingsModal: React.FC<Props> = ({ onClose }: Props) => {
  const [email, setEmail] = useState('');
  const [showSubscribeSection, setShowSubscribeSection] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const { user, showAppError } = useAppContext();

  const updateEmail = async (email: string) => {
    if (user != null && email?.length > 0) {
      const response = await apiPost(`/u/${user?.account}/setEmail`, null, { email: email });

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

    // we can't check email below since setEmail is async
    const emailFromServer = result?.address ?? '';

    setEmail(emailFromServer);
    setSubscribed(result?.subscribed ?? false);

    // we don't show subscribe/unsubscribe if they don't have an email set on the server
    setShowSubscribeSection(emailFromServer?.length > 0);
  };

  React.useEffect(() => {
    getEmail();
  }, [user]);

  const toggleSubscribe = async () => {
    const response = await apiPost(`/u/${user?.account}/subscribeEmail`, null, { subscribe: !subscribed });

    if (response.status == 200) {
      // refresh
      getEmail();
    }
  };

  const _subscribeSection = showSubscribeSection ? (
    <div className={styles.subscribe}>
      <div>
        <Link color="blue.500" onClick={toggleSubscribe}>
          {subscribed ? 'Unsubscribe' : 'Subscribe'}
        </Link>
        {` if you ${subscribed ? 'do not' : ''} want to receive emails about your account activity.`}
      </div>
    </div>
  ) : null;

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
          <div className={`modal ${'ntfmodal'}`} style={{ background: 'white', borderColor: 'white' }}>
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

                {_subscribeSection}

                <div className={styles.buttons}>
                  <Button colorScheme="blue" onClick={() => updateEmail(email)}>
                    Save
                  </Button>
                  <Button colorScheme="gray" onClick={onClose}>
                    Cancel
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
