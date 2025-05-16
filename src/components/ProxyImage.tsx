import Image from 'next/image';

interface ProxyImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
}

export function ProxyImage({
  src,
  alt,
  width,
  height,
  fill,
  className,
  priority,
}: ProxyImageProps) {
  // Se a URL for relativa (começa com /) ou for uma URL local, use diretamente
  if (src.startsWith('/') || src.startsWith('http://localhost')) {
    return (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        fill={fill}
        className={className}
        priority={priority}
      />
    );
  }

  // Para URLs externas, use o proxy
  const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(src)}`;

  return (
    <Image
      src={proxyUrl}
      alt={alt}
      width={width}
      height={height}
      fill={fill}
      className={className}
      priority={priority}
    />
  );
} 