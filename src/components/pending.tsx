"use client"

import { useFormStatus } from "react-dom"

type Props = { text?: string }

export default function Pending({ text = "Submit" }: Props) {
  const { pending } = useFormStatus()
  return <button disabled={pending}>{text}</button>
}
