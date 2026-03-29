import { prisma } from "@/db/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // In Next.js 15/16, params is a Promise
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ message: "ID is missing" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: id },
      include: { orderItems: true },
    });

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({
      orderId: order.id,
      totalPrice: order.totalPrice.toString(),
      productName: order.orderItems[0]?.name || "Payment",
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
