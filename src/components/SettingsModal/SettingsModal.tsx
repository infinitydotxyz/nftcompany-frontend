import React, { useState } from 'react';
import styles from './SettingsModal.module.scss';
import { useAppContext } from 'utils/context/AppContext';
import { apiGet, apiPost } from 'utils/apiUtil';
import { IconButton, Button, FormControl, Input, Link, Box, FormLabel } from '@chakra-ui/react';
import { CopyIcon } from '@chakra-ui/icons';
import validator from 'validator';
import ModalDialog from 'hooks/ModalDialog';

const isServer = typeof window === 'undefined';

interface Props {
  onClose: () => void;
}

const SettingsModal: React.FC<Props> = ({ onClose }: Props) => {
  const [email, setEmail] = useState('');
  const [emailInvalid, setEmailInvalid] = useState(true);
  const [showSubscribeSection, setShowSubscribeSection] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const { user, showAppError, showAppMessage } = useAppContext();

  const saveEmail = async () => {
    if (user != null && email?.length > 0 && !emailInvalid) {
      const response = await apiPost(`/u/${user?.account}/setEmail`, null, { email: email });

      if (response.status == 200) {
        onClose();
      } else {
        showAppError('An error occured');
      }
    } else {
      showAppError('Email is invalid');
    }
  };

  const updateEmail = async (newEmail: string) => {
    if (newEmail && newEmail.length > 0) {
      setEmailInvalid(!validator.isEmail(newEmail));
    } else {
      setEmailInvalid(false);
    }

    setEmail(newEmail);
  };

  const getEmail = async () => {
    if (!user || !user?.account) {
      updateEmail('');
      return;
    }

    const { result, error } = await apiGet(`/u/${user?.account}/getEmail`);
    if (error) {
      showAppError(`${error.message}`);
      return;
    }

    // we can't check email below since setEmail is async
    const emailFromServer = result?.address ?? '';

    updateEmail(emailFromServer);
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
        <Link color="brandBlue" onClick={toggleSubscribe}>
          {subscribed ? 'Unsubscribe' : 'Subscribe'}
        </Link>
        {` if you ${subscribed ? 'do not' : ''} want to receive emails about your account activity.`}
      </div>
    </div>
  ) : null;

  let shortAddress = user!.account;
  shortAddress = `${shortAddress.slice(0, 8)}...${shortAddress.slice(-8)}`;

  const displayUrl = `${window.origin}/${shortAddress}`;

  let content = null;
  if (user?.account) {
    content = (
      <>
        <FormControl isInvalid={emailInvalid}>
          <FormLabel>Share your user page</FormLabel>
          <div className={styles.addressLink}>
            <Link className={styles.address} href={`/${user!.account}`}>
              {displayUrl}
            </Link>
            <Box flex={1} />
            <IconButton
              isActive={false}
              aria-label="Copy"
              className={styles.button}
              icon={<CopyIcon />}
              onClick={(e) => {
                e.stopPropagation();
                if (user?.account) {
                  navigator.clipboard.writeText(user!.account);

                  showAppMessage(`Copied to Clipboard.`);
                }
              }}
            />
          </div>
        </FormControl>

        <FormControl isInvalid={emailInvalid}>
          <FormLabel>Email address</FormLabel>
          <Input
            fontWeight={500}
            type="email"
            placeholder="Email"
            value={email}
            onSubmit={() => {
              saveEmail();
            }}
            onChange={(e: any) => updateEmail(e.target.value)}
          />
        </FormControl>

        {_subscribeSection}
      </>
    );
  }

  return (
    <>
      {!isServer && (
        <ModalDialog onClose={onClose}>
          <div className={`modal ${'ntfmodal'}`} style={{ background: 'white', borderColor: 'white' }}>
            <div className="modal-body">
              <div className={styles.main}>
                <div className={styles.title}>Account</div>

                {content}
                <div className={styles.buttons}>
                  <Button onClick={() => saveEmail()}>Save</Button>
                  <Button colorScheme="gray" onClick={onClose}>
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </ModalDialog>
      )}
    </>
  );
};

export default SettingsModal;
