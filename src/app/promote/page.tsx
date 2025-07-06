import { identify } from "@/utils/server"
import { Metadata } from "next"
import Form from "./form"

export const metadata: Metadata = { title: "Promote User" }

export default async function Promote() {
  await identify(true)

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Promote User
        </h1>
        <p className="text-slate-600">
          Grant admin privileges to a user account
        </p>
      </div>

      <div className="card">
        <div className="alert alert-warning mb-6">
          <h3 className="font-medium text-yellow-800 mb-2">
            Admin Access Warning
          </h3>
          <p className="text-sm text-yellow-700">
            Promoting a user will grant them full admin privileges, including the ability to review and approve requests. Only promote trusted users.
          </p>
        </div>

        <Form />
      </div>
    </div>
  )
}
