import { Metadata } from "next"
import Link from "next/link"
import Form from "./form"

export const metadata: Metadata = { title: "Sign Up" }

export default function SignUp() {
  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Sign Up
        </h1>
        <p className="text-slate-600">
          Create an account to start managing your requests
        </p>
      </div>

      <div className="card">
        <Form />
        
        <div className="mt-6 text-center">
          <p className="text-slate-600">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
