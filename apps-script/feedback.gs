// paste into Extensions > Apps Script of the feedback spreadsheet, then Deploy > Web app (execute as me, access: anyone)
const TO = "incadent.help@gmail.com";
const MAX_MESSAGE = 5000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function doPost(e) {
  const p = e.parameter;
  // the hidden field is filled only by bots
  if (p.website) return ok();
  const message = String(p.message || "").trim().slice(0, MAX_MESSAGE);
  if (!message) return ok();
  const topic = String(p.topic || "").slice(0, 40);
  const name = String(p.name || "").slice(0, 100);
  const email = String(p.email || "").trim().slice(0, 200);
  const lang = String(p.lang || "").slice(0, 5);
  const validEmail = EMAIL_RE.test(email) ? email : "";

  SpreadsheetApp.getActiveSpreadsheet().getSheets()[0].appendRow([new Date(), topic, name, email, lang, message]);

  const first = message.split("\n")[0].slice(0, 48);
  const options = { to: TO, subject: "Incadent · " + topic + ": " + first, body: message + "\n\n— " + (name || "-") + (email ? " <" + email + ">" : "") + " [" + lang + "]" };
  if (validEmail) options.replyTo = validEmail;
  MailApp.sendEmail(options);
  return ok();
}

function ok() {
  return ContentService.createTextOutput("ok");
}
