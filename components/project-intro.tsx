"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Camera, Sparkles, PersonStanding, ScrollText } from "lucide-react"

const STEPS = [
  {
    no: "01",
    icon: Camera,
    title: "이야기 속 인물이 되다",
    desc: "전시장에 들어와 작품 설명을 들은 뒤, 자신의 얼굴을 촬영하면 이야기 속 인물로 다시 태어납니다.",
  },
  {
    no: "02",
    icon: PersonStanding,
    title: "몸짓이 사건이 되다",
    desc: "미디어월 앞에서 몸을 움직이면 그 행동이 이야기 속 사건으로 변환되어, 『심청전』과는 다른 새로운 장면을 만듭니다.",
  },
  {
    no: "03",
    icon: Sparkles,
    title: "장면이 병풍이 되다",
    desc: "체험이 끝나면 관람자의 얼굴과 행동이 반영된 동화 장면이 생성형 AI로 병풍 이미지가 되어 전시 공간에 기록됩니다.",
  },
  {
    no: "04",
    icon: ScrollText,
    title: "이야기가 이어지다",
    desc: "한 사람의 경험은 하나의 장면이 되고, 여러 관람객의 참여가 이어지며 하나의 새로운 이야기 병풍이 완성됩니다.",
  },
]

export function ProjectIntro() {
  return (
    <>
      {/* Intro */}
      <section className="border-b border-stone-400/60 expo-tland-section">
        <div className="px-6 lg:px-12 py-14 lg:py-20 expo-tland-section-lg">
          <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-16 items-center">
            <div>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5 }}
                className="text-xs lg:text-sm tracking-[0.4em] uppercase text-amber-200/70 mb-5"
              >
                인터랙티브 XR 전시
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: 0.05 }}
                className="text-lg lg:text-2xl text-stone-200 font-serif leading-relaxed"
              >
                관람객의 몸짓이 이야기가 되고,<br className="hidden sm:block" />
                그 이야기가 다시 병풍의 한 폭으로 남는다.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="mt-6 max-w-xl text-sm lg:text-base text-stone-400 leading-relaxed"
              >
                《병풍연화》는 어린 시절 누구나 한 번쯤 접했던 전래동화와 책 병풍의 기억에서
                출발해, 생성형 AI와 신체 기반 인터랙션으로 두 요소를 다시 연결하는 인터랙티브
                XR 동화 전시입니다.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="relative mx-auto w-full max-w-[360px]"
            >
              <div className="absolute -inset-4 rounded-2xl bg-[radial-gradient(circle_at_50%_30%,rgba(214,188,150,0.18)_0%,transparent_70%)] blur-xl" />
              <div className="relative overflow-hidden rounded-xl border border-stone-400/60 shadow-[0_30px_70px_rgba(0,0,0,0.55)]">
                <Image
                  src="/images/poster-main.png"
                  alt="병풍연화 포스터"
                  width={745}
                  height={1052}
                  className="w-full h-auto object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Concept */}
      <section className="border-b border-stone-400/60 expo-tland-section">
        <div className="px-6 lg:px-12 py-14 lg:py-24 expo-tland-section-lg">
          <div className="grid lg:grid-cols-[0.4fr_0.6fr] gap-10 lg:gap-16">
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
              className="font-serif text-3xl lg:text-5xl text-stone-100 font-bold leading-tight"
            >
              보는 이야기에서<br />
              <span className="text-amber-200/90">바꾸는 이야기로</span>
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-6 text-base lg:text-lg text-stone-300 leading-relaxed"
            >
              <p>
                전래동화는 익숙하지만 종종 어린이 콘텐츠로만 여겨지고, 병풍은 전통적 이미지로
                남아 오늘의 관람 경험과는 멀어져 있습니다. 《병풍연화》는 이 두 요소를 다시
                연결하며, 전래동화를 <span className="text-stone-100 font-medium">‘보는 이야기’</span>가
                아니라 <span className="text-stone-100 font-medium">‘직접 개입하고 바꾸는 이야기’</span>로
                재해석합니다.
              </p>
              <p>
                작품은 전통 설화의 정서와 디지털 기술의 감각이 공존하는 세계를 지향합니다.
                관람자는 단순한 감상자가 아니라 이야기의 빈칸을 채우는{" "}
                <span className="text-stone-100 font-medium">공동 창작자</span>가 되며, 자신의
                선택과 몸짓이 서사를 바꿀 수 있다는 경험을 하게 됩니다.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Experience flow */}
      <section className="border-b border-stone-400/60 expo-tland-section">
        <div className="px-6 lg:px-12 py-14 lg:py-24 expo-tland-section-lg">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="mb-10 lg:mb-16"
          >
            <p className="text-xs tracking-[0.3em] uppercase text-amber-200/70 mb-3">
              Experience
            </p>
            <h2 className="font-serif text-3xl lg:text-5xl text-stone-100 font-bold">
              관람의 흐름
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {STEPS.map((step, idx) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={step.no}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: Math.min(idx * 0.08, 0.32) }}
                  className="group relative rounded-xl border border-stone-400/60 bg-stone-900/30 p-6 lg:p-7 hover:border-amber-200/40 transition-colors"
                >
                  <div className="flex items-center justify-between mb-5">
                    <span className="font-serif text-3xl text-stone-700 group-hover:text-amber-200/50 transition-colors">
                      {step.no}
                    </span>
                    <Icon className="w-6 h-6 text-amber-200/70" />
                  </div>
                  <h3 className="text-lg text-stone-100 font-semibold mb-3">
                    {step.title}
                  </h3>
                  <p className="text-sm text-stone-400 leading-relaxed">{step.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="border-b border-stone-400/60 expo-tland-section">
        <div className="px-6 lg:px-12 py-14 lg:py-24 expo-tland-section-lg">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="mb-10 lg:mb-16"
          >
            <p className="text-xs tracking-[0.3em] uppercase text-amber-200/70 mb-3">
              Gallery
            </p>
            <h2 className="font-serif text-3xl lg:text-5xl text-stone-100 font-bold">
              전시 풍경
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
            {[
              { src: "/images/project_img_01.jpg", alt: "병풍연화 전시 풍경 1" },
              { src: "/images/project_img_02.jpg", alt: "병풍연화 전시 풍경 2" },
              { src: "/images/project_img_03.jpg", alt: "병풍연화 전시 풍경 3" },
              { src: "/images/project_img_04.jpg", alt: "병풍연화 전시 풍경 4" },
            ].map((image, idx) => (
              <motion.figure
                key={image.src}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: Math.min(idx * 0.05, 0.15) }}
                className="relative aspect-[4/3] overflow-hidden rounded-xl border border-stone-400/60"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, 40vw"
                  className="object-cover"
                />
              </motion.figure>
            ))}
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="expo-tland-section">
        <div className="px-6 lg:px-12 py-16 lg:py-28 expo-tland-section-lg">
          <motion.blockquote
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="max-w-4xl mx-auto text-center"
          >
            <span className="block font-serif text-5xl lg:text-7xl text-amber-200/40 leading-none mb-4">
              “
            </span>
            <p className="font-serif text-2xl lg:text-4xl text-stone-100 leading-snug">
              우리는 오래된 이야기를 어떻게 다시 읽고,<br className="hidden sm:block" />
              어떻게 나의 이야기로 만들 수 있는가?
            </p>
          </motion.blockquote>

          <div className="mt-14 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/recent"
              className="inline-flex items-center gap-2 px-6 py-3 border border-stone-300 text-stone-100 rounded-full hover:bg-stone-100 hover:text-stone-900 transition-colors"
            >
              최근 제작된 병풍 보기
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/archive"
              className="inline-flex items-center gap-2 px-6 py-3 border border-stone-600 text-stone-300 rounded-full hover:border-stone-300 hover:text-stone-100 transition-colors"
            >
              모든 병풍 전체보기
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="mt-16 flex items-center justify-between border-t border-stone-400/50 pt-8 max-w-4xl mx-auto">
            <p className="text-xs text-stone-500">병풍연화</p>
            <p className="text-xs text-stone-500">팀 꽃충이</p>
          </div>
        </div>
      </section>
    </>
  )
}
