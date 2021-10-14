import React from 'react';
import { useAppContext } from 'utils/context/AppContext';
import { apiGet } from 'utils/apiUtil';
import ModalDialog from 'components/ModalDialog/ModalDialog';
import { Tooltip } from '@chakra-ui/tooltip';
import { CopyIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import { Box } from '@chakra-ui/layout';

import styles from './RecentTransactionsModal.module.scss';
import { Spinner } from '@chakra-ui/spinner';
import { ellipsisString } from 'utils/commonUtil';
import { Button } from '@chakra-ui/react';
import { CopyButton } from 'components/CopyButton/CopyButton';

const isServer = typeof window === 'undefined';
interface IProps {
  onClose: () => void;
}

const RecentTransactionsModal: React.FC<IProps> = ({ onClose }: IProps) => {
  const { user, showAppError, showAppMessage } = useAppContext();
  const [isLoading, setIsLoading] = React.useState(false);
  const [data, setData] = React.useState([]);

  const fetchData = async () => {
    if (!user || !user?.account) {
      return;
    }
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
          <div className={styles.modal}>
            <div className={styles.title}>Transactions</div>

            {isLoading ? (
              <Spinner />
            ) : data?.length === 0 ? (
              <Box mt={6}>Nothing to show.</Box>
            ) : (
              <section className={styles.tableGrid}>
                <div className={`col-md-12 col-sm-12 ${styles.txnRow}`}>
                  <span>
                    <strong>Time</strong>
                  </span>
                  <span>
                    <strong>Txn Hash</strong>
                  </span>
                  <span>
                    <strong>Action</strong>
                  </span>
                  <span>
                    <strong>Status</strong>
                  </span>
                </div>

                {data.map((item: any) => {
                  return (
                    <div key={item.txnHash} className={`col-md-12 col-sm-12 ${styles.txnRow}`}>
                      <span>{`${new Date(item.createdAt).toLocaleString()}`}</span>
                      <span>
                        {ellipsisString(item.txnHash)}{' '}
                        <i className={styles.extLink}>
                          <CopyButton copyText={item.txnHash} tooltip="Copy Txn Hash" />
                        </i>
                        <i className={styles.extLink}>
                          <Tooltip label={'Open Etherscan Link'} placement="top" hasArrow>
                            <ExternalLinkIcon
                              color="brandBlue"
                              onClick={() => {
                                window.open(`https://etherscan.io/tx/${item.txnHash}`, '_blank');
                              }}
                            />
                          </Tooltip>
                        </i>
                      </span>
                      <span>{`${item.actionType}`}</span>
                      <span>{`${item.status}`}</span>
                    </div>
                  );
                })}
              </section>
            )}

            <div className={styles.buttons}>
              <Button onClick={() => onClose && onClose()}>Close</Button>
            </div>
          </div>
        </ModalDialog>
      )}
    </>
  );
};

export default RecentTransactionsModal;
