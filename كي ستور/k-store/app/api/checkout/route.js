import { NextResponse } from "next/server";
import { Order } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const body = await req.json();
    const required = ["customer_name", "customer_phone", "address", "items", "subtotal", "total"];
    for (const f of required) {
      if (body[f] == null || body[f] === "") {
        return NextResponse.json({ error: `الحقل مطلوب: ${f}` }, { status: 400 });
      }
    }
    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json({ error: "السلة فارغة" }, { status: 400 });
    }

    // محاكاة بوابة الدفع الإلكتروني
    const success = Math.random() > 0.02; // 98% نجاح
    if (!success) {
      return NextResponse.json({ error: "تم رفض العملية من البنك. حاول مرة أخرى." }, { status: 402 });
    }
    const transactionId = "TXN" + Date.now() + Math.floor(Math.random() * 1000);

    const { id, order_number } = Order.create({
      customer_name: body.customer_name,
      customer_phone: body.customer_phone,
      customer_email: body.customer_email,
      city: body.city,
      address: body.address,
      notes: body.notes,
      items: body.items,
      subtotal: body.subtotal,
      shipping: body.shipping || 0,
      total: body.total,
      payment_method: "card",
      payment_status: "paid",
      order_status: "pending",
      transaction_id: transactionId,
    });

    return NextResponse.json({ id, order_number, transaction_id: transactionId, status: "success" });
  } catch (err) {
    return NextResponse.json({ error: "خطأ في الخادم: " + err.message }, { status: 500 });
  }
}
