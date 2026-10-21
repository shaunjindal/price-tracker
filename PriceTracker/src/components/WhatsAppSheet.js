import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import BottomSheet from './BottomSheet';
import { formatPrice } from './PriceTag';
import { sendOrderOnWhatsApp } from '../api/orderApi';
import { cleanIndianInput, validateIndianMobile, formatMobile } from '../utils/phone';
import { colors, radius, spacing } from '../theme';

function WhatsAppForm({ items, totals, onClose, onStartNew }) {
  const [digits, setDigits] = useState('');
  const [touched, setTouched] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [serverError, setServerError] = useState('');

  const { valid, error } = validateIndianMobile(digits);
  const showError = !valid && (touched || digits.length === 10);

  const send = async () => {
    setTouched(true);
    if (!valid || status === 'sending') return;
    setStatus('sending');
    setServerError('');
    try {
      await sendOrderOnWhatsApp({ phone: digits, items });
      setStatus('sent');
    } catch (e) {
      setServerError(e.message);
      setStatus('error');
    }
  };

  if (status === 'sent') {
    return (
      <View style={styles.done}>
        <Text style={styles.doneIcon}>✅</Text>
        <Text style={styles.doneTitle}>Order sent on WhatsApp</Text>
        <Text style={styles.doneText}>
          Sent to +91 {formatMobile(digits)} · Total {formatPrice(totals.payable)}
        </Text>
        <View style={styles.doneActions}>
          <TouchableOpacity style={[styles.btn, styles.btnOutline]} onPress={onClose}>
            <Text style={styles.btnOutlineText}>Done</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.btnSolid]} onPress={onStartNew}>
            <Text style={styles.btnSolidText}>Start new order</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const sending = status === 'sending';

  return (
    <>
      <Text style={styles.summary}>
        {totals.lines} {totals.lines === 1 ? 'item' : 'items'} · Total {formatPrice(totals.payable)}
      </Text>

      <Text style={styles.label}>Customer WhatsApp number</Text>
      <View style={[styles.phoneRow, showError && styles.phoneRowError, valid && styles.phoneRowOk]}>
        <Text style={styles.prefix}>+91</Text>
        <TextInput
          style={styles.phoneInput}
          value={formatMobile(digits)}
          onChangeText={(t) => setDigits(cleanIndianInput(t))}
          onBlur={() => setTouched(true)}
          placeholder="98765 43210"
          placeholderTextColor={colors.muted}
          keyboardType="phone-pad"
          maxLength={18}
          editable={!sending}
          autoFocus
        />
        {valid ? <Text style={styles.tick}>✓</Text> : null}
      </View>
      {showError ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <Text style={styles.hint}>10-digit Indian mobile number (starts with 6, 7, 8 or 9)</Text>
      )}

      {status === 'error' ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorBoxText}>{serverError}</Text>
        </View>
      ) : null}

      <TouchableOpacity
        style={[styles.sendBtn, (!valid || sending) && styles.sendBtnOff]}
        onPress={send}
        disabled={!valid || sending}
        activeOpacity={0.85}
      >
        {sending ? (
          <View style={styles.sendingRow}>
            <ActivityIndicator color="#fff" />
            <Text style={styles.sendText}>Sending...</Text>
          </View>
        ) : (
          <Text style={styles.sendText}>{status === 'error' ? 'Try again' : 'Send on WhatsApp'}</Text>
        )}
      </TouchableOpacity>
      <Text style={styles.note}>Sent from the store&apos;s WhatsApp number, not your phone.</Text>
    </>
  );
}

export default function WhatsAppSheet({ visible, onClose, items, totals, onStartNew }) {
  return (
    <BottomSheet visible={visible} onClose={onClose} title="Send order on WhatsApp">
      <WhatsAppForm
        items={items}
        totals={totals}
        onClose={onClose}
        onStartNew={() => {
          onStartNew();
          onClose();
        }}
      />
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  summary: { fontSize: 13, color: colors.muted },
  label: { fontSize: 12, color: colors.muted, fontWeight: '600', marginTop: 2 },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    backgroundColor: colors.card,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
  },
  phoneRowError: { borderColor: colors.danger },
  phoneRowOk: { borderColor: colors.whatsapp },
  prefix: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    paddingRight: 10,
    marginRight: 10,
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  phoneInput: { flex: 1, fontSize: 18, fontWeight: '600', color: colors.text, letterSpacing: 0.5 },
  tick: { color: colors.whatsapp, fontSize: 20, fontWeight: '800' },
  hint: { fontSize: 12, color: colors.muted },
  error: { fontSize: 12, color: colors.danger, fontWeight: '600' },
  errorBox: { backgroundColor: '#FEE2E2', borderRadius: radius.sm, padding: spacing.sm + 2 },
  errorBoxText: { color: colors.danger, fontSize: 13 },
  sendBtn: {
    marginTop: spacing.sm,
    height: 50,
    borderRadius: radius.pill,
    backgroundColor: colors.whatsapp,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnOff: { opacity: 0.45 },
  sendingRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  sendText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  note: { fontSize: 11, color: colors.muted, textAlign: 'center' },
  done: { alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.sm },
  doneIcon: { fontSize: 44 },
  doneTitle: { fontSize: 18, fontWeight: '800', color: colors.text },
  doneText: { fontSize: 14, color: colors.muted, textAlign: 'center' },
  doneActions: { flexDirection: 'row', gap: spacing.sm + 2, marginTop: spacing.sm },
  btn: { flex: 1, height: 46, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
  btnOutline: { borderWidth: 1, borderColor: colors.primary },
  btnOutlineText: { color: colors.primary, fontWeight: '700' },
  btnSolid: { backgroundColor: colors.primary },
  btnSolidText: { color: '#fff', fontWeight: '700' },
});
