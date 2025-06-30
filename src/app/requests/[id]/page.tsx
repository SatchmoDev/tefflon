import { db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"
import { Metadata } from "next"
import { notFound } from "next/navigation"

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
  const snap = await getRequest(params)
  const data = snap.data()

  return (
    <>
      <p>{data.name}</p>
      <p>{data.email}</p>
    </>
  )
}
