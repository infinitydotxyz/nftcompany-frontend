import { Box } from '@chakra-ui/layout';
import { Table, Text } from '@chakra-ui/react';
import ToggleTab, { useToggleTab } from 'components/ToggleTab/ToggleTab';
import Layout from 'containers/layout';
import { NextPage } from 'next';
import Head from 'next/head';

enum Period {
  Hour
}

export default function Discover() {
  const { options, onChange, selected } = useToggleTab(['1 hr', '12 hrs', '1 day', '7 day', '30 days'], '12 hrs');

  return (
    <>
      <Head>
        <title>Explore</title>
      </Head>

      <div className="page-container">
        {/* {!searchMode && <FeaturedCollections />} */}

        <Box display="flex" flexDirection={'column'} justifyContent={'flex-start'} marginTop={'80px'}>
          <Box display="flex" flexDirection={'row'} justifyContent={'flex-start'} alignItems={'center'}>
            <Text size="lg" paddingBottom={'4px'}>
              Period:
            </Text>
            <ToggleTab options={options} selected={selected} onChange={onChange} size="sm" />
          </Box>

          <Table></Table>
        </Box>
      </div>
    </>
  );
}

// eslint-disable-next-line react/display-name
Discover.getLayout = (page: NextPage) => <Layout>{page}</Layout>;
