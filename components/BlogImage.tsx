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

// デフォルト画像のURL（Next.jsの画像最適化を無効にするため、data URIを使用）
const DEFAULT_IMAGE_SVG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Crect fill='%23e5e7eb' width='800' height='600'/%3E%3Ctext fill='%239ca3af' font-family='sans-serif' font-size='24' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3ENo Image%3C/text%3E%3C/svg%3E";

export default function BlogImage({
  src,
  alt,
  fill = false,
  className = "",
  defaultImage = DEFAULT_IMAGE_SVG,
  width,
  height,
}: BlogImageProps) {
  const [imgSrc, setImgSrc] = useState(src || defaultImage);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError && imgSrc !== defaultImage) {
      setHasError(true);
      setImgSrc(defaultImage);
    }
  };

  // 画像がない場合は、デフォルト画像を直接表示
  if (!src) {
    if (fill) {
      return (
        <div className={`${className} bg-gray-200 flex items-center justify-center`}>
          <span className="text-gray-400 text-sm">No Image</span>
        </div>
      );
    }
    return (
      <div 
        className={`${className} bg-gray-200 flex items-center justify-center`}
        style={{ width: width || 800, height: height || 600 }}
      >
        <span className="text-gray-400 text-sm">No Image</span>
      </div>
    );
  }

  if (fill) {
    return (
      <Image
        src={imgSrc}
        alt={alt}
        fill
        className={className}
        onError={handleError}
        unoptimized={imgSrc === defaultImage || imgSrc.startsWith("data:")}
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
      unoptimized={imgSrc === defaultImage || imgSrc.startsWith("data:")}
    />
  );
}

