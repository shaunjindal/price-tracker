import { post } from './client';
import { toMessageItems } from '../utils/orderMath';

// phone = 10 digit Indian mobile (already validated in the UI, validated again by the server).
// The SENDER number is decided by the backend.
export const sendOrderOnWhatsApp = ({ phone, items }) =>
  post('/orders/whatsapp', { phone, items: toMessageItems(items) });
