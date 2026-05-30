import { NextResponse } from "next/server";
import { createHash } from "node:crypto";

// Mailchimp Marketing API needs Node (crypto + Buffer), not the Edge runtime.
export const runtime = "nodejs";
// Never cache this handler.
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Body = {
  email?: string;
  tool?: string;
  // Hidden honeypot field — real users leave it empty, bots tend to fill it.
  website?: string;
};

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  // Honeypot: if the hidden field is filled, it's almost certainly a bot.
  // Pretend everything is fine and silently skip Mailchimp.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  const tool = (body.tool ?? "").trim();

  // Server-side validation — never trust the client.
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  const apiKey = process.env.MAILCHIMP_API_KEY;
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;
  const prefix = process.env.MAILCHIMP_SERVER_PREFIX;

  if (!apiKey || !audienceId || !prefix) {
    console.error("[subscribe] Missing Mailchimp environment variables.");
    return NextResponse.json(
      { error: "The mailing list isn't configured right now." },
      { status: 500 }
    );
  }

  // Basic auth: any non-empty username + the API key as the password.
  const auth = `Basic ${Buffer.from(`anystring:${apiKey}`).toString("base64")}`;
  // Mailchimp keys members by the MD5 of the lowercased email address.
  const hash = createHash("md5").update(email).digest("hex");
  const memberUrl = `https://${prefix}.api.mailchimp.com/3.0/lists/${audienceId}/members/${hash}`;

  try {
    // 1) Upsert the member. PUT is idempotent, so existing emails don't error.
    //    Use status_if_new "subscribed" (single opt-in). Switch to "pending"
    //    here if this audience's signup form uses double opt-in.
    const upsert = await fetch(memberUrl, {
      method: "PUT",
      headers: { Authorization: auth, "Content-Type": "application/json" },
      body: JSON.stringify({
        email_address: email,
        status_if_new: "subscribed",
      }),
    });

    if (!upsert.ok) {
      const detail = (await upsert.json().catch(() => null)) as {
        title?: string;
      } | null;
      console.error(
        "[subscribe] member upsert failed:",
        upsert.status,
        detail?.title
      );
      return NextResponse.json(
        { error: "Couldn't add you to the list right now." },
        { status: 502 }
      );
    }

    // 2) Tag the member: "Level Zero" plus the specific tool name.
    const tags: { name: string; status: "active" }[] = [
      { name: "Level Zero", status: "active" },
    ];
    if (tool) tags.push({ name: tool, status: "active" });

    const tagRes = await fetch(`${memberUrl}/tags`, {
      method: "POST",
      headers: { Authorization: auth, "Content-Type": "application/json" },
      body: JSON.stringify({ tags }),
    });

    // Tagging returns 204 on success. If it fails the member is still
    // subscribed, so log it but don't fail the whole request.
    if (!tagRes.ok) {
      const detail = (await tagRes.json().catch(() => null)) as {
        title?: string;
      } | null;
      console.error("[subscribe] tagging failed:", tagRes.status, detail?.title);
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("[subscribe] network error:", err);
    return NextResponse.json(
      { error: "Couldn't reach the mailing list right now." },
      { status: 502 }
    );
  }
}
