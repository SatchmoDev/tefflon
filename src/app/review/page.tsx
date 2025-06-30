import { db } from "@/lib/firebase"
import { identify } from "@/utils/server"
import { collection, getDocs, query, where } from "firebase/firestore"
import Link from "next/link"

export default async function Review() {
  await identify(true)

  const { docs } = await getDocs(
    query(collection(db, "requests"), where("status", "==", "pending")),
  )

  return (
    <>
      <h1>Requests</h1>

      {docs.map((doc) => {
        const data = doc.data()

        return (
          <Link href={`/review/${doc.id}`} key={doc.id}>
            {data.name}
          </Link>
        )
      })}
    </>
  )
}
