import ContactFormClient from "./ContactFormClient";
import { getSettings, getHomepageSettings } from "@/lib/data";

export default async function ContactPage() {
  const settings = await getSettings();
  const homepageSettings = await getHomepageSettings();
  return <ContactFormClient settings={settings} homepageSettings={homepageSettings} />;
}
