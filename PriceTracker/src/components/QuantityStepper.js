import { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { colors, radius } from '../theme';
import { MIN_QTY, MAX_QTY } from '../utils/orderMath';

const clamp = (n) => Math.min(MAX_QTY, Math.max(MIN_QTY, n));

// Modern quantity control: tap +/- , HOLD to repeat (speeds up), or type a number.
export default function QuantityStepper({ value, onChange, compact = false }) {
  const [text, setText] = useState(String(value));
  const valueRef = useRef(value);
  const onChangeRef = useRef(onChange);
  const delayTimer = useRef(null);
  const repeatTimer = useRef(null);
  onChangeRef.current = onChange;

  useEffect(() => {
    valueRef.current = value;
    setText(String(value));
  }, [value]);

  const stopHold = () => {
    clearTimeout(delayTimer.current);
    clearInterval(repeatTimer.current);
  };
  useEffect(() => stopHold, []);

  const step = (delta) => {
    const next = clamp(valueRef.current + delta);
    if (next !== valueRef.current) {
      valueRef.current = next;
      setText(String(next));
      onChangeRef.current(next);
    }
  };

  const startHold = (delta) => {
    stopHold();
    step(delta);
    delayTimer.current = setTimeout(() => {
      let ticks = 0;
      repeatTimer.current = setInterval(() => {
        ticks += 1;
        step(ticks > 12 ? delta * 10 : delta); // speeds up after ~1 second
      }, 80);
    }, 400);
  };

  const onChangeText = (t) => {
    const digits = t.replace(/\D/g, '').slice(0, 4);
    if (digits === '') return setText('');
    const n = parseInt(digits, 10);
    if (n === 0) return setText('0'); // let the user keep typing, fixed on blur
    const next = clamp(n);
    valueRef.current = next;
    setText(String(next));
    onChangeRef.current(next);
  };

  const h = compact ? 34 : 42;
  const atMin = value <= MIN_QTY;
  const atMax = value >= MAX_QTY;

  return (
    <View style={[styles.box, { height: h, borderRadius: h / 2 }]}>
      <Pressable
        style={[styles.btn, { width: h, height: h }, atMin && styles.btnOff]}
        onPressIn={() => startHold(-1)}
        onPressOut={stopHold}
        hitSlop={4}
      >
        <Text style={[styles.sign, atMin && styles.signOff]}>−</Text>
      </Pressable>

      <TextInput
        style={[styles.input, { width: compact ? 52 : 64 }]}
        value={text}
        onChangeText={onChangeText}
        onBlur={() => setText(String(valueRef.current))}
        keyboardType="number-pad"
        selectTextOnFocus
        maxLength={4}
      />

      <Pressable
        style={[styles.btn, { width: h, height: h }, atMax && styles.btnOff]}
        onPressIn={() => startHold(1)}
        onPressOut={stopHold}
        hitSlop={4}
      >
        <Text style={[styles.sign, atMax && styles.signOff]}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    backgroundColor: colors.primarySoft,
  },
  btnOff: { backgroundColor: colors.bg },
  sign: { fontSize: 22, color: colors.primary, fontWeight: '600', marginTop: -2 },
  signOff: { color: colors.border },
  input: { textAlign: 'center', fontSize: 16, fontWeight: '700', color: colors.text, padding: 0 },
});
