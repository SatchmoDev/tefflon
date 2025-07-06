"use client"

import Pending from "@/components/pending"
import Link from "next/link"
import { useActionState } from "react"
import { createRequest } from "./actions"

export default function Form() {
  const [state, action] = useActionState(createRequest, undefined)

  return (
    <form action={action} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input id="name" name="name" type="text" required />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input id="phone" name="phone" type="tel" required />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="destination">Destination</label>
        <input id="destination" name="destination" type="text" required />
        <p className="form-help">
          Please provide the specific location or address
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="form-group">
          <label htmlFor="start">Start Date</label>
          <input id="start" name="start" type="date" required />
        </div>

        <div className="form-group">
          <label htmlFor="end">End Date</label>
          <input id="end" name="end" type="date" required />
        </div>
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-slate-200">
        <Link href="/requests" className="btn-secondary">
          Cancel
        </Link>
        <Pending text="Submit Request" />
      </div>
    </form>
  )
}
