import { Metadata } from "next"
import Link from "next/link"
import Form from "./form"

export const metadata: Metadata = { title: "Log In" }

export default function LogIn() {
  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Log In
        </h1>
        <p className="text-slate-600">
          Access your account to manage your requests
        </p>
      </div>

      <div className="card">
        <Form />
        
        <div className="mt-6 text-center">
          <p className="text-slate-600">
            Don't have an account?{" "}
            <Link href="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
