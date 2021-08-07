import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Layout from 'containers/layout';
import { Select } from '@chakra-ui/react';
import CardList from 'components/Card/CardList';
import styles from '../../styles/Dashboard.module.scss';

export default function Preview() {
  const [tabIndex, setTabIndex] = React.useState(1);

  const title = React.useMemo(() => {
    switch (tabIndex) {
      case 1:
        return 'Preview';
        break;

      default:
        break;
    }
  }, [tabIndex]);

  return (
    <>
      <Head>
        <title>Preview page</title>
      </Head>
      <div className={styles.dashboard}>
        <div className="container container-fluid">
          <div className="section-bar">
            <div className="right">
              <div className="tg-title">{title}</div>
            </div>

            <div className="center">
              {/* Center */}
            </div>

            <div className="left">
              <Select
                placeholder="Filter..."
                fontWeight={500}
                lineHeight={'40px'}
                borderRadius={40}
                colorScheme="blackAlpha"
              >
                <option value="option1">New items</option>
                <option value="option2">Great Items</option>
              </Select>
            </div>
          </div>

          <CardList
            data={[
              { id: '1', title: 'Card 1' }
            ]}
          />

        </div>
      </div>
    </>
  );
}

// eslint-disable-next-line react/display-name
Preview.getLayout = (page: NextPage) => <Layout>{page}</Layout>;
