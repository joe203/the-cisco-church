import { sendSms } from "@/lib/sms";
import { getServiceClient } from "@/lib/supabase/server";

/**
 * The "new email" text. DEFAULT OFF: MAIL_ALERT_SMS_ENABLED must be exactly
 * "true" and OPERATOR_PHONE set. The text is a constant — nothing from the
 * email (sender, subject, words) ever goes into it, because strangers write
 * that content. Suspected spam never triggers one, and a burst of mail sends
 * at most one text every ten minutes.
 */
const TEXT = "The Cisco Church: you have new email. theciscochurch.org/staff/mail";
const QUIET_MINUTES = 10;

export async function alertNewMail(id: string): Promise<void> {
  if (process.env.MAIL_ALERT_SMS_ENABLED !== "true") return;
  const phone = process.env.OPERATOR_PHONE;
  const db = getServiceClient();
  if (!phone || !db) return;

  const since = new Date(Date.now() - QUIET_MINUTES * 60_000).toISOString();
  const { data: recent } = await db
    .from("cisco_mail")
    .select("id")
    .eq("metadata->>alerted", "true")
    .gt("created_at", since)
    .limit(1);
  if (recent && recent.length > 0) return;

  if (await sendSms(phone, TEXT)) {
    const { data: row } = await db.from("cisco_mail").select("metadata").eq("id", id).maybeSingle();
    await db
      .from("cisco_mail")
      .update({ metadata: { ...((row?.metadata as object | null) ?? {}), alerted: true } })
      .eq("id", id);
  }
}
