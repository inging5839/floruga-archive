"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { SiteHeader } from "@/components/layout/site-header"
import { ArrowLeft, ArrowRight } from "lucide-react"

const steps = [
  {
    n: "01",
    title: "얼굴 촬영",
    body:
      "관람객은 병풍 이미지에 반영될 본인의 얼굴 사진을 촬영합니다. 안내에 따라 카메라 앞에 서서 촬영을 완료해 주세요.",
  },
  {
    n: "02",
    title: "반영 강도 설정",
    body:
      "병풍에 본인의 얼굴이 얼마만큼의 강도로 반영될지 정합니다. 미리보기를 참고해 원하는 느낌에 맞게 조절할 수 있습니다.",
  },
  {
    n: "03",
    title: "이전 스토리 시청",
    body:
      "스크린 앞으로 이동해 이전 스토리 영상을 시청합니다. 작품 세계와 이어지는 서사를 먼저 파악하는 단계입니다.",
  },
  {
    n: "04",
    title: "캐릭터 조작",
    body:
      "영상이 끝나면 리타겟팅된 캐릭터를 몸짓으로 조작해 하고 싶은 행동을 합니다. 내 움직임이 캐릭터에 그대로 전달됩니다.",
  },
  {
    n: "05",
    title: "스토리 영상 감상",
    body:
      "행동에 따라 스토리 영상이 출력되면 해당 영상을 감상합니다. 선택과 움직임에 따라 이어지는 장면을 경험합니다.",
  },
  {
    n: "06",
    title: "병풍 감상 후 종료",
    body:
      "스크린 앞에서 나와 병풍 디스플레이에 업데이트된 자신의 병풍 이미지를 감상하고 체험을 종료합니다.",
  },
] as const

export default function ExperiencePage() {
  return (
    <main className="min-h-dvh min-h-screen">
      <SiteHeader />

      <section className="px-6 lg:px-12 pt-12 lg:pt-20 pb-10 lg:pb-14 expo-tland-section-md">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-[12vw] lg:text-[7vw] font-black text-stone-100 leading-none tracking-tighter expo-tland-page-title"
        >
          체험 안내
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-6 max-w-4xl text-sm lg:text-base text-stone-400 leading-relaxed"
        >
        </motion.p>
      </section>

      <section className="px-6 lg:px-12 pb-14 lg:pb-20 expo-tland-section-md">
        <ol className="max-w-4xl space-y-8 lg:space-y-12 expo-tland-stack">
          {steps.map((step, i) => (
            <motion.li
              key={step.n}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: Math.min(i * 0.05, 0.25) }}
              className="flex gap-6 lg:gap-10 border-b border-stone-400/60 pb-8 lg:pb-12 last:border-0 last:pb-0"
            >
              <span className="text-xs text-stone-500 font-mono shrink-0 w-8 pt-1">{step.n}</span>
              <div>
                <h2 className="text-lg lg:text-xl font-semibold text-stone-100 mb-3">{step.title}</h2>
                <p className="text-sm lg:text-base text-stone-400 leading-relaxed">{step.body}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </section>

      <section className="border-t border-stone-400/60 expo-tland-section">
        <div className="px-6 lg:px-12 py-12 lg:py-16 expo-tland-section-md">
          <p className="text-xs text-stone-500 mb-6 max-w-xl leading-relaxed">
            체험 구성·소요 시간·대기 안내는 전시 일정에 따라 달라질 수 있습니다. 자세한 사항은 현장
            안내를 참고해 주세요.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/recent"
              className="inline-flex items-center gap-2 px-5 py-3 border border-stone-300 text-stone-100 rounded-full hover:bg-stone-100 hover:text-stone-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              최근 제작된 병풍
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-3 border border-stone-600 text-stone-300 rounded-full hover:border-stone-300 hover:text-stone-100 transition-colors"
            >
              프로젝트 소개
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
