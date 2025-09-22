import { StyleSheet } from 'react-native';

const COLORS = {
	background: '#D8BBA5',
	button: '#E18B5D',
	input: '#B6B6A2',
	icon: '#7A8C8C',
	text: '#FFFFFF',
	textSecondary: '#B6B6A2',
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: COLORS.background,
		alignItems: 'center',
		justifyContent: 'center',
		padding: 20,
	},
	ticketBox: {
		backgroundColor: COLORS.input,
		borderRadius: 20,
		padding: 16,
		marginVertical: 8,
		width: '100%',
		alignItems: 'center',
	},
	ticketText: {
		color: COLORS.icon,
		fontSize: 16,
	},
	button: {
		backgroundColor: COLORS.button,
		borderRadius: 20,
		paddingVertical: 12,
		paddingHorizontal: 32,
		alignItems: 'center',
		marginTop: 16,
		width: '100%',
	},
	buttonText: {
		color: COLORS.text,
		fontSize: 16,
		fontWeight: 'bold',
	},
});

export default styles;