import Link from "next/link"

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">
          Welcome to Tefflon
        </h1>
        <p className="text-xl text-slate-600 mb-8">
          Your government request management system
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="card">
          <h2 className="text-2xl font-semibold text-slate-800 mb-4">
            Submit a Request
          </h2>
          <p className="text-slate-600 mb-6">
            Create and submit new requests for approval through our streamlined process.
          </p>
          <Link href="/requests/new" className="btn-primary">
            New Request
          </Link>
        </div>

        <div className="card">
          <h2 className="text-2xl font-semibold text-slate-800 mb-4">
            View Your Requests
          </h2>
          <p className="text-slate-600 mb-6">
            Track the status and details of all your submitted requests.
          </p>
          <Link href="/requests" className="btn-primary">
            View Requests
          </Link>
        </div>
      </div>

      <div className="card bg-blue-50 border-blue-200">
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">
          Getting Started
        </h2>
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
              1
            </span>
            <div>
              <h3 className="font-medium text-slate-900">Create an Account</h3>
              <p className="text-slate-600">Sign up for a new account to get started.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
              2
            </span>
            <div>
              <h3 className="font-medium text-slate-900">Submit Your Request</h3>
              <p className="text-slate-600">Fill out the request form with all required details.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
              3
            </span>
            <div>
              <h3 className="font-medium text-slate-900">Track Progress</h3>
              <p className="text-slate-600">Monitor your request status and receive updates.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
