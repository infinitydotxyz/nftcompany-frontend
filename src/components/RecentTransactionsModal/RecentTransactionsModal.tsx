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
  const [data, setData] = React.useState([]);

  const fetchData = async () => {
    const { result, error } = await apiGet(`/u/${user?.account}/wyvern/v1/pendingtxns`);
    if (error) {
      showAppError(error?.message);
    } else {
      setData(result?.listings || []);
    }
    console.log('result', result);
  };
  React.useEffect(() => {
    fetchData();
  }, [user]);

  return (
    <>
      {!isServer && (
        <ModalDialog onClose={onClose}>
          <div className={`modal ${'ntfmodal'}`} style={{ background: 'white', borderColor: 'white', width: '50vw' }}>
            <div className="modal-body">
              <div className={styles.title}>Pending Transactions</div>

              <section className="container container-fluid grid">
                <div className={`col-md-12 ${styles.txnRow}`}>
                  <span><strong>Time</strong></span>
                  <span><strong>Txn Hash</strong></span>
                </div>
                {data.map((item: any) => {
                  return (
                    <div className={`col-md-12 ${styles.txnRow}`}>
                      <span>{`${new Date(item.createdAt).toLocaleString()}`}</span>
                      <span>{item.txnHash}</span>
                    </div>
                  );
                })}
              </section>

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
