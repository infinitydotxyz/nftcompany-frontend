import React from 'react';
import Image from 'next/image';
import { Box, Link } from '@chakra-ui/react';

const LandingFooter = () => {
  return (
    <header className="footer footer-l">
      <div className="container">
        <div className="grid">
          <Box className="col-sm-12 col-md-6" p={6}>
            <Link href="/">
              <Image alt="NFT Company" src="/img/nftcompanyTransparentBgSvg.svg" width={180} height={60} />
            </Link>

            <p className="tg-paragraph">
              NFT Company is a product of Mavrik Labs Inc. Mavrik labs has a grand vision of making crypto a part of a
              billion people’s daily lives.
            </p>
          </Box>
          {/* <div className="col-sm-12 col-md-3">
            <div className="tg-desc">NFT Company</div>
            <ul className="footer-links">
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
            <ul className="footer-links">
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

        <div className="grid second">
          <div className="col-sm-12 col-md-7">
            <p>
              Copyright © 2021 Mavrik labs Inc, All rights reserved | <a href="https://mavrik.co">mavrik.co</a>
            </p>
          </div>
          <div className="col-sm-12 col-md-5 justify-self-end socials">
            <a href="https://medium.com/@mavriklabs">
              <Image alt="NFT Company" src="/img/medium.svg" width={30} height={30} />
            </a>
            <a href="https://discord.gg/SefzVZU72S">
              <Image alt="NFT Company" src="/img/discord.svg" width={30} height={30} />
            </a>
            <a href="https://twitter.com/mavriklabs">
              <Image alt="NFT Company" src="/img/twitter.svg" width={30} height={30} />
            </a>
            <a href="https://www.instagram.com/mavriklabs/">
              <Image alt="NFT Company" src="/img/instagram.svg" width={30} height={30} />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default LandingFooter;
