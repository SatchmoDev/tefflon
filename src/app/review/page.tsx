import { db } from "@/lib/firebase"
import { identify } from "@/utils/server"
import { collection, getDocs, query, where } from "firebase/firestore"
import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = { title: "Review" }

export default async function Review() {
  await identify(true)

  const { docs } = await getDocs(
    query(collection(db, "requests"), where("status", "==", "pending")),
  )

  return (
    <>
      <h1>Review</h1>

      {docs.map((request) => {
        const { destination } = request.data()

        return (
          <Link href={`/review/${request.id}`} key={request.id}>
            <p>{destination}</p>
          </Link>
        )
      })}
    </>
  )
}
