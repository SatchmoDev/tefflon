import { identify } from "@/utils/server"
import { Metadata } from "next"
import Form from "./form"

export const metadata: Metadata = { title: "Request" }

export default async function Request() {
  await identify()

  return (
    <>
      <h1>Request</h1>
      <Form />
    </>
  )
}
