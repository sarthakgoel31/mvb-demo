import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.phone) {
    return NextResponse.json({ error: "Phone required" }, { status: 400 });
  }

  const phone = body.phone.replace(/\D/g, "").slice(0, 10);
  if (phone.length < 10) {
    return NextResponse.json({ error: "Invalid phone" }, { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (supabaseUrl && supabaseKey) {
    const sb = createClient(supabaseUrl, supabaseKey);
    await sb.from("mvb_interest").upsert({
      phone,
      name: body.name || null,
      company: body.company || null,
      created_at: new Date().toISOString(),
    }, { onConflict: "phone" });
  }

  return NextResponse.json({ ok: true });
}
