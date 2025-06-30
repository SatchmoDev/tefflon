import { identify } from "@/utils/server"
import { Metadata } from "next"
import Form from "./form"

export const metadata: Metadata = { title: "New" }

export default async function New() {
  await identify()

  return (
    <>
      <h1>New</h1>
      <Form />
    </>
  )
}
