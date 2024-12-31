import Image, { ImageProps } from 'next/image';

type CustomImageProps = Omit<ImageProps, 'src'> & {
  src: string;
  alt: string;
};

const CustomImage: React.FC<CustomImageProps> = ({ src, alt, ...rest }) => {
  const fullSrc = src.startsWith('/')
    ? `/chatforyouio/front${src}`
    : src;
    
  return <Image src={fullSrc} alt={alt} {...rest} />;
}

export default CustomImage;