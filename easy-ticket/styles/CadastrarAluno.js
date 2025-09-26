import { StyleSheet } from 'react-native';

const COLORS = {
  background: '#F3ECE7',
  primary: '#E18B5D',
  success: '#4CAF50',
  danger: '#F44336',
  card: '#FFFFFF',
  text: '#333333',
  textSecondary: '#7A8C8C',
  border: '#D8D8D8',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    backgroundColor: COLORS.card,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    fontSize: 16,
    color: COLORS.text,
  },
  pickerContainer: {
    width: '100%',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
    overflow: 'hidden',
  },
  picker: {
    width: '100%',
  },
  pickerItem: {
    height: 50,
    fontSize: 16,
    color: COLORS.text,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  buttonText: {
    color: COLORS.card,
    fontSize: 16,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  item: {
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  itemText: {
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 8,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  smallButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  smallButtonText: {
    color: COLORS.card,
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default styles;
