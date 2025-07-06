"use client"

import Pending from "@/components/pending"
import { useActionState, useState } from "react"
import { approveRequest, denyRequest } from "../actions"

interface ReviewFormProps {
  requestId: string
}

export default function ReviewForm({ requestId }: ReviewFormProps) {
  const [approveState, approveAction] = useActionState(approveRequest, undefined)
  const [denyState, denyAction] = useActionState(denyRequest, undefined)
  const [approveMessage, setApproveMessage] = useState("")
  const [denyMessage, setDenyMessage] = useState("")
  const [activeForm, setActiveForm] = useState<"approve" | "deny" | null>(null)

  const maxMessageLength = 500

  return (
    <div className="card bg-yellow-50 border-yellow-200 mb-8">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">
        Review Actions
      </h3>
      <p className="text-slate-600 mb-6">
        Please review the request details above and choose an action below.
        You can optionally add a message to explain your decision.
      </p>

      {/* Quick action buttons when no form is active */}
      {!activeForm && (
        <div className="flex items-center justify-center space-x-4 mb-6">
          <button
            onClick={() => setActiveForm("approve")}
            className="btn-success"
          >
            Approve Request
          </button>
          <button
            onClick={() => setActiveForm("deny")}
            className="btn-danger"
          >
            Deny Request
          </button>
        </div>
      )}

      {/* Approve form */}
      {activeForm === "approve" && (
        <form action={approveAction} className="space-y-4">
          <input type="hidden" name="requestId" value={requestId} />
          
          <div className="form-group">
            <label htmlFor="approve-message">
              Message (Optional)
            </label>
            <textarea
              id="approve-message"
              name="message"
              rows={4}
              value={approveMessage}
              onChange={(e) => setApproveMessage(e.target.value)}
              placeholder="Add any conditions, instructions, or notes about this approval..."
              maxLength={maxMessageLength}
              className="resize-none"
            />
            <p className="form-help">
              {approveMessage.length}/{maxMessageLength} characters
            </p>
          </div>

          {approveState?.error && (
            <div className="alert alert-error">
              {approveState.error}
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-yellow-200">
            <button
              type="button"
              onClick={() => setActiveForm(null)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <Pending text="Approve Request" variant="success" />
          </div>
        </form>
      )}

      {/* Deny form */}
      {activeForm === "deny" && (
        <form action={denyAction} className="space-y-4">
          <input type="hidden" name="requestId" value={requestId} />
          
          <div className="form-group">
            <label htmlFor="deny-message">
              Message (Required)
              <span className="text-red-600 ml-1">*</span>
            </label>
            <textarea
              id="deny-message"
              name="message"
              rows={4}
              value={denyMessage}
              onChange={(e) => setDenyMessage(e.target.value)}
              placeholder="Please explain why this request is being denied. This helps the user understand and potentially resubmit with corrections..."
              maxLength={maxMessageLength}
              className="resize-none"
              required
            />
            <p className="form-help">
              {denyMessage.length}/{maxMessageLength} characters · Required for denials
            </p>
          </div>

          {denyState?.error && (
            <div className="alert alert-error">
              {denyState.error}
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-yellow-200">
            <button
              type="button"
              onClick={() => setActiveForm(null)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <Pending text="Deny Request" variant="danger" />
          </div>
        </form>
      )}
    </div>
  )
}