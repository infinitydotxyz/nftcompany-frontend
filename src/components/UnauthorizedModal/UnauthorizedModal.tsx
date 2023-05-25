import { Button } from '@chakra-ui/button';
import { Text, Modal, ModalOverlay, ModalContent, ModalBody, ModalFooter, propNames } from '@chakra-ui/react';

interface UnauthorizedModalProps {
  onClose: () => void;
  isOpen: boolean;
  message: string;
}

function UnauthorizedModal({ onClose, isOpen, message }: UnauthorizedModalProps) {
  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered={true}>
      <ModalOverlay
        backgroundColor={'#00000080'}
        color="yellow"
        opacity={'0.2'}
        height="100%"
        width={'100vw!important'}
        view
        backdropFilter={'blur(40px)'}
      />
      <ModalContent>
        <ModalBody>
          <Text>{message}</Text>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default UnauthorizedModal;
