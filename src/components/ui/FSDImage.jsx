import Image from 'next/image';

function FSDImage({
  src = 'https://placehold.co/400x600/png',
  alt = 'image',
  quality = 75,
  style = '',
  ...props
}) {
  return (
    <Image
      width={600}
      height={600}
      style={{
          objectFit: 'cover',
        }
      }
      src={src}
      alt={alt}
      placeholder="blur"
      quality={quality}
      {...props}
      
    />
  );
}

export default FSDImage;