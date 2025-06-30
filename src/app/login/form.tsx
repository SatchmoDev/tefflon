"use client"

import Pending from "@/components/pending"
import { auth } from "@/lib/firebase"
import { shape } from "@/utils/client"
import { hold } from "@/utils/server"
import { signInWithEmailAndPassword } from "firebase/auth"
import { useState } from "react"

export default function Form() {
  const [error, setError] = useState("")

  return (
    <form
      action={async (fd) => {
        const { email, password } = shape(fd)

        try {
          const cr = await signInWithEmailAndPassword(auth, email, password)
          await hold(await cr.user.getIdToken())
        } catch (e) {
          const { code } = e as { code: string }
          const content = code.split("/")[1].replace(/-/g, " ")

          setError(content[0].toUpperCase() + content.slice(1))
        }
      }}
    >
      <label htmlFor="email">Email</label>
      <input id="email" name="email" type="email" required />

      <label htmlFor="password">Password</label>
      <input id="password" name="password" type="password" required />

      {error && <p>{error}</p>}

      <Pending />
    </form>
  )
}
