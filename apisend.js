export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, email, phone, message, time } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": "Bearer re_S9nvCQz6_GGKkZZ3gpxLPK2UoskZ9TTqW",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "Pipe Pros Toronto <noreply@pipeprostoronto.ca>",
        to: ["pipeprostoronto@gmail.com"],
        reply_to: email,
        subject: "New Customer Inquiry — Pipe Pros Toronto",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #f9f9f9;">
            <div style="background: #1B6BFF; padding: 24px; border-radius: 8px 8px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 22px;">New Customer Inquiry</h1>
              <p style="color: rgba(255,255,255,0.8); margin: 4px 0 0; font-size: 14px;">Pipe Pros Toronto — pipeprostoronto.ca</p>
            </div>
            <div style="background: white; padding: 24px; border-radius: 0 0 8px 8px; border: 1px solid #e0e0e0;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #666; font-size: 13px; width: 100px;">Name</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-weight: bold;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #666; font-size: 13px;">Email</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;"><a href="mailto:${email}" style="color: #1B6BFF;">${email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #666; font-size: 13px;">Phone</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;">${phone || "Not provided"}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #666; font-size: 13px;">Time</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;">${time || new Date().toLocaleString("en-CA", {timeZone: "America/Toronto"})}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #666; font-size: 13px; vertical-align: top;">Issue</td>
                  <td style="padding: 10px 0; line-height: 1.6;">${message.replace(/\n/g, "<br>")}</td>
                </tr>
              </table>
              <div style="margin-top: 24px; padding: 16px; background: #f0f6ff; border-radius: 6px; border-left: 4px solid #1B6BFF;">
                <p style="margin: 0; font-size: 13px; color: #555;">Reply directly to this email to respond to ${name}, or call <strong>(647) 494-4928</strong></p>
              </div>
            </div>
          </div>
        `
      })
    });

    const data = await response.json();

    if (response.ok) {
      return res.status(200).json({ success: true, id: data.id });
    } else {
      console.error("Resend error:", data);
      return res.status(500).json({ error: data.message || "Failed to send email" });
    }

  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Server error: " + err.message });
  }
}
