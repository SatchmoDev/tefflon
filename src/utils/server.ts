"use server"

import { auth } from "@/lib/admin"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export const hold = async (token: string) => {
  const store = await cookies()
  const age = 60 * 60 * 24 * 5

  const session = await auth.createSessionCookie(token, {
    expiresIn: age * 1000,
  })

  store.set("session", session, {
    maxAge: age,
    secure: true,
    httpOnly: true,
    sameSite: "lax",
  })

  redirect("/")
}

export const identify = async (admin: boolean = false) => {
  const store = await cookies()
  const session = store.get("session")

  if (!session) redirect("/login")

  try {
    const { uid } = await auth.verifySessionCookie(session.value)
    const user = await auth.getUser(uid)

    if (admin) {
      const claims = user.customClaims
      if (!claims || !claims.admin) redirect("/login")
    }

    return user
  } catch {
    redirect("/login")
  }
}
