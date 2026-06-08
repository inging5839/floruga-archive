import Image from "next/image"

type HeroBannerProps = {
  alt?: string
  priority?: boolean
}

export function HeroBanner({ alt = "병풍연화", priority = false }: HeroBannerProps) {
  return (
    <>
      <Image
        src="/images/hero-banner-mobile.png"
        alt={alt}
        width={1315}
        height={796}
        priority={priority}
        className="w-full h-auto object-cover md:hidden"
      />
      <Image
        src="/images/hero-banner.png"
        alt={alt}
        width={2996}
        height={1109}
        priority={priority}
        className="hidden w-full h-auto object-cover md:block"
      />
    </>
  )
}
