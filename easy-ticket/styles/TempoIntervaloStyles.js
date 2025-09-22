import { StyleSheet } from 'react-native';

const COLORS = {
	background: '#6B4F3F',
	button: '#835635ff',
	input: '#B6B6A2',
	icon: '#000000ff',
	text: '#ffffffff',
	textSecondary: '#000000ff',
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: COLORS.background,
		alignItems: 'center',
		justifyContent: 'center',
		padding: 20,
	},
	timerBox: {
		backgroundColor: COLORS.input,
		borderRadius: 20,
		padding: 16,
		marginVertical: 8,
		width: '100%',
		alignItems: 'center',
	},
	timerText: {
		color: COLORS.icon,
		fontSize: 32,
		fontWeight: 'bold',
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