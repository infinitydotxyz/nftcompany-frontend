// toast = useToast() - import { useToast } from '@chakra-ui/react';
export const showMessage = (toast: any, type: 'error' | 'info', message: string) =>
  toast({
    title: type === 'error' ? 'Error' : 'Info',
    description: message,
    status: type === 'error' ? 'error' : 'success',
    duration: type === 'error' ? 9000 : 3000,
    isClosable: true
  });
