import { db } from "@/lib/firebase"
import { addDoc, collection, getDocs, query, where, orderBy, limit } from "firebase/firestore"

export type ReviewStatus = "pending" | "approved" | "denied"

export interface Review {
  id: string
  request: string    // request document ID
  uid: string       // admin uid
  email: string     // admin email
  status: ReviewStatus
  message: string   // admin message
  created: number   // review created timestamp
}

export interface RequestWithStatus {
  id: string
  data: any
  status: ReviewStatus
  latestReview?: Review
}

/**
 * Get the latest review for a specific request
 * Returns null if no reviews exist (meaning status is "pending")
 */
export async function getLatestReview(requestId: string): Promise<Review | null> {
  try {
    const reviewsQuery = query(
      collection(db, "reviews"),
      where("request", "==", requestId),
      orderBy("created", "desc"),
      limit(1)
    )
    
    const { docs } = await getDocs(reviewsQuery)
    
    if (docs.length === 0) return null
    
    const doc = docs[0]
    return {
      id: doc.id,
      ...doc.data()
    } as Review
  } catch (error) {
    console.error("Error getting latest review:", error)
    return null
  }
}

/**
 * Get all reviews for a request (audit trail)
 * Returns empty array if no reviews exist
 */
export async function getReviewHistory(requestId: string): Promise<Review[]> {
  try {
    const reviewsQuery = query(
      collection(db, "reviews"),
      where("request", "==", requestId),
      orderBy("created", "desc")
    )
    
    const { docs } = await getDocs(reviewsQuery)
    
    return docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Review))
  } catch (error) {
    console.error("Error getting review history:", error)
    return []
  }
}

/**
 * Create a new review for a request
 */
export async function createReview(
  requestId: string,
  adminUid: string,
  adminEmail: string,
  status: ReviewStatus,
  message: string = ""
): Promise<Review | null> {
  try {
    const reviewData = {
      request: requestId,
      uid: adminUid,
      email: adminEmail,
      status,
      message: message.trim(),
      created: Date.now()
    }
    
    const docRef = await addDoc(collection(db, "reviews"), reviewData)
    
    return {
      id: docRef.id,
      ...reviewData
    }
  } catch (error) {
    console.error("Error creating review:", error)
    return null
  }
}

/**
 * Get request status - returns "pending" if no review exists
 */
export async function getRequestStatus(requestId: string): Promise<ReviewStatus> {
  const latestReview = await getLatestReview(requestId)
  return latestReview?.status || "pending"
}

/**
 * Get multiple requests with their current status
 */
export async function getRequestsWithStatus(requestIds: string[]): Promise<Map<string, ReviewStatus>> {
  const statusMap = new Map<string, ReviewStatus>()
  
  // Initialize all as pending
  requestIds.forEach(id => statusMap.set(id, "pending"))
  
  if (requestIds.length === 0) return statusMap
  
  try {
    // Get all reviews for these requests
    const reviewsQuery = query(
      collection(db, "reviews"),
      where("request", "in", requestIds),
      orderBy("created", "desc")
    )
    
    const { docs } = await getDocs(reviewsQuery)
    
    // Find latest review for each request
    const latestReviews = new Map<string, Review>()
    
    docs.forEach(doc => {
      const review = { id: doc.id, ...doc.data() } as Review
      const existing = latestReviews.get(review.request)
      
      if (!existing || review.created > existing.created) {
        latestReviews.set(review.request, review)
      }
    })
    
    // Update status map with latest reviews
    latestReviews.forEach((review, requestId) => {
      statusMap.set(requestId, review.status)
    })
    
    return statusMap
  } catch (error) {
    console.error("Error getting requests with status:", error)
    return statusMap
  }
}

/**
 * Check if a request has any reviews (for admin pending list)
 */
export async function hasReviews(requestId: string): Promise<boolean> {
  try {
    const reviewsQuery = query(
      collection(db, "reviews"),
      where("request", "==", requestId),
      limit(1)
    )
    
    const { docs } = await getDocs(reviewsQuery)
    return docs.length > 0
  } catch (error) {
    console.error("Error checking if request has reviews:", error)
    return false
  }
}

/**
 * Check if a request can be edited (pending or denied status)
 */
export async function canEditRequest(requestId: string): Promise<boolean> {
  const status = await getRequestStatus(requestId)
  return status === "pending" || status === "denied"
}

/**
 * Check if a request has been modified after initial creation
 */
export async function isModifiedRequest(requestData: any): Promise<boolean> {
  return !!(requestData.modified && requestData.version && requestData.version > 1)
}

/**
 * Get request edit history information
 */
export function getRequestEditInfo(requestData: any) {
  const created = new Date(requestData.created)
  const modified = requestData.modified ? new Date(requestData.modified) : null
  const version = requestData.version || 1
  
  return {
    created,
    modified,
    version,
    isModified: !!(modified && version > 1),
    lastModifiedDate: modified ? modified.toLocaleDateString() : null
  }
}