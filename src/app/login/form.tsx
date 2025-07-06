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
      className="space-y-6"
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
      <div className="form-group">
        <label htmlFor="email">Email Address</label>
        <input id="email" name="email" type="email" required />
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" required />
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      <div className="pt-2">
        <Pending fullWidth />
      </div>
    </form>
  )
}
