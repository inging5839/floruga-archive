import Image from "next/image"

type HeroBannerProps = {
  alt?: string
  priority?: boolean
  /** 9:16 세로 모니터에서 전용 배너(hero-banner-916.png)를 사용 */
  portrait?: boolean
}

export function HeroBanner({
  alt = "병풍연화",
  priority = false,
  portrait = false,
}: HeroBannerProps) {
  if (portrait) {
    return (
      <>
        {/* 9:16 세로 모니터 전용 */}
        <Image
          src="/images/hero-banner-916.png"
          alt={alt}
          width={3002}
          height={1673}
          priority={priority}
          className="hidden w-full h-auto object-cover portrait:block"
        />
        {/* 가로 — 작은 화면 */}
        <Image
          src="/images/hero-banner-mobile.png"
          alt={alt}
          width={1315}
          height={796}
          priority={priority}
          className="hidden w-full h-auto object-cover landscape:max-md:block"
        />
        {/* 가로 — md 이상 */}
        <Image
          src="/images/hero-banner.png"
          alt={alt}
          width={2996}
          height={1109}
          priority={priority}
          className="hidden w-full h-auto object-cover landscape:md:block"
        />
      </>
    )
  }

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
