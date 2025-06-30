"use client"

import { useFormStatus } from "react-dom"

export default function Pending() {
  const { pending } = useFormStatus()
  return <button disabled={pending}>Submit</button>
}
