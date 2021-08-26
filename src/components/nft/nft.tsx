/* eslint-disable react/display-name */
/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { Tab, TabList, TabPanel, TabPanels, Tabs, Spinner } from '@chakra-ui/react';

const Modal = dynamic(() => import('hooks/useModal'));
const Dashboard = dynamic(() => import('./dashboard'), { loading: () => <Spinner size="md" color="gray.800" /> });
const Supply = dynamic(() => import('./supply'), { loading: () => <Spinner size="md" color="gray.800" /> });
const Borrow = dynamic(() => import('./borrow'), { loading: () => <Spinner size="md" color="gray.800" /> });
const Assets = dynamic(() => import('./assets'), { loading: () => <Spinner size="md" color="gray.800" /> });
const isServer = typeof window === 'undefined';

interface IProps {
  title: string;
  id: string;
  address: string;
  brandColor: string;
  bgColor: string;
  active?: boolean;
}

const NFT: React.FC<IProps> = ({ title, id, address, brandColor, bgColor, active }: IProps) => {
  const router = useRouter();
  return (
    <>
      {!isServer && (
        <Modal
          brandColor={brandColor}
          isActive={active}
          activator={({ setShow }: any) => (
            <div className={'nftholder'} onClick={() => router.push('/preview?id=0&view=info')}>
              <h3 className={'title'} style={{ color: brandColor }}>
                {title}
              </h3>
              <div className={'nft'} style={{ background: bgColor, borderColor: brandColor }}>
                <div className={'image'}>
                  <Image width={273} height={318} src="/img/nfts/placeholder.png" alt={title} />
                </div>

                <div
                  className={'padd'}
                  onClick={(ev) => {
                    ev.preventDefault();
                    ev.stopPropagation();
                    setShow(true);
                  }}
                >
                  <div className={'label'} style={{ background: brandColor }}>
                    Buy <b>{title}</b>
                  </div>

                  <div className={'cols'}>
                    <div className={'qr'}>
                      <img src="/img/nfts/qr.png" alt={'qrcode'} />
                    </div>
                    <div className={'info'}>
                      {id && (
                        <>
                          <h5 className={'data'}>{id}</h5>
                          <p className={'meta'}>NFT ID</p>
                        </>
                      )}
                      {address && (
                        <>
                          <h5 className={'data'}>{address}</h5>
                          <p className={'meta'}>Address</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        >
          <div className={`modal ${'ntfmodal'}`} style={{ background: bgColor, borderColor: brandColor }}>
            <div className="modal-body">
              <div className={'label'}>
                <b>{title}</b>
              </div>

              <Tabs variant="soft-rounded" colorScheme="blackAlpha" mt={3}>
                <TabList>
                  <Tab>Dashboard</Tab>
                  <Tab>Supply</Tab>
                  <Tab>Borrow</Tab>
                  <Tab>Assets</Tab>
                </TabList>

                <div className={'ntfmodalBody'}>
                  <TabPanels>
                    <TabPanel>
                      <Dashboard />
                    </TabPanel>
                    <TabPanel>
                      <Supply />
                    </TabPanel>
                    <TabPanel>
                      <Borrow />
                    </TabPanel>
                    <TabPanel>
                      <Assets />
                    </TabPanel>
                  </TabPanels>
                </div>
              </Tabs>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default NFT;
