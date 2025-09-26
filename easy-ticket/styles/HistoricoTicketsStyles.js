import { StyleSheet } from 'react-native';

const COLORS = {
  background: '#F3ECE7',      
  button: '#E18B5D',          
  input: '#FFFFFF',           
  icon: '#7A8C8C',           
  text: '#333333',            
  textSecondary: '#B6B6A2',   
  success: '#4CAF50',         
  info: '#4A90E2',             
  danger: '#F44336',          
  border: '#D1C4B2',           
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: COLORS.text,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  ticketItem: {
    backgroundColor: COLORS.input,
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  ticketText: {
    color: COLORS.text,
    fontSize: 16,
    flex: 1,
  },
  statusIcon: {
    marginLeft: 10,
  },
  button: {
    backgroundColor: COLORS.button,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  buttonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: COLORS.textSecondary,
    fontSize: 16,
    marginTop: 40,
  },
});

export default styles;
