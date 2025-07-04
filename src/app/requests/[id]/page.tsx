import { db } from "@/lib/firebase"
import { identify } from "@/utils/server"
import { doc, getDoc } from "firebase/firestore"
import { Metadata } from "next"
import { notFound } from "next/navigation"

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
  const user = await identify()

  const request = await getRequest(params)
  const { uid, name, destination, status } = request.data()

  if (user.uid !== uid) notFound()

  return (
    <>
      <h1>Request</h1>

      <p>{name}</p>
      <p>{destination}</p>
      <p>{status}</p>
    </>
  )
}
