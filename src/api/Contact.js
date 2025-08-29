export const config = { runtime: "nodejs20.x" }; // ensure Node (not Edge)

import { Resend } from "resend";

export default async function handler(req, res) {
    try {
        if (req.method !== "POST") {
            return res.status(405).json({ error: "Method not allowed" });
        }

        // Vercel may give a string or object — normalize it
        let payload = req.body;
        if (typeof payload === "string") {
            try { payload = JSON.parse(payload); } catch { payload = {}; }
        }
        const { fullName, email, phone, country, message } = payload || {};
        if (!fullName || !email || !message) {
            return res.status(400).json({ error: "Missing fields" });
        }

        // Read env from Node process
        const { RESEND_API_KEY, CONTACT_FROM, CONTACT_TO } = process.env || {};
        if (!RESEND_API_KEY || !CONTACT_FROM || !CONTACT_TO) {
            return res.status(500).json({ error: "Server email env vars not configured" });
        }

        const resend = new Resend(RESEND_API_KEY);

        await resend.emails.send({
            from: CONTACT_FROM,                // verified sender on your domain
            to: CONTACT_TO,                    // your inbox
            reply_to: [{ email, name: fullName }], // replies go to the user
            subject: `New contact: ${fullName}`,
            text: `Name: ${fullName}
Email: ${email}
Phone: ${phone || "-"}
Country: ${country || "-"}

${message}`,
        });

        return res.status(200).json({ ok: true });
    } catch (e) {
        console.error("contact api error:", e);
        // Always return JSON so the client’s res.json() doesn’t crash
        return res.status(500).json({ error: e?.message || "Failed to send" });
    }
}
