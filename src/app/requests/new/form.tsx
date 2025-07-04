"use client"

import Pending from "@/components/pending"
import { useActionState } from "react"
import { createRequest } from "./actions"

export default function Form() {
  const [state, action] = useActionState(createRequest, undefined)

  return (
    <form action={action}>
      <label htmlFor="name">Name</label>
      <input id="name" name="name" type="text" required />

      <label htmlFor="phone">Phone</label>
      <input id="phone" name="phone" type="tel" required />

      <label htmlFor="destination">Destination</label>
      <input id="destination" name="destination" type="text" required />

      <label htmlFor="start">Start</label>
      <input id="start" name="start" type="date" required />

      <label htmlFor="end">End</label>
      <input id="end" name="end" type="date" required />

      <Pending />
    </form>
  )
}
