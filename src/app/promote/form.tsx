"use client"

import Pending from "@/components/pending"
import { useActionState } from "react"
import { promoteUser } from "./actions"

export default function Form() {
  const [state, action] = useActionState(promoteUser, undefined)

  return (
    <form action={action}>
      <label htmlFor="email">Email</label>
      <input
        id="email"
        name="email"
        type="email"
        required
        defaultValue={state && (state.fd.get("email") as string)}
      />

      {state && <p>{state.error}</p>}

      <Pending />
    </form>
  )
}
