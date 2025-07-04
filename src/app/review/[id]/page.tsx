import Pending from "@/components/pending"
import { db } from "@/lib/firebase"
import { identify } from "@/utils/server"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { Metadata } from "next"
import { notFound, redirect } from "next/navigation"

type Props = { params: Promise<{ id: string }> }

const getRequest = async (params: Props["params"]) => {
  const { id } = await params
  const request = await getDoc(doc(db, "requests", id))

  if (!request.exists()) notFound()
  return request
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const request = await getRequest(params)
  const { destination } = request.data()

  return { title: destination }
}

export default async function Request({ params }: Props) {
  await identify(true)

  const request = await getRequest(params)
  const { name, destination, status } = request.data()

  return (
    <>
      <h1>Request</h1>

      <p>{name}</p>
      <p>{destination}</p>
      <p>{status}</p>

      <form
        action={async () => {
          "use server"

          const ref = doc(db, "requests", request.id)
          await updateDoc(ref, { status: "approved" })

          redirect("/review")
        }}
      >
        <Pending text="Approve" />
      </form>

      <form
        action={async () => {
          "use server"

          const ref = doc(db, "requests", request.id)
          await updateDoc(ref, { status: "denied" })

          redirect("/review")
        }}
      >
        <Pending text="Deny" />
      </form>
    </>
  )
}
