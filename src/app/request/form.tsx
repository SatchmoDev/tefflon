"use client"

import Pending from "@/components/pending"
import { useActionState } from "react"
import { request } from "./actions"

export default function Form() {
  const [state, action] = useActionState(request, undefined)

  return (
    <form action={action}>
      <label htmlFor="name">Name</label>
      <input id="name" name="name" type="text" required />

      <label htmlFor="email">Email</label>
      <input id="email" name="email" type="email" required />

      <Pending />
    </form>
  )
}
