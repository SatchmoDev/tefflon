import { db } from "@/lib/firebase"
import { doc as d, getDoc } from "firebase/firestore"
import { notFound } from "next/navigation"

type Props = { params: Promise<{ id: string }> }

const getRequest = async (params: Props["params"]) => {
  const { id } = await params
  const doc = await getDoc(d(db, "requests", id))

  if (!doc.exists()) notFound()

  return doc
}

export default async function Id({ params }: Props) {
  const doc = await getRequest(params)
  const data = doc.data()

  return (
    <>
      <p>{data.name}</p>
      <p>{data.email}</p>
      <p>{data.status}</p>
      <p>{data.id}</p>
    </>
  )
}
