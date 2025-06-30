import { Metadata } from "next"
import Form from "./form"

export const metadata: Metadata = { title: "Sign Up" }

export default function SignUp() {
  return (
    <>
      <h1>Sign Up</h1>
      <Form />
    </>
  )
}
