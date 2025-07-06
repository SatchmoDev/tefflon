"use server"

import { db } from "@/lib/firebase"
import { shape } from "@/utils/client"
import { identify } from "@/utils/server"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { redirect, notFound } from "next/navigation"

export const updateRequest = async (state: unknown, fd: FormData) => {
  try {
    // Verify user authentication
    const user = await identify()
    
    // Extract form data
    const { requestId, name, phone, destination, start, end } = shape(fd) as { 
      requestId: string
      name: string
      phone: string
      destination: string
      start: string
      end: string
    }
    
    if (!requestId) {
      return { error: "Request ID is required", fd }
    }
    
    // Get the existing request to verify ownership
    const requestRef = doc(db, "requests", requestId)
    const requestSnap = await getDoc(requestRef)
    
    if (!requestSnap.exists()) {
      notFound()
    }
    
    const requestData = requestSnap.data()
    
    // Verify user owns this request
    if (requestData.uid !== user.uid) {
      return { error: "Unauthorized to edit this request", fd }
    }
    
    // Validate required fields
    if (!name?.trim() || !phone?.trim() || !destination?.trim() || !start || !end) {
      return { error: "All fields are required", fd }
    }
    
    // Update the request with new data and modification timestamp
    await updateDoc(requestRef, {
      name: name.trim(),
      phone: phone.trim(),
      destination: destination.trim(),
      start,
      end,
      modified: Date.now(),
      version: (requestData.version || 1) + 1 // Increment version
    })
    
    // Redirect back to request details
    redirect(`/requests/${requestId}`)
    
  } catch (error) {
    console.error("Error updating request:", error)
    return { error: "Failed to update request", fd }
  }
}