// All server settings come from environment variables (set them on Render).
module.exports = {
  businessName: process.env.BUSINESS_NAME || 'Our Store',

  // Optional shared key. If set, the app must send it in the x-api-key header.
  appApiKey: process.env.APP_API_KEY || '',

  whatsapp: {
    // The WhatsApp Business number that SENDS the messages is the one linked to
    // this phone number id on Meta. Workers' own numbers are never used.
    token: process.env.WHATSAPP_TOKEN || '',
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
    apiVersion: process.env.WHATSAPP_API_VERSION || 'v25.0',
    // If set, an approved template is used (needed to message customers who have
    // not messaged you in the last 24 hours). If empty, a plain text message is sent.
    templateName: process.env.WHATSAPP_TEMPLATE_NAME || '',
    templateLanguage: process.env.WHATSAPP_TEMPLATE_LANG || 'en',
  },
};
