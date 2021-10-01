/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-html-link-for-pages */
import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Layout from 'containers/layout';
import { Box, Button } from '@chakra-ui/react';
import { NextPage } from 'next';
import styles from './home/Home.module.scss';
import FaqAccordian from 'components/FaqAccordion/FaqAccordion';
import { DarkmodeSwitch } from 'components/DarkmodeSwitch/DarkmodeSwitch';
import { CheckCircleIcon } from '@chakra-ui/icons';
import { CheckShieldIcon } from 'components/Icons/Icons';
import router from 'next/router';

export default function Home() {
  // -------------------------------
  const topSection = (
    <section className={styles.titleSection}>
      <div className={styles.containerAvg}>
        <div className={styles.topCol}>
          <div className={styles.left}>
            <div className={styles.bigTitle}>
              The most <br />
              decentralized NFT marketplace. <div className={styles.bigTitleBlue}>Ever.</div>
            </div>

            <div className={styles.subTitle}>
              Earn rewards for your activity, list without <br />
              re-initating your wallet, and low fees when sold.
            </div>

            <div className={styles.buttons}>
              <Button className={styles.stadiumButton} type="submit" onClick={() => router.push('/explore')}>
                Explore
              </Button>
              <Button className={styles.stadiumButton} colorScheme="gray" onClick={() => router.push('/my-nfts')}>
                List NFTs
              </Button>
            </div>
          </div>
          <div className={styles.right}>
            <div className={styles.image}>
              <Image alt="NFT Company" src="/img/artwork-2.png" width={488} height={488} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  // -------------------------------
  const automateSection = (
    <section className={styles.titleSection}>
      <div className={styles.containerAvg}>
        <div className={styles.topCol}>
          <div className={styles.left}>
            <div className={styles.bigTitle}>
              Automate DeFi with your NFTs. Track all your investments in one place.
              <div className={[styles.bigTitleBlue, styles.alignCenter].join(' ')}>
                <div>Let NFTs do the work.</div>
                <CheckShieldIcon />
              </div>
            </div>

            <div className={styles.checklist}>
              <div className={styles.checklistRow}>
                <CheckCircleIcon className={styles.icon} />
                <div>Lower fees</div>
              </div>
              <div className={styles.checklistRow}>
                <CheckCircleIcon className={styles.icon} />
                <div>Earn tokens for activity on the marketplace</div>
              </div>
              <div className={styles.checklistRow}>
                <CheckCircleIcon className={styles.icon} />
                <div>Governance tokens control all aspects of the ???.</div>
              </div>
              <div className={styles.checklistRow}>
                <CheckCircleIcon className={styles.icon} />
                <div>Only NFT owners can perform DeFi transactions</div>
              </div>
              <div className={styles.checklistRow}>
                <CheckCircleIcon className={styles.icon} />
                <div>Assets from the NFT can be withdrawn anytime</div>
              </div>
            </div>

            <div className={styles.fineprint}>
              <div>- Lower fees (for example, we charge a 1.5% transaction fee when others charge 2.5% or higher)</div>

              <div>- Earn tokens for activity on the marketplace</div>

              <div>- Governance tokens control all aspects of the marketplace and fees</div>

              <div>- List your NFTs without re-initiating your wallet (if they are already listed on OpenSea)</div>
            </div>
          </div>
          <div className={styles.right}>
            <div className={styles.image}>
              <Image alt="NFT Company" src="/img/artwork-2.png" width={488} height={488} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  const developersSection = (
    <section className={`${styles.developers} section`}>
      <div className="container container-avg">
        <div className="grid">
          <div className="col-sm-12 col-md-6">
            <Image alt="NFT Company" src="/img/developer.png" width={500} height={488} />
          </div>

          <div className="col-sm-12 col-md-6">
            <h3 className="tg-title">
              Developers: build DeFi, game, social media or any NFT you dream of.
              <br />
              <span className="brand-color">
                Possibilities are endless. <CheckShieldIcon />
              </span>
            </h3>

            <ul>
              <li>Extend our base contracts to create new NFTs.</li>
              <li>Get design, UI, smart contract and backend help from us.</li>
              <li>Publish them on our marketplace and earn revenue.</li>
              <li>
                <a href="https://docs.nftcompany.com/all/architecture/overview" className={styles.link}>
                  And more.
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );

  const artistsSections = (
    <section className={`${styles.artists} section`}>
      <div className="container container-avg">
        <div className="grid">
          <div className="col-sm-12 col-md-6">
            <h3 className="tg-title">
              Creators: make NFTs that do more than simply represent your creations.
              <br />
              <span className="brand-color">Make the really special ones. {<CheckShieldIcon />}</span>
            </h3>

            <ul>
              <li>Make an NFT from your creation.</li>
              <li>Tell us what new capabilities you wish to impart to your NFTs. We will help you program them.</li>
              <li>Launch your supercharged NFTs into the world.</li>
            </ul>
          </div>
          <div className="col-sm-12 col-md-6">
            <Image alt="NFT Company" src="/img/artists.png" width={500} height={480} />
          </div>
        </div>
      </div>
    </section>
  );

  const worldSection = (
    <section id="world" className={`${styles.world} section`}>
      <div className="container container-avg">
        <div className={`${styles.box}`}>
          <div className="grid">
            <div className="col-sm-8 col-md-5">
              <h2 className="tg-hero-title">
                The world of <span className="brand-color">Crypto</span>
              </h2>
            </div>

            <Box className={`col-sm-8 col-md-7 ${styles.para}`} pr={6}>
              <p className={`${styles['tg-paragraph']}`}>
                The Crypto world can be accessed in many ways: using exchanges like Coinbase and wallets like MetaMask.
                We believe NFTs will become a new major way the Crypto world is accessed. We are building this new "UI"
                to Crypto, starting with NFTs that interface with DeFi protocols.
              </p>
            </Box>
          </div>
          <Image className={styles.cover} alt="NFT Company" src="/img/artwork-3.png" width={770} height={512} />
        </div>
      </div>
    </section>
  );

  const investorsSection = (
    <section id="investors" className={`${styles.investors} section`}>
      <div className="container container-avg">
        <div className="grid">
          <div className={`${styles.image} col-sm-12 col-md-6`}>
            <Image alt="NFT Company" src="/img/artwork-4.png" width={488} height={400} />
          </div>

          <div className="col-sm-12 col-md-6">
            <h3 className="tg-title">Investors</h3>
            <p>We are backed by investors that believe in the long term potential of crypto.</p>

            <div className="grid">
              <div className="col-sm-6 col-md-3 col-lg-6">
                <Image alt="Binance" src="/img/binanceLabs.png" width={500} height={300} />
              </div>
              <div className="col-sm-6 col-md-3 col-lg-6">
                <Image alt="ETH Global HackMoney" src="/img/ethGlobal.svg" width={500} height={300} />
              </div>
              {/* <div className="col-sm-6 col-md-3">
            <Image alt="NFT Company" src="/logo-investor.png" width={100} height={100} />
          </div>
          <div className="col-sm-6 col-md-3">
            <Image alt="NFT Company" src="/logo-investor.png" width={100} height={100} />
          </div> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  const faqSection = (
    <section id="faq" className={`${styles.faq} section`}>
      <div className="container container-avg">
        <h2 className="text-center tg-title">FAQs</h2>
        <FaqAccordian
          questions={[
            {
              question: 'What is a programmable NFT?',
              answer:
                'A programmable NFT is a smart contract that is minted by an NFT factory.' +
                ' Since the NFT is a smart contract, it can be programmed to do anything.' +
                ' For example, it can be programmed to manage Uniswap V3 positions automatically.'
            },
            {
              question: 'Why programmable NFTs?',
              answer: 'Because they are cooler than jpeg NFTs and regular smart contracts with regular front-ends.'
            },
            {
              question: 'What can be built with this primitive?',
              answer: 'P2P exchanges, P2P loans, games, smart wallets, frontends to any DeFi protocol/blockchain app.'
            },
            {
              question: 'Are you live?',
              answer:
                'Our base contracts are ready and can be found on our Github. We are planning to release the first application of a programmable NFT in the coming weeks.'
            },
            {
              question: 'When can I mint these NFTs?',
              answer:
                'In the coming weeks once we launch our first NFT. Stay tuned by following us on Twitter and joining our Discord.'
            },
            {
              question: 'Is there a token?',
              answer: 'No, currently there is no token.'
            },
            {
              question: 'Is this a DAO?',
              answer:
                'We plan to build this as a DAO and are currently looking for members that will become part of the genesis squad. If you are developer, designer, marketer, memer or possess any valuable skill, reach out to us.'
            }
          ]}
        />
      </div>
    </section>
  );

  return (
    <>
      <Head>
        <title>NFT Company</title>
      </Head>

      <div className={styles.background} />

      {topSection}
      {automateSection}
      {developersSection}
      {artistsSections}
      {worldSection}
      {investorsSection}

      {faqSection}

      {<DarkmodeSwitch />}
    </>
  );
}

// eslint-disable-next-line react/display-name
Home.getLayout = (page: NextPage) => <Layout landing>{page}</Layout>;
