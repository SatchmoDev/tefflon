"use server"

import { db } from "@/lib/firebase"
import { shape } from "@/utils/client"
import { identify } from "@/utils/server"
import { addDoc, collection } from "firebase/firestore"
import { redirect } from "next/navigation"

export const createRequest = async (state: unknown, fd: FormData) => {
  const user = await identify()
  const { name, email } = shape(fd)

  await addDoc(collection(db, "requests"), {
    id: user.uid,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    status: "pending",
  })

  redirect("/")
}
