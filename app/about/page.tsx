"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { SiteHeader } from "@/components/layout/site-header"
import { ArrowLeft, ArrowRight } from "lucide-react"

export default function AboutPage() {
  return (
    <main className="min-h-dvh min-h-screen bg-white">
      <SiteHeader />

      <section className="px-6 lg:px-12 pt-12 lg:pt-20 pb-10 lg:pb-14 expo-tland-section-md">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-[12vw] lg:text-[7vw] font-black text-neutral-900 leading-none tracking-tighter expo-tland-page-title"
        >
          프로젝트 소개
        </motion.h1>
      </section>

      <section className="px-6 lg:px-12 pb-14 lg:pb-20 expo-tland-section-md">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="max-w-4xl"
        >
          <p className="text-base lg:text-lg text-neutral-700 leading-relaxed">
            병풍연화는 여러 사람이 함께 하나의 병풍을 완성해가는 릴레이 인터랙티브 미디어아트 입니다.<br></br>
            관객은 몸짓을 통해 자신만의 서사를 만들어갑니다.
          </p>
          {/* <p className="mt-6 text-base lg:text-lg text-neutral-700 leading-relaxed">
            참여자는 현재 진행 중인 패널을 확인하고, 완성된 병풍의 흐름을 감상하며, 이전 작업을
            아카이브에서 다시 살펴볼 수 있습니다. 병풍연화는 결과물뿐 아니라 함께 만드는 과정 자체를
            전시합니다.
          </p> */}
        </motion.div>
      </section>

      <section className="border-t border-neutral-200 bg-neutral-50 expo-tland-section">
        <div className="px-6 lg:px-12 py-12 lg:py-16 expo-tland-section-md">
          <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
            <div>
              <p className="text-xs text-neutral-500 tracking-widest uppercase mb-3">01</p>
              <h2 className="text-xl text-neutral-900 font-semibold mb-3">연결된 서사</h2>
              <p className="text-sm text-neutral-600 leading-relaxed">
                각 패널은 독립적인 장면이면서 동시에 다음 장면으로 이어지는 흐름을 가집니다.
              </p>
            </div>
            <div>
              <p className="text-xs text-neutral-500 tracking-widest uppercase mb-3">02</p>
              <h2 className="text-xl text-neutral-900 font-semibold mb-3">릴레이 방식</h2>
              <p className="text-sm text-neutral-600 leading-relaxed">
                여러 참여자가 순차적으로 작업해 공동 창작의 결과를 함께 완성합니다.
              </p>
            </div>
            <div>
              <p className="text-xs text-neutral-500 tracking-widest uppercase mb-3">03</p>
              <h2 className="text-xl text-neutral-900 font-semibold mb-3">누적 아카이브</h2>
              <p className="text-sm text-neutral-600 leading-relaxed">
                완성된 작업은 기록으로 남아 다음 병풍 제작과 감상의 기반이 됩니다.
              </p>
            </div>
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-3 border border-neutral-900 text-neutral-900 rounded-full hover:bg-neutral-900 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              병풍 전시관으로
            </Link>
            <Link
              href="/archive"
              className="inline-flex items-center gap-2 px-5 py-3 border border-neutral-300 text-neutral-700 rounded-full hover:border-neutral-900 hover:text-neutral-900 transition-colors"
            >
              전체보기
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
