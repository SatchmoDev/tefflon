"use server"

import { identify } from "@/utils/server"
import { createReview } from "@/utils/reviews"
import { shape } from "@/utils/client"
import { redirect } from "next/navigation"

export async function approveRequest(state: unknown, fd: FormData) {
  try {
    // Verify admin access
    const admin = await identify(true)
    
    // Extract form data
    const { requestId, message } = shape(fd) as { 
      requestId: string
      message: string 
    }
    
    if (!requestId) {
      return { error: "Request ID is required", fd }
    }
    
    // Create approval review
    const review = await createReview(
      requestId,
      admin.uid,
      admin.email!,
      "approved",
      message || ""
    )
    
    if (!review) {
      return { error: "Failed to approve request", fd }
    }
    
    // Redirect to review list
    redirect("/review")
    
  } catch (error) {
    console.error("Error approving request:", error)
    return { error: "Failed to approve request", fd }
  }
}

export async function denyRequest(state: unknown, fd: FormData) {
  try {
    // Verify admin access
    const admin = await identify(true)
    
    // Extract form data
    const { requestId, message } = shape(fd) as { 
      requestId: string
      message: string 
    }
    
    if (!requestId) {
      return { error: "Request ID is required", fd }
    }
    
    if (!message?.trim()) {
      return { error: "A message is required when denying a request", fd }
    }
    
    // Create denial review
    const review = await createReview(
      requestId,
      admin.uid,
      admin.email!,
      "denied",
      message.trim()
    )
    
    if (!review) {
      return { error: "Failed to deny request", fd }
    }
    
    // Redirect to review list
    redirect("/review")
    
  } catch (error) {
    console.error("Error denying request:", error)
    return { error: "Failed to deny request", fd }
  }
}