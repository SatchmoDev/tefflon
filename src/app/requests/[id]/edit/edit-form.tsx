"use client"

import Pending from "@/components/pending"
import Link from "next/link"
import { useActionState } from "react"
import { updateRequest } from "./actions"

interface EditFormProps {
  requestId: string
  initialData: {
    name: string
    phone: string
    destination: string
    start: string
    end: string
  }
}

export default function EditForm({ requestId, initialData }: EditFormProps) {
  const [state, action] = useActionState(updateRequest, undefined)

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="requestId" value={requestId} />
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input 
            id="name" 
            name="name" 
            type="text" 
            required 
            defaultValue={state?.fd ? (state.fd.get("name") as string) : initialData.name}
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input 
            id="phone" 
            name="phone" 
            type="tel" 
            required 
            defaultValue={state?.fd ? (state.fd.get("phone") as string) : initialData.phone}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="destination">Destination</label>
        <input 
          id="destination" 
          name="destination" 
          type="text" 
          required 
          defaultValue={state?.fd ? (state.fd.get("destination") as string) : initialData.destination}
        />
        <p className="form-help">
          Please provide the specific location or address
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="form-group">
          <label htmlFor="start">Start Date</label>
          <input 
            id="start" 
            name="start" 
            type="date" 
            required 
            defaultValue={state?.fd ? (state.fd.get("start") as string) : initialData.start}
          />
        </div>

        <div className="form-group">
          <label htmlFor="end">End Date</label>
          <input 
            id="end" 
            name="end" 
            type="date" 
            required 
            defaultValue={state?.fd ? (state.fd.get("end") as string) : initialData.end}
          />
        </div>
      </div>

      {state?.error && (
        <div className="alert alert-error">
          {state.error}
        </div>
      )}

      <div className="alert alert-info">
        <p className="text-sm">
          <strong>Note:</strong> Saving changes will reset this request to &quot;pending&quot; status for admin review.
        </p>
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-slate-200">
        <Link href={`/requests/${requestId}`} className="btn-secondary">
          Cancel
        </Link>
        <Pending text="Save Changes" />
      </div>
    </form>
  )
}