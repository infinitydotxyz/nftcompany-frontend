import React from 'react';
import { Input } from '@chakra-ui/react';
import { Button } from '@chakra-ui/button';
import { Spinner } from '@chakra-ui/spinner';
import { getEthersProvider, getOpenSeaportForChain } from 'utils/ethersUtil';
import { useAppContext } from 'utils/context/AppContext';
import styles from './TransferNFTModal.module.scss';
import ModalDialog from 'components/ModalDialog/ModalDialog';
import { isServer } from 'utils/commonUtil';
import { Asset } from 'components/ListNFTModal/listNFT';
import { CardData, WyvernSchemaName } from 'types/Nft.interface';
import { ethers } from 'ethers';

interface IProps {
  data?: CardData;
  onClickMakeOffer?: (nftLink: string, price: number) => void;
  onClickBuyNow?: (nftLink: string, price: number) => void;
  onClose: () => void;
}

const TransferNFTModal: React.FC<IProps> = ({ data, onClose }: IProps) => {
  const { user, showAppError, showAppMessage } = useAppContext();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [transferTo, setTransferTo] = React.useState('');

  const onClickTransferNFT = async () => {
    if (!transferTo) {
      showAppError('Please enter an address to transfer to.');
      return;
    }
    if (!user?.account) {
      showAppError('Please login.');
      return;
    }

    let fromAddress = user.account;
    let toAddress = transferTo;

    if (fromAddress.endsWith('.eth')) {
      const provider = getEthersProvider();
      fromAddress = await provider.resolveName(fromAddress);
    }

    if (toAddress.endsWith('.eth')) {
      const provider = getEthersProvider();
      toAddress = await provider.resolveName(toAddress);
    }

    const isFromAddress = ethers.utils.isAddress(fromAddress);
    const isToAddress = ethers.utils.isAddress(toAddress);

    if (!isFromAddress) {
      showAppError(`Invalid user address: ${fromAddress}.`);
      return;
    }

    if (!isToAddress) {
      showAppError(`Invalid transfer to address: ${toAddress}.`);
      return;
    }

    if (!data?.tokenAddress || !data?.tokenId || !data?.schemaName) {
      showAppError('Failed to get NFT data');
      return;
    }

    if (fromAddress === toAddress) {
      showAppError('From address is the same as to address.');
      return;
    }

    let err = null;

    try {
      setIsSubmitting(true);

      const asset: Asset = {
        tokenAddress: data?.tokenAddress,
        tokenId: data?.tokenId,
        schemaName: data?.schemaName as WyvernSchemaName,
        name: undefined
      };

      const quantity: number = 1;

      const transferAsset = async (fromAddress: string, toAddress: string, asset: Asset, quantity: number) => {
        const seaport = getOpenSeaportForChain(data.chainId);

        const isTransferrable = await seaport.isAssetTransferrable({ asset, fromAddress, toAddress, quantity });
        if (!isTransferrable) {
          showAppError('Asset is not transferrable.');
          return;
        }

        await seaport.transfer({ fromAddress, toAddress, asset, quantity });
      };

      await transferAsset(fromAddress, toAddress, asset, quantity);
    } catch (e: any) {
      setIsSubmitting(false);
      err = e;
      console.error('ERROR: ', e);
      showAppError(e.message);
    }
    if (!err) {
      setIsSubmitting(false);
      showAppMessage('NFT transferred!');
      onClose();
    }
  };

  return (
    <>
      {!isServer() && (
        <ModalDialog onClose={onClose}>
          <div>
            <div className={styles.title}>Transfer NFT</div>
            <div className={styles.row}>
              <div className={styles.fields}>
                <div className={styles.left}>Address or ENS name to transfer to</div>
              </div>
              <div className={styles.fields}>
                <div className={styles.left}>
                  <Input
                    type="text"
                    autoFocus
                    id="transfer-to-address"
                    onChange={(ev) => setTransferTo(ev.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className={styles.buttons}>
              <Button disabled={isSubmitting} onClick={onClickTransferNFT}>
                Transfer NFT
              </Button>

              <Button disabled={isSubmitting} onClick={() => onClose && onClose()}>
                Cancel
              </Button>

              {isSubmitting && <Spinner size="md" color="teal" ml={4} />}
            </div>
          </div>
        </ModalDialog>
      )}
    </>
  );
};

export default TransferNFTModal;
