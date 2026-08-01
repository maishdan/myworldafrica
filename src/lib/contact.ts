export const CONTACT = {
  email: "myworldafrica1@gmail.com",
  phoneDisplay: "0701 460 110",
  phoneRaw: "0701460110",
  phoneIntl: "+254701460110",
  whatsapp: "254701460110",
  location: "Nairobi, Kenya",
} as const;

export const telHref = `tel:${CONTACT.phoneIntl}`;
export const smsHref = `sms:${CONTACT.phoneIntl}`;
export const whatsappHref = `https://wa.me/${CONTACT.whatsapp}`;
export const mailHref = `mailto:${CONTACT.email}`;
