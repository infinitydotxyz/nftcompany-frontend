/* eslint-disable react/display-name */
/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
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
  onClose?: () => void;
}

const NFTModal: React.FC<IProps> = ({ title, id, address, brandColor, bgColor, active, onClose }: IProps) => {
  return (
    <>
      {!isServer && (
        <Modal
          brandColor={brandColor}
          isActive={true}
          onClose={onClose}
          activator={({ setShow }: any) => (
            <div onClick={() => setShow(true)} className={'nftholder'}>
              &nbsp;
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

export default NFTModal;
