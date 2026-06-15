"use client"

import Image from "next/image"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { XIcon } from "lucide-react"
import { Dialog, DialogOverlay, DialogPortal, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

export type LightboxImage = {
  src: string
  alt: string
}

type ImageLightboxProps = {
  image: LightboxImage | null
  open: boolean
  onOpenChange: (open: boolean) => void
  /** contain: 비율 유지 / cover: 화면 가득 채움 */
  fit?: "contain" | "cover"
}

export function ImageLightbox({
  image,
  open,
  onOpenChange,
  fit = "contain",
}: ImageLightboxProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm" />
        <DialogPrimitive.Content
          className={cn(
            "fixed top-1/2 left-1/2 z-50 flex h-[94dvh] w-[94vw] max-w-none -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-lg border border-stone-700/60 bg-stone-950/95 p-0 shadow-2xl outline-none",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 duration-200",
          )}
        >
          <DialogTitle className="sr-only">
            {image?.alt ?? "이미지 확대 보기"}
          </DialogTitle>

          {image && (
            <div className="relative h-full w-full min-h-0">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="94vw"
                className={fit === "cover" ? "object-cover" : "object-contain"}
                priority
              />
            </div>
          )}

          <DialogPrimitive.Close
            className="absolute top-3 right-3 z-10 rounded-full border border-stone-500/60 bg-stone-900/80 p-2 text-stone-100 opacity-90 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-stone-400"
            aria-label="닫기"
          >
            <XIcon className="size-5" />
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  )
}
