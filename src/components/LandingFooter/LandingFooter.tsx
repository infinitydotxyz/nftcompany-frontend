import React from 'react';
import Image from 'next/image';
import { Box, Link, useColorMode } from '@chakra-ui/react';
import styles from './LandingFooter.module.scss';
import { FaDiscord, FaTwitter } from 'react-icons/fa';

const LandingFooter = () => {
  const { colorMode } = useColorMode();
  const dark = colorMode === 'dark';

  return (
    <div className={styles.footer}>
      <div className="grid-footer">
        <Box className="col-sm-12 col-md-6">
          <Link href="/">
            <img alt="Infinity" src={dark ? '/img/logo-new.svg' : '/img/logo-new.svg'} width={130} />
          </Link>

          <p className={styles.paragraph}>
            Infinity is built by an A-team of crypto devs and operators. Join us on discord to find out more and
            contribute.
          </p>
        </Box>
        {/* <div className="col-sm-12 col-md-3">
            <div className="tg-desc">Infinity</div>
            <ul className= {styles.links}>
            <li>
              <a href="">Home</a>
            </li>
            <li>
              <a href="">About</a>
            </li>
            <li>
              <a href="https://medium.com/@mavriklabs">Blog</a>
            </li>
            </ul>
          </div> */}
        {/* <div className="col-sm-12 col-md-3">
            <div className="tg-desc">Legal</div>
            <ul className={styles.links}>
            <li>
              <a href="">Terms of Service</a>
            </li>
            <li>
              <a href="">Privacy Policy</a>
            </li>
            <li>
              <a href="">Cookie Policy</a>
            </li>
            </ul>
          </div> */}
      </div>

      <div className={'grid ' + styles.second}>
        {/* <div className="col-sm-12 col-md-7">
          <p>
            Copyright © 2021 Mavrik labs Inc, All rights reserved | <a href="https://mavrik.co">mavrik.co</a>
          </p>
        </div> */}
        <div className={'col-sm-12 col-md-5 justify-self-start ' + styles.socials}>
          <a href="https://medium.com/@infinitydotxyz" target="_blank" rel="noreferrer">
            <Image alt="Medium" src="/img/medium.svg" width={30} height={30} />
          </a>
          <a href="https://discord.gg/SefzVZU72S" target="_blank" rel="noreferrer">
            <FaDiscord size={30} />
          </a>
          <a href="https://twitter.com/infinitydotxyz" target="_blank" rel="noreferrer">
            <FaTwitter size={30} />
          </a>
          {/* <a href="https://www.instagram.com/infinitydotxyz/" target="_blank" rel="noreferrer">
            <Image alt="Instagram" src="/img/instagram.svg" width={30} height={30} />
          </a> */}
        </div>
      </div>
    </div>
  );
};

export default LandingFooter;
