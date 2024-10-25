import Image, { ImageProps } from 'next/image';

type CustomImageProps = Omit<ImageProps, 'src'> & {
  src: string;
};

const CustomImage: React.FC<CustomImageProps> = ({ src, ...rest }) => {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const fullSrc = src.startsWith('/')
    ? `${basePath}${src}`
    : src;
    
  return <Image src={fullSrc} {...rest} />;
}

export default CustomImage;