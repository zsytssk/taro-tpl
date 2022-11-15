import { Image, ImageProps } from '@tarojs/components';
import { useCallback, useState } from 'react';

import styles from './index.module.less';

interface WImageProps extends ImageProps {
  imgLoaded?: () => void;
}

const WImage: React.FC<WImageProps> = ({
  className,
  imgLoaded,
  ...resetProps
}) => {
  const [loaded, setLoaded] = useState(false);

  const ImgLoaded = useCallback(() => {
    setLoaded(true);
    imgLoaded && imgLoaded();
  }, [setLoaded, imgLoaded]);

  return (
    <Image
      onLoad={ImgLoaded}
      className={`${styles.image} ${
        loaded ? '' : styles.opacity0
      } ${className}`}
      {...resetProps}
    />
  );
};

export default WImage;
