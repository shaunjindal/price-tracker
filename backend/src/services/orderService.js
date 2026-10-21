const env = require('../config/env');
const HttpError = require('../utils/httpError');
const { normalizeIndianMobile } = require('../utils/phone');
const message = require('./orderMessageService');
const whatsapp = require('./whatsappService');

// Sends the order summary from the BUSINESS WhatsApp number (configured on the server).
exports.sendOrderOnWhatsApp = async ({ phone, items: rawItems }) => {
  const mobile = normalizeIndianMobile(phone);
  if (!mobile) throw new HttpError(400, 'Enter a valid 10-digit Indian mobile number');

  const items = message.parseItems(rawItems);
  const totals = message.computeTotals(items);

  if (!whatsapp.isConfigured()) {
    throw new HttpError(503, 'WhatsApp is not set up on the server yet');
  }

  const to = `91${mobile}`; // Cloud API wants country code + number, no "+"
  const { templateName, templateLanguage } = env.whatsapp;

  const result = templateName
    ? await whatsapp.sendTemplate(to, {
        name: templateName,
        language: templateLanguage,
        params: message.buildTemplateParams(items, totals),
      })
    : await whatsapp.sendText(to, message.buildTextMessage(items, totals, env.businessName));

  return { messageId: result.messageId, total: totals.payable };
};
