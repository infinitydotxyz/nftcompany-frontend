import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Layout from 'containers/layout';
import styles from './Transactions.module.scss';
import { Button } from '@chakra-ui/react';
import { TransactionsTable } from 'components/TransactionsTable/TransactionsTable';
import { useAppContext } from 'utils/context/AppContext';
import { apiGet } from 'utils/apiUtil';
import { TransactionCardEntry } from 'types/rewardTypes';
import LoadingCardList from 'components/LoadingCardList/LoadingCardList';
import CheckTransactionModal from 'components/CheckTransactionModal/CheckTransactionModal';

const Transactions = (): JSX.Element => {
  const { user, showAppError, showAppMessage } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);
  const [transactionsModalShowed, setTransactionsModalShowed] = useState(false);

  const [data, setData] = useState<TransactionCardEntry[]>([]);

  const fetchData = async () => {
    if (!user || !user?.account) {
      return;
    }

    const { result, error } = await apiGet(`/u/${user?.account}/wyvern/v1/txns`);
    if (error) {
      showAppError(error?.message);
    } else {
      setData(result?.listings || []);
    }

    setIsLoading(false);
    console.log('result', result);
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  return (
    <>
      <Head>
        <title>Transactions</title>
      </Head>
      <div className={styles.main}>
        <div className="page-container">
          <div className="section-bar">
            <div className="tg-title">Transactions</div>

            <Button variant="outline" onClick={() => setTransactionsModalShowed(true)} disabled={isLoading}>
              Missing txn?
            </Button>
          </div>
          {isLoading && <LoadingCardList />}

          <TransactionsTable entries={data} />
        </div>

        {transactionsModalShowed && <CheckTransactionModal onClose={() => setTransactionsModalShowed(false)} />}
      </div>
    </>
  );
};

// eslint-disable-next-line react/display-name
Transactions.getLayout = (page: NextPage) => <Layout>{page}</Layout>;
export default Transactions;
