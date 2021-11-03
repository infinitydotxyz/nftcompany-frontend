import React, { ReactElement, useEffect, useRef } from 'react';
import styles from './Background.module.scss';
import { useColorMode } from '@chakra-ui/react';

export const Background = (props: any) => {
  const canvasRef = useRef<any>(null);

  const { colorMode } = useColorMode();

  const dark = colorMode === 'dark';
  console.log(colorMode);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext('2d');

      const image = new Image();

      image.onload = function () {
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        context.filter = 'blur(100px) opacity(0.44)';

        const insetH = canvas.width * 0.05;

        // we want to avoid hitting the header so it blends with the background
        // moving it down by 200 min
        const topInsetV = 150;
        const bottomInsetV = 100;

        context.drawImage(
          image,
          insetH,
          topInsetV,
          canvas.width - insetH * 2,
          canvas.height - (topInsetV + bottomInsetV)
        );

        // for dark mode, make it a bit darker
        if (dark) {
          context.filter = 'opacity(0.8)';
          context.fillStyle = '#1A202C'; // windowBgDark
          context.fillRect(0, 0, canvas.width, canvas.height);
        }
      };

      image.src =
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAABPklEQVR42k3KwUrjUBhA4XOTP00TpqXQcSPjwAy4n6UPMDAwK1/Fh3LlK7hwI4gKgjvRhVgpVZva1jS5ubm5v116NmfzmbCNLxkMqEXdChoLXiEYxHcKYDpQz/YmkNYT+vNrmBdQohoSpHIdtaIvnfLQRvrQBHbWc/7MbtifXJFv+hAPkdIFZo2a85Xq8ULN5XsMfpfD7oC/vuXA3+q+mWGeChse196cTVo9naqZlkIihrthRIimHJWn+k/vESHQd57vy4rfbw1FrdSS8suOWOR7nLT/uWiXSKzK0DbsLddMX0seK89lkrKTBtL+iMLs8ux/IlHbMaocP5aWpy0cF5aR9CgHQpYn5BLTQ5HEdQw2nfoNjD9UBy+Wb+6DzTBgxluYC04yJLWetFYyF5G1QlZF9BYNrArwGTLOMFnMJziKroaiR95JAAAAAElFTkSuQmCC';
    }
  }, [dark]);

  return (
    <div className={styles.canvasBg}>
      <canvas ref={canvasRef} {...props} />;
    </div>
  );
};
