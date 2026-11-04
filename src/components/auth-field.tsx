import { forwardRef, type ComponentRef } from 'react';
import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

type Props = TextInputProps & { label: string; error?: string };

export const AuthField = forwardRef<ComponentRef<typeof TextInput>, Props>(function AuthField(
  { label, error, style, ...rest },
  ref
) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        ref={ref}
        placeholderTextColor="#A49C94"
        style={[styles.input, error ? styles.inputError : null, style]}
        {...rest}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: { marginBottom: 16 },
  label: {
    color: '#292727',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E9DFD2',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#292727',
  },
  inputError: { borderColor: '#B3261E' },
  error: { color: '#B3261E', fontSize: 12, marginTop: 6 },
});
