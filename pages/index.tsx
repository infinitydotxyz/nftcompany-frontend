/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-html-link-for-pages */
import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Layout from 'containers/layout';
import { Box, Button } from '@chakra-ui/react';
import { NextPage } from 'next';
import FaqAccordian from 'components/FaqAccordion/FaqAccordion';
import { DarkmodeSwitch } from 'components/DarkmodeSwitch/DarkmodeSwitch';
import { CheckCircleIcon } from '@chakra-ui/icons';
import { CheckShieldIcon } from 'components/Icons/Icons';
import router from 'next/router';
import styles from './home/Home.module.scss';

export default function Home() {
  // -------------------------------
  const topSection = (
    <section className={styles.titleSection}>
      <div className={styles.containerAvg}>
        <div className={styles.topHeader}>
          <div className={styles.bigTitle}>
            Unlocking the next <br /> generation of NFTs
          </div>

          <div className={styles.subHeader}>
            Discover NFT communities, trade, <br />
            and use dynamic NFTs all in one decentralized place..
          </div>

          <div className={styles.buttons}>
            <Button size="lg" className={styles.stadiumButtonMain} onClick={() => router.push('/explore')}>
              Get started
            </Button>
            <Button size="lg" color="gray.400" className={styles.stadiumButton} onClick={() => router.push('/my-nfts')}>
              List NFTs
            </Button>
          </div>
        </div>
      </div>
    </section>
  );

  // -------------------------------
  const automateSection = (
    <section className={styles.titleSection}>
      <div className={styles.containerAvg}>
        <div className={styles.infoHomepage}>
          <div className={styles.bigTitle}>
            Infinity is fully compatible with OpenSea. It uses the same contracts, not forks.
            <div className={[styles.bigTitleHighlight, styles.alignCenter].join(' ')}>
              <div>
                No new smart contract risks.
              </div>
            </div>
          </div>

          <div className={styles.checklist}>
            <div className={styles.checklistRow}>
              <CheckCircleIcon className={styles.icon} />
              <div>Low fees of 1.5%, go to a community-controlled treasury</div>
            </div>
            <div className={styles.checklistRow}>
              <CheckCircleIcon className={styles.icon} />
              <div>
                List your NFTs without re-initiating your wallet or re-approving tokens (if already done on OpenSea)
              </div>
            </div>
            <div className={styles.checklistRow}>
              <CheckCircleIcon className={styles.icon} />
              <div>Earn governance tokens for activity on the marketplace</div>
            </div>
            <div className={styles.checklistRow}>
              <CheckCircleIcon className={styles.icon} />
              <div>Vote on all aspects of the marketplace and fee treasury as the token holder</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  // -------------------------------
  const developersSection = (
    <section className={styles.titleSection}>
      <div className={styles.containerAvg}>
        <div className={styles.topCol}>
          <div className={styles.imageCol}>
            <Image alt="Infinity" src="/img/developer.png" width={500} height={488} />
          </div>
          <div className={styles.textCol}>
            <div className={styles.bigTitle}>
              Developers: build DeFi, game, social media or any NFT you dream of.
              <div className={[styles.bigTitleBlue, styles.alignCenter].join(' ')}>
                <div>Possibilities are endless.</div>
                <CheckShieldIcon />
              </div>
            </div>

            <div className={styles.checklist}>
              <div className={styles.checklistRow}>
                <CheckCircleIcon className={styles.icon} />
                <div>Extend our base contracts to create new NFTs</div>
              </div>
              <div className={styles.checklistRow}>
                <CheckCircleIcon className={styles.icon} />
                <div>Get design, UI, smart contract and backend help from us</div>
              </div>
              <div className={styles.checklistRow}>
                <CheckCircleIcon className={styles.icon} />
                <div>Publish them on our marketplace and earn revenue</div>
              </div>
              <div className={styles.checklistRow}>
                <CheckCircleIcon className={styles.icon} />
                <a href="https://docs.nftcompany.com/all/architecture/overview" className={styles.link}>
                  And more.
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  // -------------------------------
  const artistsSections = (
    <section className={styles.titleSection}>
      <div className={styles.containerAvg}>
        <div className={styles.topCol}>
          <div className={styles.textCol}>
            <div className={styles.bigTitle}>
              Creators: make NFTs that do more than simply represent your creations.
              <br />
              <div className={[styles.bigTitleBlue, styles.alignCenter].join(' ')}>
                <div>Make the really special ones.</div>
                <CheckShieldIcon />
              </div>
            </div>

            <div className={styles.checklist}>
              <div className={styles.checklistRow}>
                <CheckCircleIcon className={styles.icon} />
                <div>Make an NFT from your creation</div>
              </div>
              <div className={styles.checklistRow}>
                <CheckCircleIcon className={styles.icon} />
                <div>Tell us what new capabilities you wish to impart to your NFTs. We will help you program them</div>
              </div>
              <div className={styles.checklistRow}>
                <CheckCircleIcon className={styles.icon} />
                <div>Launch your supercharged NFTs into the world</div>
              </div>
            </div>
          </div>
          <div className={styles.imageCol}>
            <Image alt="Infinity" src="/img/artists.png" width={500} height={480} />
          </div>
        </div>
      </div>
    </section>
  );

  // -------------------------------
  const worldSection = (
    <section id="world" className={styles.titleSection}>
      <div className={styles.containerAvg}>
        <div className={styles.worldBox}>
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
          <Image alt="Infinity" src="/img/artwork-3.png" width={770} height={512} />
        </div>
      </div>
    </section>
  );

  // -------------------------------
  const investorsSection = (
    <section className={styles.titleSection}>
      <div className={styles.containerAvg}>
        <div className={styles.topCol}>
          <div className={styles.textCol}>
            <div className={styles.bigTitle}>Investors</div>

            <div className={styles.subTitle}>
              We are backed by investors that believe in the long term potential of crypto.
            </div>

            <div className={styles.investorLogos}>
              <Image alt="Binance" src="/img/binanceLabs.png" width={200} height={200} layout="fixed" />
              <Image alt="ETH Global HackMoney" src="/img/ethGlobal.svg" width={200} height={200} layout="fixed" />
            </div>
          </div>
          <div className={styles.imageCol}>
            <Image alt="Infinity" src="/img/artwork-4.png" width={488} height={400} />
          </div>
        </div>
      </div>
    </section>
  );

  // -------------------------------
  const faqSection = (
    <section className={styles.titleSection}>
      <div className={styles.containerAvg}>
        <div className={styles.topCol}>
          <div className={styles.textCol}>
            <div className={styles.bigTitle}>FAQs</div>
            <FaqAccordian
              questions={[
                {
                  question: 'What is Infinity?',
                  answer:
                    'Infinity is a decentralized NFT super app that enables discovering, developing, trading, and managing NFTs.'
                },
                {
                  question: 'Is Infinity live?',
                  answer:
                    'Yes. Go to the Explore tab to see listed NFTs. You can also connect your Metamask to list, buy, sell NFTs and earn tokens.'
                },
                {
                  question: 'Is Infinity a DAO?',
                  answer:
                    'Yes, Infinity is a DAO. If you are a developer, designer, marketer, memer or possess any valuable skill, come join us. Find our discord and twitter links at the bottom of this page.'
                },
                {
                  question: 'How does Infinity governance work?',
                  answer:
                    'The marketplace and fee treasury is governed by a community of $NFT token holders and their delegates. They propose and vote on upgrades and on the use of funds in fee treasury.'
                },
                {
                  question: 'How do I earn $NFT tokens?',
                  answer:
                    'We are airdropping $NFT tokens to OpenSea users. We have different volume tiers to ensure a wide distribution. The airdropped $NFT tokens become claimable after performing some activity on the Infinity marketplace - selling/buying. Head over to the rewards page to check out how many tokens you are eligible to earn.'
                },
                {
                  question: 'How is Infinity different from other NFT marketplaces?',
                  answer:
                    'Infinity is community-owned and governed through a DAO. Infinity has the lowest fees and gives direct control of the fee treasury to $NFT holders. Infinity is building the marketplace into a super app that allows for effective discovery, valuation, development, trading, and management of NFTs.'
                }
              ]}
            />
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <>
      <Head>
        <title>Infinity</title>
      </Head>

      {topSection}
      {automateSection}
      {faqSection}

      {<DarkmodeSwitch />}
    </>
  );
}

// eslint-disable-next-line react/display-name
Home.getLayout = (page: NextPage) => <Layout landing>{page}</Layout>;
