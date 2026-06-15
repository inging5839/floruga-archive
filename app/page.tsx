"use client"

import { motion } from "framer-motion"
import { HeroBanner } from "@/components/layout/hero-banner"
import { SiteHeader } from "@/components/layout/site-header"
import { ProjectIntro } from "@/components/project-intro"

export default function HomePage() {
  return (
    <main className="min-h-dvh min-h-screen">
      <SiteHeader />

      <section className="w-full">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          <HeroBanner priority />
        </motion.div>
      </section>

      <ProjectIntro />
    </main>
  )
}
