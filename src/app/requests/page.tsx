import { db } from "@/lib/firebase"
import { identify } from "@/utils/server"
import { collection, getDocs, query, where } from "firebase/firestore"
import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = { title: "Requests" }

export default async function Requests() {
  const { uid } = await identify()

  const { docs } = await getDocs(
    query(collection(db, "requests"), where("uid", "==", uid)),
  )

  return (
    <>
      <h1>Requests</h1>

      {docs.map((request) => {
        const { destination } = request.data()

        return (
          <Link href={`/requests/${request.id}`} key={request.id}>
            <p>{destination}</p>
          </Link>
        )
      })}
    </>
  )
}
