import { NextResponse } from "next/server";
import axios from "axios";

const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
const MAILCHIMP_LIST_ID = process.env.MAILCHIMP_LIST_ID;
const DATACENTER = process.env.MAILCHIMP_DATACENTER; // e.g., 'us20'

export async function POST(req: Request) {
  try {
    // Read the JSON body from the request
    const { email } = await req.json();

    // Validate the email format
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json(
        { success: false, message: "Invalid email address" },
        { status: 400 }
      );
    }

    // Send the request to Mailchimp API to add the email to the list
    const response = await axios.post(
      `https://${DATACENTER}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members/`,
      {
        email_address: email,
        status: "subscribed", // Marks the user as 'subscribed'
      },
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            "anystring:" + MAILCHIMP_API_KEY
          ).toString("base64")}`,
        },
      }
    );

    // Handle successful subscription
    if (response.status === 200) {
      return NextResponse.json({ success: true });
    } else {
      throw new Error("Failed to subscribe");
    }
  } catch (error: any) {
    console.error("Error subscribing to Mailchimp:", error);

    if (error.response) {
      console.error("Mailchimp API response:", error.response.data);
    }

    return NextResponse.json(
      { success: false, message: "Failed to subscribe" },
      { status: 500 }
    );
  }
}
