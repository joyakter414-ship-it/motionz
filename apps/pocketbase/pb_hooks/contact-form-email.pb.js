/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  // Fetch the settings record to get the admin email address
  const settings = $app.findFirstRecordByData("settings", "id", "");
  let adminEmail = "admin@example.com"; // fallback
  
  if (settings) {
    adminEmail = settings.get("email_address");
  }
  
  const submitterName = e.record.get("name");
  const submitterEmail = e.record.get("email");
  const submitterMessage = e.record.get("message");
  
  const message = new MailerMessage({
    from: {
      address: $app.settings().meta.senderAddress,
      name: $app.settings().meta.senderName
    },
    to: [{ address: adminEmail }],
    subject: "New Contact Form Submission from " + submitterName,
    html: "<p><strong>Name:</strong> " + submitterName + "</p><p><strong>Email:</strong> " + submitterEmail + "</p><p><strong>Message:</strong></p><p>" + submitterMessage + "</p>"
  });
  
  $app.newMailClient().send(message);
  e.next();
}, "contact_submissions");