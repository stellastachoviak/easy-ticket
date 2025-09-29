// ...existing code...
import { StyleSheet } from 'react-native';

const COLORS = {
	background: '#F3ECE7',
	button: '#E18B5D',
	input: '#FFFFFF',
	icon: '#7A8C8C',
	text: '#333333',
	textSecondary: '#7A8C8C',
	border: '#D8D8D8',
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
		form: {
			width: '100%',
			maxWidth: 400,
			alignSelf: 'center',
			gap: 16,
		},
	row: {
		flexDirection: 'row',
		width: '100%',
		justifyContent: 'space-between',
		marginBottom: 20,
	},
			inputRow: {
				flexDirection: 'row',
				alignItems: 'center',
				backgroundColor: COLORS.input,
				borderRadius: 20,
				marginVertical: 8,
				paddingHorizontal: 16,
				minHeight: 48,
				width: '100%',
				marginBottom: 8,
			},
		icon: {
			color: COLORS.text,
			marginRight: 8,
		},
		button: {
			backgroundColor: COLORS.button,
			borderRadius: 20,
			paddingVertical: 14,
			alignItems: 'center',
			marginTop: 16,
			width: '100%',
			minHeight: 48,
			justifyContent: 'center',
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