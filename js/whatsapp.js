/**
 * TUWANO JEWELLERIES — WhatsApp Conversion Architecture
 * Generates properly encoded, dynamic WhatsApp links for products, cart, stores, and piercing.
 */

export const WHATSAPP_NUMBERS = {
  madukani: {
    name: "Madukani Store",
    phoneDisplay: "0679 323 647",
    intlPhone: "+255 679 323 647",
    waNumber: "255679323647"
  },
  mori: {
    name: "Mori Store",
    phoneDisplay: "0652 562 875",
    intlPhone: "+255 652 562 875",
    waNumber: "255652562875"
  },
  primary: {
    name: "Tuwano Jewelleries (Madukani)",
    phoneDisplay: "0679 323 647",
    intlPhone: "+255 679 323 647",
    waNumber: "255679323647"
  }
};

/**
 * Builds a direct WhatsApp web/app link
 * @param {string} phoneClean - numeric phone with country code e.g. "255679323647"
 * @param {string} text - message text
 * @returns {string} wa.me URL
 */
export function buildWhatsAppUrl(phoneClean, text) {
  const number = phoneClean || WHATSAPP_NUMBERS.primary.waNumber;
  const encodedText = encodeURIComponent(text.trim());
  return `https://wa.me/${number}?text=${encodedText}`;
}

/**
 * Creates dynamic product enquiry link
 */
export function createProductWhatsAppUrl(product, storeKey = "primary") {
  const store = WHATSAPP_NUMBERS[storeKey] || WHATSAPP_NUMBERS.primary;
  const text = `Hello Tuwano Jewelleries (${store.name}),\n\nI am interested in the ${product.name} (Ref: ${product.id}).\n\nPlease let me know about current availability, specifications, and pricing.\n\nThank you!`;
  return buildWhatsAppUrl(store.waNumber, text);
}

/**
 * Creates dynamic cart enquiry link
 */
export function createCartWhatsAppUrl(items, storeKey = "primary") {
  const store = WHATSAPP_NUMBERS[storeKey] || WHATSAPP_NUMBERS.primary;
  let itemsList = items.map((item, idx) => `${idx + 1}. ${item.name} (${item.quantity}x)`).join("\n");
  const text = `Hello Tuwano Jewelleries (${store.name}),\n\nI would like to enquire about the following pieces from my selection:\n\n${itemsList}\n\nPlease advise on availability and next steps for viewing or delivery.\n\nThank you!`;
  return buildWhatsAppUrl(store.waNumber, text);
}

/**
 * Creates ear piercing appointment / enquiry link
 */
export function createPiercingWhatsAppUrl(storeKey = "primary") {
  const store = WHATSAPP_NUMBERS[storeKey] || WHATSAPP_NUMBERS.primary;
  const text = `Hello Tuwano Jewelleries (${store.name}),\n\nI would like to enquire about your professional Ear Piercing service and check appointment availability.\n\nThank you!`;
  return buildWhatsAppUrl(store.waNumber, text);
}

/**
 * General store enquiry link
 */
export function createStoreEnquiryUrl(storeKey = "primary") {
  const store = WHATSAPP_NUMBERS[storeKey] || WHATSAPP_NUMBERS.primary;
  const text = `Hello Tuwano Jewelleries (${store.name}),\n\nI would like to enquire about your jewellery collections and opening hours today.\n\nThank you!`;
  return buildWhatsAppUrl(store.waNumber, text);
}
