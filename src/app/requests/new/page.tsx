import { identify } from "@/utils/server"
import { Metadata } from "next"
import Link from "next/link"
import Form from "./form"

export const metadata: Metadata = { title: "New Request" }

export default async function New() {
  await identify()

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center space-x-2 text-sm text-slate-600 mb-4">
          <Link href="/requests" className="hover:text-slate-900">
            Requests
          </Link>
          <span>/</span>
          <span className="text-slate-900">New Request</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900">
          Submit New Request
        </h1>
        <p className="text-slate-600 mt-2">
          Fill out the form below to submit a new request for review.
        </p>
      </div>

      <div className="card">
        <Form />
      </div>
    </div>
  )
}
