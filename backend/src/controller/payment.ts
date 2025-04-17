import { Request, Response } from "express";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16" as Stripe.StripeConfig["apiVersion"],
});

interface CustomerDetails {
  email: string | undefined;
  name: string;
  addressLine1: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface CheckoutRequestBody {
  propertyId: number;
  amount: number;
  description: string;
  customerDetails: CustomerDetails;
}

export async function handlePayment(
  req: Request<{}, {}, CheckoutRequestBody>,
  res: Response
) {
  const { propertyId, amount, description, customerDetails } = req.body;

  try {
    // Create a Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: description,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "https://rentalapp02.netlify.app/success",
      cancel_url: "https://rentalapp02.netlify.app/cancel",
      // success_url: "http://localhost:5173/success",
      // cancel_url: "http://localhost:5173/cancel",
      billing_address_collection: "required",
      customer_creation: "always",
      customer_email: customerDetails.email,
      shipping_address_collection: {
        allowed_countries: ["IN"],
      },
      metadata: {
        propertyId: String(propertyId),
        customerName: customerDetails.name,
        addressLine1: customerDetails.addressLine1,
        city: customerDetails.city,
        state: customerDetails.state,
        postalCode: customerDetails.postalCode,
        country: customerDetails.country,
      },
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
}
