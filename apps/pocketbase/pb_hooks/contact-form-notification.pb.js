/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  // Fetch the settings record to get the admin email address
  const settings = $app.findFirstRecordByFilter("settings", "id != ''");
  let adminEmail = "admin@example.com"; // fallback
  
  if (settings) {
    adminEmail = settings.get("email_address");
  }
  
  const senderName = e.record.get("sender_name");
  const senderEmail = e.record.get("sender_email");
  const message = e.record.get("message");
  const createdAt = e.record.get("created_at");
  
  const message_obj = new MailerMessage({
    from: {
      address: $app.settings().meta.senderAddress,
      name: $app.settings().meta.senderName
    },
    to: [{ address: adminEmail }],
    subject: "New Contact Form Submission from MotionZ Website",
    html: "<h2>New Contact Form Submission</h2><p><strong>Name:</strong> " + senderName + "</p><p><strong>Email:</strong> " + senderEmail + "</p><p><strong>Message:</strong></p><p>" + message + "</p><p><strong>Submitted at:</strong> " + createdAt + "</p>"
  });
  
  $app.newMailClient().send(message_obj);
  e.next();
}, "contact_submissions");