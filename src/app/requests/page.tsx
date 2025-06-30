import { identify } from "@/utils/server"
import { Metadata } from "next"

export const metadata: Metadata = { title: "Requests" }

export default async function Requests() {
  await identify()

  return (
    <>
      <h1>Requests</h1>
    </>
  )
}
