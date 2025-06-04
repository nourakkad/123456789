import ContactFormClient from "./ContactFormClient";
import { getSettings } from "@/lib/mongodb";

export default async function ContactPage() {
  const settings = await getSettings();
  return <ContactFormClient settings={settings} />;
}
