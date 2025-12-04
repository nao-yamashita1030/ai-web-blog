"use client";

import Image from "next/image";
import { useState } from "react";

type BlogImageProps = {
  src: string | undefined;
  alt: string;
  fill?: boolean;
  className?: string;
  defaultImage?: string;
  width?: number;
  height?: number;
};

export default function BlogImage({
  src,
  alt,
  fill = false,
  className = "",
  defaultImage = "https://placehold.co/800x600/e5e7eb/9ca3af?text=No+Image",
  width,
  height,
}: BlogImageProps) {
  const [imgSrc, setImgSrc] = useState(src || defaultImage);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(defaultImage);
    }
  };

  if (fill) {
    return (
      <Image
        src={imgSrc}
        alt={alt}
        fill
        className={className}
        onError={handleError}
      />
    );
  }

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width || 800}
      height={height || 600}
      className={className}
      onError={handleError}
    />
  );
}

