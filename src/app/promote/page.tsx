import { identify } from "@/utils/server"
import { Metadata } from "next"
import Form from "./form"

export const metadata: Metadata = { title: "Promote" }

export default async function Promote() {
  await identify(true)

  return (
    <>
      <h1>Promote</h1>
      <Form />
    </>
  )
}
