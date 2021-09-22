/* eslint-disable react/jsx-key */
import React, { useState } from 'react';
import { FormControl, FormLabel, Box, Heading, Input, Button, ButtonGroup } from '@chakra-ui/react';
import Table from './table';

function Assets() {
  const [step, setStep] = useState(0);

  return (
    <div className="db">
      {step === 0 && (
        <>
          <Table
            noCheckbox
            header={['Asset', 'Balance', 'Transfer']}
            body={[
              [
                'ETH',
                '0.43098',
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path
                    opacity="0.9"
                    d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                    fill="#000"
                  ></path>
                  <path
                    d="M10.7397 16.2802C10.5497 16.2802 10.3597 16.2102 10.2097 16.0602C9.91969 15.7702 9.91969 15.2902 10.2097 15.0002L13.2097 12.0002L10.2097 9.00016C9.91969 8.71016 9.91969 8.23016 10.2097 7.94016C10.4997 7.65016 10.9797 7.65016 11.2697 7.94016L14.7997 11.4702C15.0897 11.7602 15.0897 12.2402 14.7997 12.5302L11.2697 16.0602C11.1197 16.2102 10.9297 16.2802 10.7397 16.2802Z"
                    fill="#fff"
                  ></path>
                </svg>
              ],
              [
                'USDC',
                '1.246',
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path
                    opacity="0.9"
                    d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                    fill="#000"
                  ></path>
                  <path
                    d="M10.7397 16.2802C10.5497 16.2802 10.3597 16.2102 10.2097 16.0602C9.91969 15.7702 9.91969 15.2902 10.2097 15.0002L13.2097 12.0002L10.2097 9.00016C9.91969 8.71016 9.91969 8.23016 10.2097 7.94016C10.4997 7.65016 10.9797 7.65016 11.2697 7.94016L14.7997 11.4702C15.0897 11.7602 15.0897 12.2402 14.7997 12.5302L11.2697 16.0602C11.1197 16.2102 10.9297 16.2802 10.7397 16.2802Z"
                    fill="#fff"
                  ></path>
                </svg>
              ],
              [
                'DAI',
                '2000',
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path
                    opacity="0.9"
                    d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                    fill="#000"
                  ></path>
                  <path
                    d="M10.7397 16.2802C10.5497 16.2802 10.3597 16.2102 10.2097 16.0602C9.91969 15.7702 9.91969 15.2902 10.2097 15.0002L13.2097 12.0002L10.2097 9.00016C9.91969 8.71016 9.91969 8.23016 10.2097 7.94016C10.4997 7.65016 10.9797 7.65016 11.2697 7.94016L14.7997 11.4702C15.0897 11.7602 15.0897 12.2402 14.7997 12.5302L11.2697 16.0602C11.1197 16.2102 10.9297 16.2802 10.7397 16.2802Z"
                    fill="#fff"
                  ></path>
                </svg>
              ]
            ]}
            onClick={() => setStep(1)}
          />
        </>
      )}

      {step === 1 && (
        <>
          <Heading size="md" color="orange.500" mt={4} mb={2} textAlign="center">
            DAI
          </Heading>
          <Box color="gray.900" textAlign="center">
            Balance: 0.06
          </Box>
          <Box color="gray.500" textAlign="center" mb={3}>
            Note: A miner fee will be added to transfers
          </Box>

          <FormControl id="recipient" mb={4}>
            <FormLabel>Recipient</FormLabel>
            <Input placeholder="Enter recipient’s wallet address..." type="recipient" />
          </FormControl>
          <FormControl id="amount" mb={4}>
            <FormLabel>Amount</FormLabel>
            <Input placeholder="Enter amount’s wallet address..." type="amount" />
          </FormControl>
          <FormControl id="note" mb={4}>
            <FormLabel>Note</FormLabel>
            <Input placeholder="Write an optional message" type="note" />
          </FormControl>

          <ButtonGroup>
            <Button mr="-px" colorScheme="green" onClick={() => setStep(2)}>
              Transfer
            </Button>
            <Button onClick={() => setStep(0)}>Cancel</Button>
          </ButtonGroup>
        </>
      )}

      {step === 2 && (
        <>
          <Heading size="md" mt={4} mb={2} textAlign="center">
            Transfer Total
          </Heading>
          <Box padding={5} bg="gray.200" borderRadius={15} mb={4}>
            <Box color="gray.900" textAlign="center">
              0.061 DAI
            </Box>
            <Box color="gray.500" textAlign="center">
              -0.016 USD
            </Box>
          </Box>

          <div className="d-flex justify-content-space-between align-items-center mb-1">
            <h5 className="tg-paragraph">Recipient</h5>
            <p className="db-subtitle">kjsfi3502.....jfir920384</p>
          </div>

          <div className="d-flex justify-content-space-between align-items-center mb-1">
            <h5 className="tg-paragraph">Transfer Amount</h5>
            <p className="db-subtitle">0.015 DAI</p>
          </div>

          <div className="d-flex justify-content-space-between align-items-center mb-1">
            <h5 className="tg-paragraph">Miner Fee</h5>
            <p className="db-subtitle">0.001 DAI</p>
          </div>

          <ButtonGroup>
            <Button mr="-px" colorScheme="green" onClick={() => setStep(3)}>
              Confirm
            </Button>
            <Button onClick={() => setStep(0)}>Cancel</Button>
          </ButtonGroup>
        </>
      )}

      {step === 3 && (
        <div className="confirmed">
          <div className="df">
            <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 6C2.75 7.67 2 9.75 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2C10.57 2 9.2 2.3 7.97 2.85"
                stroke="#24DB83"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              <path
                d="M15 10.38L16.12 9.25"
                stroke="#24DB83"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              <path
                d="M7.88086 12L10.6209 14.75L13.1709 12.21"
                stroke="#24DB83"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>

            <span>Confirmed!</span>
          </div>

          <div className="confetti">
            <div className="confetti-piece" />
            <div className="confetti-piece" />
            <div className="confetti-piece" />
            <div className="confetti-piece" />
            <div className="confetti-piece" />
            <div className="confetti-piece" />
            <div className="confetti-piece" />
            <div className="confetti-piece" />
            <div className="confetti-piece" />
            <div className="confetti-piece" />
            <div className="confetti-piece" />
            <div className="confetti-piece" />
            <div className="confetti-piece" />
          </div>

          <ButtonGroup justifyContent="center" mt={5} display="flex">
            <Button mr="-px" colorScheme="green" onClick={() => setStep(0)}>
              Back dashboard
            </Button>
            <Button onClick={() => setStep(0)}>Supply more!</Button>
          </ButtonGroup>
        </div>
      )}
    </div>
  );
}

export default Assets;
