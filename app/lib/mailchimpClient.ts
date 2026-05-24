// Backend-free Mailchimp subscribe via the classic JSONP "post-json" endpoint.
// Works on static hosting (GitHub Pages, Netlify), no API key, no server.
// The IDs below are public form IDs (same account as app/lib/mailchimp.ts).

const U = "882dc8da460ec580a87ec6cf2";
const ID = "6e7349c940";
const F_ID = "00b04fe0f0";

// Honeypot field name Mailchimp expects, submit it empty so real users pass
// and bots that fill it get rejected.
export const HONEYPOT_FIELD = `b_${U}_${ID}`;

export type MailchimpResult = {
  result: "success" | "error";
  msg: string;
};

/** Strip the leading "0 - " code and any HTML Mailchimp wraps around its message. */
export function cleanMailchimpMessage(msg: string): string {
  return (msg || "")
    .replace(/^\d+\s*-\s*/, "")
    .replace(/<[^>]*>/g, "")
    .trim();
}

/**
 * Subscribe an email address. Resolves with Mailchimp's {result,msg} on any
 * response (including "already subscribed", which comes back as result:"error").
 * Rejects only on a network/timeout failure.
 */
export function subscribeEmail(email: string): Promise<MailchimpResult> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("subscribeEmail must run in the browser"));
      return;
    }

    const callbackName = `mcjsonp_${Date.now()}_${Math.floor(
      Math.random() * 1e6
    )}`;

    const params = new URLSearchParams();
    params.set("u", U);
    params.set("id", ID);
    params.set("f_id", F_ID);
    params.set("EMAIL", email);
    params.set(HONEYPOT_FIELD, ""); // honeypot, intentionally empty
    params.set("c", callbackName); // JSONP callback

    const url = `https://gmail.us17.list-manage.com/subscribe/post-json?${params.toString()}`;

    const script = document.createElement("script");
    let settled = false;

    const cleanup = () => {
      delete (window as unknown as Record<string, unknown>)[callbackName];
      script.remove();
      clearTimeout(timer);
    };

    const timer = window.setTimeout(() => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(new Error("Mailchimp request timed out"));
    }, 10000);

    (window as unknown as Record<string, unknown>)[callbackName] = (
      data: MailchimpResult
    ) => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve(data);
    };

    script.onerror = () => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(new Error("Mailchimp request failed"));
    };

    script.src = url;
    document.body.appendChild(script);
  });
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}
