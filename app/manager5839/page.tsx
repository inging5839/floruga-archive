import type { Metadata } from "next"
import { AdminClient } from "./admin-client"

export const metadata: Metadata = {
  title: "병풍 관리자",
  robots: { index: false, follow: false },
}

export default function Manager5839Page() {
  return <AdminClient />
}
