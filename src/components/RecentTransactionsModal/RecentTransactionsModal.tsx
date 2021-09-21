import React from 'react';
import { useAppContext } from 'utils/context/AppContext';
import { apiGet } from 'utils/apiUtil';
import ModalDialog from 'hooks/ModalDialog';
import { Tooltip } from '@chakra-ui/tooltip';
import { CopyIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import { Box } from '@chakra-ui/layout';

import styles from './RecentTransactionsModal.module.scss';
import { Spinner } from '@chakra-ui/spinner';

const isServer = typeof window === 'undefined';
interface IProps {
  onClose: () => void;
}

const RecentTransactionsModal: React.FC<IProps> = ({ onClose }: IProps) => {
  const { user, showAppError, showAppMessage } = useAppContext();
  const [isLoading, setIsLoading] = React.useState(false);
  const [data, setData] = React.useState([]);

  const fetchData = async () => {
    setIsLoading(true);
    const { result, error } = await apiGet(`/u/${user?.account}/wyvern/v1/txns`);
    if (error) {
      showAppError(error?.message);
    } else {
      setData(result?.listings || []);
    }
    setIsLoading(false);
    // console.log('result', result);
  };
  React.useEffect(() => {
    fetchData();
  }, [user]);

  return (
    <>
      {!isServer && (
        <ModalDialog onClose={onClose}>
          <div
            className={`modal ${'ntfmodal'} ${styles.modal}`}
            style={{ background: 'white', borderColor: 'white', width: '60vw' }}
          >
            <div className="modal-body">
              <div className={styles.title}>Transactions</div>

              {isLoading ? (
                <Spinner />
              ) : data?.length === 0 ? (
                <Box mt={6}>No Item To Display.</Box>
              ) : (
                <section className="container container-fluid grid">
                  <div className={`col-md-12 col-sm-12 ${styles.txnRow}`}>
                    <span>
                      <strong>Time</strong>
                    </span>
                    <span>
                      <strong>Txn Hash</strong>
                    </span>
                  </div>

                  {data.map((item: any) => {
                    return (
                      <div key={item.txnHash} className={`col-md-12 col-sm-12 ${styles.txnRow}`}>
                        <span>{`${new Date(item.createdAt).toLocaleString()}`}</span>
                        <span>
                          {item.txnHash}{' '}
                          <i className={styles.extLink}>
                            <Tooltip label={'Open Etherscan Link'} placement="top" hasArrow>
                              <ExternalLinkIcon
                                onClick={() => {
                                  window.open(`https://etherscan.io/address/${item.txnHash}`, '_blank');
                                }}
                              />
                            </Tooltip>{' '}
                          </i>
                          <i className={styles.extLink}>
                            <Tooltip label={'Open Etherscan Link'} placement="top" hasArrow>
                              <CopyIcon
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigator.clipboard.writeText(item.txnHash);
                                  showAppMessage(`Copied to Clipboard.`);
                                }}
                              />
                            </Tooltip>{' '}
                          </i>
                        </span>
                      </div>
                    );
                  })}
                </section>
              )}

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
