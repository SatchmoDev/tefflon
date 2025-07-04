"use server"

import { auth } from "@/lib/admin"
import { shape } from "@/utils/client"
import { redirect } from "next/navigation"

export const promoteUser = async (state: unknown, fd: FormData) => {
  const { email } = shape(fd)

  try {
    const { uid } = await auth.getUserByEmail(email)
    await auth.setCustomUserClaims(uid, { admin: true })

    redirect("/")
  } catch {
    return { error: "User not found", fd }
  }
}
