import React from 'react';
import dynamic from 'next/dynamic';
import { useToast } from '@chakra-ui/react';
import { apiDelete } from 'utils/apiUtil';
import { showMessage } from 'utils/commonUtil';
import styles from './DeleteListingModal.module.scss';

const Modal = dynamic(() => import('hooks/useModal'));
const isServer = typeof window === 'undefined';

interface IProps {
  user?: any;
  data?: any;
  onSubmit?: () => void;
  onClose?: () => void;
}

const DeleteListingModal: React.FC<IProps> = ({ user, data, onSubmit, onClose }: IProps) => {
  const toast = useToast();

  React.useEffect(() => {
    // TBD
  }, []);

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
              <div className={styles.title}>&nbsp;</div>

              <div className={styles.row}>
                Confirm delete this listing?
              </div>

              <div className={styles.footer}>
                <a
                  className="action-btn"
                  onClick={async () => {
                    await apiDelete(`/u/${user.account}/listings/${data.id}`, {
                      maker: data?.maker,
                      tokenAddress: data?.tokenAddress,
                      hasBonusReward: data?.metadata?.hasBonusReward
                    });
                    onSubmit && onSubmit();
                  }}
                >
                  &nbsp;&nbsp;&nbsp; Confirm &nbsp;&nbsp;&nbsp;
                </a>

                <a className="action-btn action-2nd" onClick={() => onClose && onClose()}>
                  Cancel
                </a>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default DeleteListingModal;
