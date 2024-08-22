const CONTENT_STYLE = {
	overflow: 'hidden',
	'border-radius': '0.5rem',
	padding: '1rem',
};
const STYLE = { 'border-radius': '.5rem', 'max-width': '90%', 'max-height': '80%' };

export const DIALOG_CONFIG = {
	showHeader: false,
	baseZIndex: 100,
	style: STYLE,
	contentStyle: CONTENT_STYLE,
};

export const DIALOG_TEMPLATE = {
	LARGE_DEFAULT: {
		width: '37.5rem',
		height: '72vh',
	},
	LARGE_VERTICAL: {
		width: '30rem',
		height: '72vh',
	},
	LARGE_HORIZONTAL: {
		width: '37.5rem',
		height: '20rem',
	},
	LARGE_AUTO: {
		width: '37.5rem',
		height: 'auto',
	},
	MEDIUM_DEFAULT: {
		width: '25rem',
		height: '23rem',
	},
	MEDIUM_VERTICAL: {
		width: '17rem',
		height: '25rem',
	},
	MEDIUM_HORIZONTAL: {
		width: '25rem',
		height: '17rem',
	},
	MEDIUM_AUTO: {
		width: '25rem',
		height: 'auto',
	},
	SMALL_DEFAULT: {
		width: '20rem',
		height: '18rem',
	},
	SMALL_VERTICAL: {
		width: '12rem',
		height: '20rem',
	},
	SMALL_HORIZONTAL: {
		width: '20rem',
		height: '12rem',
	},
	SMALL_AUTO: {
		width: '20rem',
		height: 'auto',
	},
};
