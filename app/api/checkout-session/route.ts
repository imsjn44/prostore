import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { generateEsewaSignature } from "@/lib/generateEsewaSignature";
import { PaymentMethod, PaymentRequestData } from "@/lib/constants";
import { prisma } from "@/db/prisma";
import { PaymentStatus } from "@/lib/constants";

function validateEnvironmentVariables() {
  const requiredEnvVars = [
    "NEXT_PUBLIC_SERVER_URL",
    "NEXT_PUBLIC_ESEWA_MERCHANT_CODE",
    "NEXT_PUBLIC_ESEWA_SECRET_KEY",
  ];
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing environment variable: ${envVar}`);
    }
  }
}

export async function POST(req: Request) {
  console.log("Received POST request to /api/checkout-session");
  try {
    validateEnvironmentVariables();
    const paymentData: PaymentRequestData = await req.json();
    const { amount, productName, transactionId, method } = paymentData;
    if (!amount || !productName || !transactionId || !method) {
      console.error("Missing required fields:", paymentData);
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }
    switch (method) {
      case "esewa": {
        console.log("Initiating eSewa payment");
        const transactionUuid = `${Date.now()}-${uuidv4()}`;

        const esewaConfig = {
          amount: amount,
          tax_amount: "0",
          total_amount: amount,
          transaction_uuid: transactionUuid,
          product_code: process.env.NEXT_PUBLIC_ESEWA_MERCHANT_CODE,
          product_service_charge: "0",
          product_delivery_charge: "0",
          success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/success?method=esewa`,
          failure_url: `${process.env.NEXT_PUBLIC_SERVER_URL}`,
          signed_field_names: "total_amount,transaction_uuid,product_code",
        };
        const signatureString = `total_amount=${esewaConfig.total_amount},transaction_uuid=${esewaConfig.transaction_uuid},product_code=${esewaConfig.product_code}`;
        const signature = generateEsewaSignature(
          process.env.NEXT_PUBLIC_ESEWA_SECRET_KEY!,
          signatureString,
        );
        console.log("eSewa config:", { ...esewaConfig, signature });
        return NextResponse.json({
          amount: amount,
          esewaConfig: {
            ...esewaConfig,
            signature,
            product_service_charge: Number(esewaConfig.product_service_charge),
            product_delivery_charge: Number(
              esewaConfig.product_delivery_charge,
            ),
            tax_amount: Number(esewaConfig.tax_amount),
            total_amount: Number(esewaConfig.total_amount),
          },
        });
      }

      default:
        console.error("Invalid payment method:", method);
        return NextResponse.json(
          { error: "Invalid payment method" },
          { status: 400 },
        );
    }
  } catch (err) {
    console.error("Payment API Error:", err);
    return NextResponse.json(
      {
        error: "Error creating payment session",
        details: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

//(GET handler)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("sessionId");
  const paymentId = searchParams.get("paymentId");
  const method = searchParams.get("method") as string;
  const pidx = searchParams.get("pidx");
  const transactionId = searchParams.get("transaction_id");
  const data = searchParams.get("data");

  if (!method) {
    return NextResponse.json(
      { status: "error", message: "Missing payment method" },
      { status: 400 },
    );
  }
  try {
    // eSewa Payment Verification
    if (method === PaymentMethod.ESEWA && paymentId && data) {
      let decoded;
      try {
        decoded = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
      } catch (err) {
        console.error("Failed to decode eSewa data:", err);
        return NextResponse.json(
          { status: "error", message: "Invalid eSewa payload" },
          { status: 400 },
        );
      }
      if (decoded.status !== "COMPLETE") {
        return NextResponse.json({ status: "pending" });
      }

      // SECURITY: Verify transaction with eSewa server
      console.log("Verifying eSewa transaction with server...");

      // 1. You've decoded the data
      // 2. You've called eSewa's API to verify it's a real transaction

      // SECURITY: Check if payment record exists
      const existingPayment = await prisma.payment.findUnique({
        where: { id: paymentId },
        select: {
          userId: true,
          paymentStatus: true,
          amount: true,
          esewaTransactionUuid: true,
        },
      });
      if (!existingPayment) {
        console.error("Payment record not found");
        return NextResponse.json(
          { status: "error", message: "Payment not found" },
          { status: 404 },
        );
      }
      // SECURITY: Prevent payment reuse
      if (existingPayment.paymentStatus === PaymentStatus.COMPLETED) {
        console.error("Payment already processed", { paymentId });
        return NextResponse.json(
          { status: "error", message: "Payment has already been processed" },
          { status: 400 },
        );
      }
      const esewaVerifyUrl = process.env.ESEWA_VERIFY_URL;
      if (!esewaVerifyUrl) {
        console.error("ESEWA_VERIFY_URL not configured");
        return NextResponse.json(
          { status: "error", message: "eSewa verification not configured" },
          { status: 500 },
        );
      }
      try {
        // SECURITY: Call eSewa API to verify transaction
        const verifyUrl = `${esewaVerifyUrl}?product_code=${encodeURIComponent(
          process.env.ESEWA_MERCHANT_CODE!,
        )}&total_amount=${encodeURIComponent(
          decoded.total_amount,
        )}&transaction_uuid=${encodeURIComponent(decoded.transaction_uuid)}`;
        console.log("eSewa verification URL:", verifyUrl);
        const verifyResponse = await fetch(verifyUrl, {
          method: "GET",
        });
        if (!verifyResponse.ok) {
          console.error("eSewa verification failed:", verifyResponse.status);
          return NextResponse.json(
            {
              status: "error",
              message: "Payment verification failed with eSewa",
            },
            { status: 400 },
          );
        }
        const verificationResult = await verifyResponse.json();
        // SECURITY: Verify transaction UUID matches
        if (
          verificationResult.status !== "COMPLETE" ||
          verificationResult.transaction_uuid !== decoded.transaction_uuid
        ) {
          console.error("eSewa verification mismatch:", verificationResult);
          return NextResponse.json(
            {
              status: "error",
              message: "Payment verification failed - invalid transaction",
            },
            { status: 400 },
          );
        }
        // SECURITY: Verify amount matches
        const verifiedAmount = Number(verificationResult.total_amount);
        if (verifiedAmount !== existingPayment.amount) {
          console.error("Amount mismatch:", {
            expected: existingPayment.amount,
            received: verifiedAmount,
          });
          return NextResponse.json(
            { status: "error", message: "Payment amount mismatch" },
            { status: 400 },
          );
        }
        console.log("eSewa transaction verified successfully");
        // SECURITY: Check if transaction UUID was already used (fraud prevention)
        const existingPaymentWithTxn = await prisma.payment.findFirst({
          where: {
            esewaTransactionUuid: decoded.transaction_uuid,
            id: { not: paymentId },
          },
        });
        if (existingPaymentWithTxn) {
          console.error("FRAUD ALERT: eSewa transaction UUID already used:", {
            transaction_uuid: decoded.transaction_uuid,
            originalPayment: existingPaymentWithTxn.id,
            attemptedPayment: paymentId,
          });
          return NextResponse.json(
            {
              status: "error",
              message: "Transaction already used for another payment",
            },
            { status: 400 },
          );
        }
      } catch (verifyError) {
        console.error("eSewa verification error:", verifyError);
        return NextResponse.json(
          { status: "error", message: "Payment verification failed" },
          { status: 500 },
        );
      }
      // SECURITY: Use atomic update to prevent race condition
      const updateResult = await prisma.payment.updateMany({
        where: {
          id: paymentId,
          paymentStatus: { not: PaymentStatus.COMPLETED },
          esewaTransactionUuid: null,
        },
        data: {
          paymentStatus: PaymentStatus.COMPLETED,
          esewaTransactionUuid: decoded.transaction_uuid,
          esewaRefId: decoded.ref_id || null,
        },
      });
      if (updateResult.count === 0) {
        console.log("eSewa payment already processed by another request");
        return NextResponse.json(
          { status: "error", message: "Payment has already been processed" },
          { status: 400 },
        );
      }
      console.log("eSewa payment verified and updated");
      return NextResponse.json({
        status: "success",
        message: "Payment verified successfully",
      });
    }

    // Khalti Payment Verification
    if (method === PaymentMethod.KHALTI) {
      console.log("Processing KHALTI payment...");
      const khaltiTxn = pidx || transactionId;
      const khaltiPaymentId =
        paymentId || searchParams.get("purchase_order_id");
      if (!khaltiPaymentId || !khaltiTxn) {
        return NextResponse.json(
          { status: "error", message: "Missing payment details" },
          { status: 400 },
        );
      }
      // SECURITY: Check if payment exists
      const existingPayment = await prisma.payment.findUnique({
        where: { id: khaltiPaymentId },
        select: {
          paymentStatus: true,
          amount: true,
          khaltiPidx: true,
        },
      });
      if (!existingPayment) {
        console.error("Payment record not found");
        return NextResponse.json(
          { status: "error", message: "Payment not found" },
          { status: 404 },
        );
      }
      // SECURITY: Prevent payment reuse
      if (existingPayment.paymentStatus === PaymentStatus.COMPLETED) {
        console.error("Payment already processed", {
          paymentId: khaltiPaymentId,
        });
        return NextResponse.json(
          { status: "error", message: "Payment has already been processed" },
          { status: 400 },
        );
      }
      try {
        const khaltiVerifyUrl = process.env.KHALTI_VERIFY_URL;
        if (!khaltiVerifyUrl) {
          console.error("KHALTI_VERIFY_URL not configured");
          return NextResponse.json(
            {
              status: "error",
              message: "Khalti verification not configured",
            },
            { status: 500 },
          );
        }
        // SECURITY: Call Khalti API to verify payment
        const res = await fetch(khaltiVerifyUrl, {
          method: "POST",
          headers: {
            Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ pidx: khaltiTxn }),
        });
        if (!res.ok) {
          console.error("Khalti verification API failed:", res.status);
          return NextResponse.json(
            {
              status: "error",
              message: "Payment verification failed with Khalti",
            },
            { status: 400 },
          );
        }
        const json = await res.json();
        console.log("Khalti verification response:", json);
        // SECURITY: Verify the pidx belongs to this payment
        if (
          json.purchase_order_id &&
          json.purchase_order_id !== khaltiPaymentId
        ) {
          console.error("Payment ID mismatch:", {
            expected: khaltiPaymentId,
            received: json.purchase_order_id,
          });
          return NextResponse.json(
            {
              status: "error",
              message: "Payment verification failed - ID mismatch",
            },
            { status: 400 },
          );
        }
        // SECURITY: Verify amount matches (Khalti returns amount in paisa)
        if (json.total_amount) {
          const verifiedAmount = json.total_amount / 100;
          if (Math.abs(verifiedAmount - existingPayment.amount) > 0.01) {
            console.error("Amount mismatch:", {
              expected: existingPayment.amount,
              received: verifiedAmount,
            });
            return NextResponse.json(
              { status: "error", message: "Payment amount mismatch" },
              { status: 400 },
            );
          }
        }
        // SECURITY: Check payment status
        if (json.status !== "Completed" && json.state?.name !== "Completed") {
          console.warn(
            "Khalti payment not completed:",
            json.status || json.state?.name,
          );
          return NextResponse.json(
            { status: "error", message: "Payment not completed" },
            { status: 400 },
          );
        }
        console.log("Khalti payment verified successfully");
        // SECURITY: Check if pidx was already used (fraud prevention)
        const existingPaymentWithPidx = await prisma.payment.findFirst({
          where: {
            khaltiPidx: khaltiTxn,
            id: { not: khaltiPaymentId },
          },
        });
        if (existingPaymentWithPidx) {
          console.error("FRAUD ALERT: Khalti pidx already used:", {
            pidx: khaltiTxn,
            originalPayment: existingPaymentWithPidx.id,
            attemptedPayment: khaltiPaymentId,
          });
          return NextResponse.json(
            {
              status: "error",
              message: "Transaction already used for another payment",
            },
            { status: 400 },
          );
        }
        // Update payment record
        const updatedPayment = await prisma.payment.update({
          where: { id: khaltiPaymentId },
          data: {
            paymentStatus: PaymentStatus.COMPLETED,
            khaltiPidx: khaltiTxn,
          },
        });
        console.log("Khalti payment verified and updated");
        return NextResponse.json({
          status: "success",
          message: "Payment verified successfully",
        });
      } catch (err) {
        console.error("Khalti verification error:", err);
        return NextResponse.json(
          { status: "error", message: "Payment verification failed" },
          { status: 500 },
        );
      }
    }

    return NextResponse.json(
      { status: "error", message: "Invalid payment method" },
      { status: 400 },
    );
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Payment verification failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
