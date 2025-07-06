"use client"

import Pending from "@/components/pending"
import { useActionState } from "react"
import { promoteUser } from "./actions"

export default function Form() {
  const [state, action] = useActionState(promoteUser, undefined)

  return (
    <form action={action} className="space-y-6">
      <div className="form-group">
        <label htmlFor="email">User Email Address</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          defaultValue={state && (state.fd.get("email") as string)}
          placeholder="user@example.com"
        />
        <p className="form-help">
          Enter the email address of the user you want to promote to admin
        </p>
      </div>

      {state?.error && (
        <div className="alert alert-error">
          {state.error}
        </div>
      )}

      {!state?.error && state && (
        <div className="alert alert-success">
          User has been successfully promoted to admin.
        </div>
      )}

      <div className="pt-2">
        <Pending text="Promote to Admin" />
      </div>
    </form>
  )
}
