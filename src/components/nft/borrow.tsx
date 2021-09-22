import {
  Box,
  Button,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  SimpleGrid,
  ButtonGroup
} from '@chakra-ui/react';
import React, { useState } from 'react';
import Table from './table';

function Borrow() {
  const [step, setStep] = useState(0);
  const [val, setValue] = useState<any>(0);

  return (
    <div className="db">
      <div className="d-flex justify-content-space-between align-items-center mb-1">
        <h5 className="db-title d-flex align-items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M17 4H7C4 4 2 5.5 2 9V12.56C2 12.93 2.38 13.16 2.71 13.01C3.69 12.56 4.82 12.39 6.01 12.6C8.64 13.07 10.57 15.51 10.5 18.18C10.49 18.6 10.43 19.01 10.32 19.41C10.24 19.72 10.49 20.01 10.81 20.01H17C20 20.01 22 18.51 22 15.01V9C22 5.5 20 4 17 4ZM12 14.5C10.62 14.5 9.5 13.38 9.5 12C9.5 10.62 10.62 9.5 12 9.5C13.38 9.5 14.5 10.62 14.5 12C14.5 13.38 13.38 14.5 12 14.5ZM19.25 14C19.25 14.41 18.91 14.75 18.5 14.75C18.09 14.75 17.75 14.41 17.75 14V10C17.75 9.59 18.09 9.25 18.5 9.25C18.91 9.25 19.25 9.59 19.25 10V14Z"
              fill="#27AE60"
            ></path>
            <path
              d="M5 14C3.75 14 2.62 14.59 1.89 15.49C1.33 16.18 1 17.05 1 18C1 20.21 2.8 22 5 22C6.74 22 8.23 20.89 8.77 19.33C8.92 18.92 9 18.47 9 18C9 15.8 7.21 14 5 14ZM7.36 19.74C7.34 19.8 7.3 19.86 7.26 19.9L6.54 20.61C6.45 20.71 6.33 20.75 6.2 20.75C6.07 20.75 5.94 20.71 5.85 20.61C5.69 20.46 5.67 20.22 5.77 20.04H3.76C3.12 20.04 2.6 19.52 2.6 18.87V18.77C2.6 18.49 2.82 18.28 3.09 18.28C3.36 18.28 3.58 18.49 3.58 18.77V18.87C3.58 18.98 3.66 19.07 3.77 19.07H5.78C5.68 18.88 5.7 18.65 5.86 18.49C6.05 18.3 6.36 18.3 6.54 18.49L7.26 19.21C7.3 19.25 7.34 19.31 7.37 19.37C7.41 19.48 7.41 19.62 7.36 19.74ZM7.4 17.23C7.4 17.51 7.18 17.72 6.91 17.72C6.64 17.72 6.42 17.51 6.42 17.23V17.13C6.42 17.02 6.34 16.93 6.23 16.93H4.23C4.33 17.12 4.31 17.35 4.15 17.51C4.06 17.6 3.94 17.65 3.8 17.65C3.68 17.65 3.55 17.6 3.46 17.51L2.74 16.79C2.7 16.75 2.66 16.69 2.63 16.63C2.59 16.51 2.59 16.38 2.63 16.26C2.66 16.21 2.69 16.14 2.74 16.1L3.46 15.39C3.65 15.19 3.96 15.19 4.14 15.39C4.3 15.54 4.32 15.78 4.22 15.96H6.23C6.87 15.96 7.39 16.48 7.39 17.13V17.23H7.4Z"
              fill="#27AE60"
            ></path>
          </svg>
          <Box pl={2} mb={-1}>
            {step === 0 && 'Borrow Balance'}
            {step === 1 && 'Currently Borrowing'}
            {step === 2 && 'Borrow Balance'}
            {step === 3 && 'Currently Borrowing'}
            {step === 4 && 'Currently Borrowing'}
          </Box>
        </h5>
        <p className="db-subtitle">123.45 ETH</p>
      </div>

      {step === 0 && (
        <>
          <Table
            header={['Asset', 'Balance', 'APY', 'Collateral']}
            body={[
              ['ETH', '0.43098', '0.01%'],
              ['ETH', '0.43098', '0.01%']
            ]}
            onClick={() => setStep(1)}
          />

          <Table
            title="All Markets"
            body={[
              ['ETH', '0.43098', '0.01%'],
              ['ETH', '0.43098', '0.01%']
            ]}
            onClick={() => setStep(1)}
          />
        </>
      )}

      {step === 1 && (
        <>
          <SimpleGrid mt={4} columns={2} spacing={5}>
            <Button
              bg="blackAlpha.900"
              _hover={{ bg: 'blue.500' }}
              boxShadow="lg"
              color="whiteAlpha.900"
              size="lg"
              width={'100%'}
              borderRadius={'lg'}
              onClick={() => setStep(1)}
            >
              Borrow
            </Button>

            <Button
              width={'100%'}
              bg="blackAlpha.200"
              boxShadow="lg"
              color="blue.500"
              size="lg"
              borderRadius={'lg'}
              onClick={() => setStep(2)}
            >
              Repay
            </Button>
          </SimpleGrid>

          <Heading size="sm" my={4} textAlign="center">
            Ether
          </Heading>

          <InputGroup mb={3}>
            <InputLeftElement pointerEvents="none" color="gray.300" fontSize="1.2em">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M15.4998 15.75C15.3198 15.75 15.1198 15.74 14.9398 15.73C14.5698 15.71 14.2697 15.41 14.2397 15.04C14.0197 12.25 11.7498 9.98999 8.96976 9.76999C8.59976 9.73999 8.29975 9.44001 8.27975 9.07001C8.26975 8.89001 8.25977 8.69001 8.25977 8.51001C8.25977 4.51001 11.5098 1.26001 15.5098 1.26001C19.5098 1.26001 22.7598 4.51001 22.7598 8.51001C22.7598 12.51 19.4998 15.75 15.4998 15.75ZM9.74976 8.35999C12.7298 8.88999 15.1198 11.27 15.6398 14.25C18.7498 14.17 21.2498 11.63 21.2498 8.5C21.2498 5.33 18.6698 2.75 15.4998 2.75C12.3798 2.75 9.82976 5.24999 9.74976 8.35999Z"
                  fill="#292D32"
                ></path>
                <path
                  d="M8.5 22.75C4.5 22.75 1.25 19.5 1.25 15.5C1.25 11.5 4.5 8.25 8.5 8.25C8.68 8.25 8.88 8.25999 9.06 8.26999C12.59 8.54999 15.45 11.41 15.72 14.92C15.73 15.12 15.74 15.32 15.74 15.5C15.75 19.5 12.5 22.75 8.5 22.75ZM8.5 9.75C5.33 9.75 2.75 12.33 2.75 15.5C2.75 18.67 5.33 21.25 8.5 21.25C11.67 21.25 14.25 18.67 14.25 15.5C14.25 15.34 14.24 15.18 14.23 15.02C14.01 12.25 11.74 9.98001 8.95999 9.76001C8.81999 9.76001 8.66 9.75 8.5 9.75Z"
                  fill="#292D32"
                ></path>
                <path
                  d="M8.5 18.75C8.23 18.75 7.97 18.6 7.84 18.36L7.06 16.94L5.64001 16.16C5.40001 16.03 5.25 15.78 5.25 15.5C5.25 15.22 5.40001 14.97 5.64001 14.84L7.06 14.06L7.84 12.64C8.1 12.16 8.89 12.16 9.16 12.64L9.94 14.06L11.36 14.84C11.6 14.97 11.75 15.22 11.75 15.5C11.75 15.78 11.6 16.03 11.36 16.16L9.94 16.94L9.16 18.36C9.03 18.6 8.77 18.75 8.5 18.75ZM7.56 15.5L7.97 15.73C8.1 15.8 8.19999 15.9 8.26999 16.03L8.5 16.44L8.73001 16.03C8.80001 15.9 8.9 15.8 9.03 15.73L9.44 15.5L9.03 15.27C8.9 15.2 8.80001 15.1 8.73001 14.97L8.5 14.56L8.26999 14.97C8.19999 15.1 8.1 15.2 7.97 15.27L7.56 15.5Z"
                  fill="#292D32"
                ></path>
              </svg>
            </InputLeftElement>
            <Input
              fontWeight={500}
              variant="filled"
              placeholder="Enter amount ETH ..."
              value={val > 0 ? val : ''}
              onChange={(e: any) => setValue(e.target.value)}
            />
            <InputRightElement>
              <Button mr={1} colorScheme="blue" onClick={() => setValue(123.4)} h="1.75rem" size="sm">
                Max
              </Button>
            </InputRightElement>
          </InputGroup>
          {/* <FormHelperText color="red.500">Invalid Amount.</FormHelperText> */}

          <h4 className="db-title mb-2">Supply rates</h4>

          <div className="d-flex justify-content-space-between align-items-center mb-1">
            <h5 className="tg-paragraph">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                style={{ display: 'inline-block', marginRight: '.25em' }}
              >
                <path
                  d="M4.02 5.97C2.75 7.65 2 9.74 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2"
                  stroke="#292D32"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  opacity="0.34"
                  d="M5 12C5 15.87 8.13 19 12 19C15.87 19 19 15.87 19 12C19 8.13 15.87 5 12 5"
                  stroke="#292D32"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  opacity="0.34"
                  d="M12 16C14.21 16 16 14.21 16 12C16 9.79 14.21 8 12 8"
                  stroke="#292D32"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
              Borrow APY
            </h5>
            <p className="db-subtitle">0.17%</p>
          </div>
          <div className="d-flex justify-content-space-between align-items-center mb-2">
            <h5 className="tg-paragraph">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                style={{ display: 'inline-block', marginRight: '.25em' }}
              >
                <path
                  d="M22 13V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22H13"
                  stroke="#292D32"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  opacity="0.4"
                  d="M7.33008 14.4898L9.71008 11.3998C10.0501 10.9598 10.6801 10.8798 11.1201 11.2198L12.9501 12.6598C13.3901 12.9998 14.0201 12.9198 14.3601 12.4898L16.6701 9.50977"
                  stroke="#292D32"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M19.4802 15.8199L19.7602 16.3899C19.9002 16.6699 20.2502 16.9299 20.5602 16.9899L20.9402 17.0499C22.0802 17.2399 22.3502 18.0799 21.5302 18.9099L21.1802 19.2599C20.9502 19.4999 20.8202 19.9599 20.8902 20.2799L20.9402 20.4899C21.2502 21.8699 20.5202 22.3999 19.3202 21.6799L19.0602 21.5299C18.7502 21.3499 18.2502 21.3499 17.9402 21.5299L17.6802 21.6799C16.4702 22.4099 15.7402 21.8699 16.0602 20.4899L16.1102 20.2799C16.1802 19.9599 16.0502 19.4999 15.8202 19.2599L15.4702 18.9099C14.6502 18.0799 14.9202 17.2399 16.0602 17.0499L16.4402 16.9899C16.7402 16.9399 17.1002 16.6699 17.2402 16.3899L17.5202 15.8199C18.0602 14.7299 18.9402 14.7299 19.4802 15.8199Z"
                  stroke="#292D32"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
              Distribution APY
            </h5>
            <p className="db-subtitle">0.43%</p>
          </div>

          <h4 className="db-title mb-2">Borrow limit</h4>

          <div className="d-flex justify-content-space-between align-items-center mb-1">
            <h5 className="tg-paragraph">Borrow limit</h5>
            <p className="db-subtitle">$ 234.5</p>
          </div>
          <div className="d-flex justify-content-space-between align-items-center mb-1">
            <h5 className="tg-paragraph">Borrow limit used</h5>
            <p className="db-subtitle">35%</p>
          </div>

          <ButtonGroup size="lg" alignItems="center">
            <Button mr="-px" colorScheme="green" onClick={() => setStep(3)}>
              Transfer
            </Button>
            <Button onClick={() => setStep(0)}>Cancel</Button>
          </ButtonGroup>
        </>
      )}

      {step === 2 && (
        <>
          <SimpleGrid mt={4} columns={2} spacing={5}>
            <Button
              width={'100%'}
              bg="blackAlpha.200"
              boxShadow="lg"
              color="blue.500"
              size="lg"
              borderRadius={'lg'}
              onClick={() => setStep(1)}
            >
              Borrow
            </Button>
            <Button
              bg="blackAlpha.900"
              _hover={{ bg: 'blue.500' }}
              boxShadow="lg"
              color="whiteAlpha.900"
              size="lg"
              width={'100%'}
              borderRadius={'lg'}
              onClick={() => setStep(2)}
            >
              Repay
            </Button>
          </SimpleGrid>

          <Heading size="sm" my={4} textAlign="center">
            Ether
          </Heading>

          <InputGroup mb={3}>
            <InputLeftElement pointerEvents="none" color="gray.300" fontSize="1.2em">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M15.4998 15.75C15.3198 15.75 15.1198 15.74 14.9398 15.73C14.5698 15.71 14.2697 15.41 14.2397 15.04C14.0197 12.25 11.7498 9.98999 8.96976 9.76999C8.59976 9.73999 8.29975 9.44001 8.27975 9.07001C8.26975 8.89001 8.25977 8.69001 8.25977 8.51001C8.25977 4.51001 11.5098 1.26001 15.5098 1.26001C19.5098 1.26001 22.7598 4.51001 22.7598 8.51001C22.7598 12.51 19.4998 15.75 15.4998 15.75ZM9.74976 8.35999C12.7298 8.88999 15.1198 11.27 15.6398 14.25C18.7498 14.17 21.2498 11.63 21.2498 8.5C21.2498 5.33 18.6698 2.75 15.4998 2.75C12.3798 2.75 9.82976 5.24999 9.74976 8.35999Z"
                  fill="#292D32"
                ></path>
                <path
                  d="M8.5 22.75C4.5 22.75 1.25 19.5 1.25 15.5C1.25 11.5 4.5 8.25 8.5 8.25C8.68 8.25 8.88 8.25999 9.06 8.26999C12.59 8.54999 15.45 11.41 15.72 14.92C15.73 15.12 15.74 15.32 15.74 15.5C15.75 19.5 12.5 22.75 8.5 22.75ZM8.5 9.75C5.33 9.75 2.75 12.33 2.75 15.5C2.75 18.67 5.33 21.25 8.5 21.25C11.67 21.25 14.25 18.67 14.25 15.5C14.25 15.34 14.24 15.18 14.23 15.02C14.01 12.25 11.74 9.98001 8.95999 9.76001C8.81999 9.76001 8.66 9.75 8.5 9.75Z"
                  fill="#292D32"
                ></path>
                <path
                  d="M8.5 18.75C8.23 18.75 7.97 18.6 7.84 18.36L7.06 16.94L5.64001 16.16C5.40001 16.03 5.25 15.78 5.25 15.5C5.25 15.22 5.40001 14.97 5.64001 14.84L7.06 14.06L7.84 12.64C8.1 12.16 8.89 12.16 9.16 12.64L9.94 14.06L11.36 14.84C11.6 14.97 11.75 15.22 11.75 15.5C11.75 15.78 11.6 16.03 11.36 16.16L9.94 16.94L9.16 18.36C9.03 18.6 8.77 18.75 8.5 18.75ZM7.56 15.5L7.97 15.73C8.1 15.8 8.19999 15.9 8.26999 16.03L8.5 16.44L8.73001 16.03C8.80001 15.9 8.9 15.8 9.03 15.73L9.44 15.5L9.03 15.27C8.9 15.2 8.80001 15.1 8.73001 14.97L8.5 14.56L8.26999 14.97C8.19999 15.1 8.1 15.2 7.97 15.27L7.56 15.5Z"
                  fill="#292D32"
                ></path>
              </svg>
            </InputLeftElement>
            <Input
              fontWeight={500}
              variant="filled"
              placeholder="Enter amount ETH ..."
              value={val > 0 ? val : ''}
              onChange={(e: any) => setValue(e.target.value)}
            />
            <InputRightElement>
              <Button mr={1} colorScheme="blue" onClick={() => setValue(123.4)} h="1.75rem" size="sm">
                Max
              </Button>
            </InputRightElement>
          </InputGroup>
          {/* <FormHelperText color="red.500">Invalid Amount.</FormHelperText> */}

          <h4 className="db-title mb-2">Supply rates</h4>

          <div className="d-flex justify-content-space-between align-items-center mb-1">
            <h5 className="tg-paragraph">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                style={{ display: 'inline-block', marginRight: '.25em' }}
              >
                <path
                  d="M4.02 5.97C2.75 7.65 2 9.74 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2"
                  stroke="#292D32"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  opacity="0.34"
                  d="M5 12C5 15.87 8.13 19 12 19C15.87 19 19 15.87 19 12C19 8.13 15.87 5 12 5"
                  stroke="#292D32"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  opacity="0.34"
                  d="M12 16C14.21 16 16 14.21 16 12C16 9.79 14.21 8 12 8"
                  stroke="#292D32"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
              Borrow APY
            </h5>
            <p className="db-subtitle">0.17%</p>
          </div>
          <div className="d-flex justify-content-space-between align-items-center mb-2">
            <h5 className="tg-paragraph">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                style={{ display: 'inline-block', marginRight: '.25em' }}
              >
                <path
                  d="M22 13V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22H13"
                  stroke="#292D32"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  opacity="0.4"
                  d="M7.33008 14.4898L9.71008 11.3998C10.0501 10.9598 10.6801 10.8798 11.1201 11.2198L12.9501 12.6598C13.3901 12.9998 14.0201 12.9198 14.3601 12.4898L16.6701 9.50977"
                  stroke="#292D32"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M19.4802 15.8199L19.7602 16.3899C19.9002 16.6699 20.2502 16.9299 20.5602 16.9899L20.9402 17.0499C22.0802 17.2399 22.3502 18.0799 21.5302 18.9099L21.1802 19.2599C20.9502 19.4999 20.8202 19.9599 20.8902 20.2799L20.9402 20.4899C21.2502 21.8699 20.5202 22.3999 19.3202 21.6799L19.0602 21.5299C18.7502 21.3499 18.2502 21.3499 17.9402 21.5299L17.6802 21.6799C16.4702 22.4099 15.7402 21.8699 16.0602 20.4899L16.1102 20.2799C16.1802 19.9599 16.0502 19.4999 15.8202 19.2599L15.4702 18.9099C14.6502 18.0799 14.9202 17.2399 16.0602 17.0499L16.4402 16.9899C16.7402 16.9399 17.1002 16.6699 17.2402 16.3899L17.5202 15.8199C18.0602 14.7299 18.9402 14.7299 19.4802 15.8199Z"
                  stroke="#292D32"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
              Distribution APY
            </h5>
            <p className="db-subtitle">0.43%</p>
          </div>

          <h4 className="db-title mb-2">Borrow limit</h4>

          <div className="d-flex justify-content-space-between align-items-center mb-1">
            <h5 className="tg-paragraph">Borrow limit</h5>
            <p className="db-subtitle">$ 234.5</p>
          </div>
          <div className="d-flex justify-content-space-between align-items-center mb-1">
            <h5 className="tg-paragraph">Borrow limit used</h5>
            <p className="db-subtitle">35%</p>
          </div>

          <ButtonGroup size="lg" alignItems="center">
            <Button mr="-px" colorScheme="green" onClick={() => setStep(3)}>
              Transfer
            </Button>
            <Button onClick={() => setStep(0)}>Cancel</Button>
          </ButtonGroup>
        </>
      )}

      {step === 3 && (
        <>
          <Heading size="md" mt={4} mb={2} textAlign="center">
            Borrow Amount
          </Heading>
          <Box padding={5} bg="gray.200" borderRadius={15} mb={4}>
            <Box color="gray.900" textAlign="center">
              0.061 ETH
            </Box>
            <Box color="gray.500" textAlign="center">
              ~0.016 USD
            </Box>
          </Box>

          <div className="d-flex justify-content-space-between align-items-center mb-1">
            <h5 className="tg-paragraph">Max Gas price</h5>
            <p className="db-subtitle">~ 0.05 ETH (103.4 USD)</p>
          </div>

          <ButtonGroup>
            <Button mr="-px" colorScheme="green" onClick={() => setStep(4)}>
              Confirm
            </Button>
            <Button onClick={() => setStep(0)}>Cancel</Button>
          </ButtonGroup>
        </>
      )}

      {step === 4 && (
        <div className="confirmed">
          <div className="df">
            <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24" fill="none">
              <path
                d="M13.9902 10.0099L14.8302 9.16992"
                stroke="#FF7373"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              <path
                d="M9.16992 14.8301L11.9199 12.0801"
                stroke="#FF7373"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              <path
                d="M14.8299 14.8299L9.16992 9.16992"
                stroke="#FF7373"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              <path
                d="M4 6C2.75 7.67 2 9.75 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2C10.57 2 9.2 2.3 7.97 2.85"
                stroke="#FF7373"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>

            <span>Failed Transaction!</span>
            <p className="text-gray mb-3 text-center">Oh no...Looks like there was an error with the transaction.</p>
          </div>

          <div className="confetti"></div>

          <ButtonGroup justifyContent="center" mt={16} display="flex">
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

export default Borrow;
