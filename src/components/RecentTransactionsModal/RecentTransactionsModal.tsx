import React from 'react';
import dynamic from 'next/dynamic';
import { CardData } from 'types/Nft.interface';
import { useAppContext } from 'utils/context/AppContext';
import { getOpenSeaport } from 'utils/ethersUtil';
import { apiGet, apiPost } from 'utils/apiUtil';
import { GenericError } from 'types';
import ModalDialog from 'hooks/ModalDialog';
import styles from './RecentTransactionsModal.module.scss';

const Modal = dynamic(() => import('hooks/useModal'));
const isServer = typeof window === 'undefined';
interface IProps {
  onClose: () => void;
}

const RecentTransactionsModal: React.FC<IProps> = ({ onClose }: IProps) => {
  const { user, showAppError } = useAppContext();

  const fetchData = async () => {
    const { result, error } = await apiGet(`/u/${user?.account}/wyvern/v1/pendingtxns`);
    if (error) {
      showAppError(error?.message);
    }
    console.log('result', result)
  }
  React.useEffect(() => {
    fetchData();
  }, [user])

  return (
    <>
      {!isServer && (
        <ModalDialog onClose={onClose}>
          <div className={`modal ${'ntfmodal'}`} style={{ background: 'white', borderColor: 'white' }}>
            <div className="modal-body">
              <div className={styles.title}>Pending Transactions</div>

              <div className={styles.space}>More...</div>

              {/* <div className={styles.row}>
                <ul>
                  <li>
                    <div>Price</div>
                    <div>
                      <span>{data.price}</span>
                    </div>
                    <div>ETH</div>
                  </li>
                </ul>
              </div> */}

              <div className={styles.footer}>
                <a className="action-btn" onClick={() => onClose && onClose()}>
                  Close
                </a>
              </div>
            </div>
          </div>
        </ModalDialog>
      )}
    </>
  );
};

export default RecentTransactionsModal;
