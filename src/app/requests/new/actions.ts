"use server"

import { db } from "@/lib/firebase"
import { shape } from "@/utils/client"
import { identify } from "@/utils/server"
import { addDoc, collection } from "firebase/firestore"
import { redirect } from "next/navigation"

export const createRequest = async (state: unknown, fd: FormData) => {
  const { uid, email } = await identify()
  const { name, phone, destination, start, end } = shape(fd)

  await addDoc(collection(db, "requests"), {
    uid,
    email,
    name: name.trim(),
    phone,
    destination: destination.trim(),
    start,
    end,
    timestamp: Date.now(),
    status: "pending",
  })

  redirect("/requests")
}
