// toast = useToast() - import { useToast } from '@chakra-ui/react';
export const showMessage = (toast: any, type: 'success' | 'error' | 'warning' | 'info', message: string) => {
  console.error('*** this showMessage() is deprecated => use "showAppMessage" or "showAppError" from AppContext')
  toast({
    title: type === 'error' ? 'Error' : 'Info',
    description: message,
    status: type,
    duration: type === 'error' ? 10000 : 4000,
    isClosable: true
  });
}
