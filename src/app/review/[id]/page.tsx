import { db } from "@/lib/firebase"
import { identify } from "@/utils/server"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { Metadata } from "next"
import { notFound, redirect } from "next/navigation"

type Props = { params: Promise<{ id: string }> }

const getRequest = async (params: Props["params"]) => {
  const { id } = await params
  const snap = await getDoc(doc(db, "requests", id))

  if (!snap.exists()) notFound()
  return snap
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const snap = await getRequest(params)
  const data = snap.data()

  return { title: data.name }
}

export default async function Id({ params }: Props) {
  await identify(true)

  const snap = await getRequest(params)
  const data = snap.data()

  return (
    <>
      <p>{data.name}</p>
      <p>{data.email}</p>

      <form
        action={async () => {
          "use server"

          const ref = doc(db, "requests", snap.id)
          await updateDoc(ref, { status: "approved" })

          redirect("/review")
        }}
      >
        <button>Approve</button>
      </form>

      <form
        action={async () => {
          "use server"

          const ref = doc(db, "requests", snap.id)
          await updateDoc(ref, { status: "denied" })

          redirect("/review")
        }}
      >
        <button>Deny</button>
      </form>
    </>
  )
}
