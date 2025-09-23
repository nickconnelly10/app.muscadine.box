import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Handle webhook events from Farcaster
    console.log("Webhook received:", body);
    
    // Process different types of webhook events
    if (body.type === "user_action") {
      console.log("User action:", body.data);
      // Handle user interactions
    } else if (body.type === "notification") {
      console.log("Notification event:", body.data);
      // Handle notification events
    } else if (body.type === "transaction_complete") {
      console.log("Transaction completed:", body.data);
      // Handle transaction completion
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Health check endpoint
  return NextResponse.json({ status: "ok" });
}
