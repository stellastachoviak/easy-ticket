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
		paddingHorizontal: '5%',
		paddingVertical: '10%',
	},
	row: {
		flexDirection: 'row',
		width: '100%',
		justifyContent: 'space-between',
		marginBottom: 20,
	},
		input: {
			backgroundColor: COLORS.input,
			borderRadius: 32,
			paddingHorizontal: 20,
			paddingVertical: 14,
			marginVertical: 12,
			width: '100%',
			minHeight: 54,
			color: COLORS.text,
			fontSize: 16,
			alignSelf: 'center',
			shadowColor: '#000',
			shadowOffset: { width: 0, height: 2 },
			shadowOpacity: 0.10,
			shadowRadius: 6,
			elevation: 3,
		},
	icon: {
		color: COLORS.icon,
		marginRight: 8,
	},
		button: {
			backgroundColor: COLORS.button,
			borderRadius: 32,
			paddingVertical: 14,
			alignItems: 'center',
			marginTop: 24,
			width: '100%',
			minHeight: 54,
			justifyContent: 'center',
			alignSelf: 'center',
			shadowColor: '#000',
			shadowOffset: { width: 0, height: 2 },
			shadowOpacity: 0.10,
			shadowRadius: 6,
			elevation: 3,
		},
	buttonText: {
		color: COLORS.text,
		fontSize: 16,
		fontWeight: 'bold',
	},
	link: {
		color: COLORS.textSecondary,
		textDecorationLine: 'underline',
		marginTop: 8,
		fontSize: 14,
		alignSelf: 'center',
	},
});

export default styles;