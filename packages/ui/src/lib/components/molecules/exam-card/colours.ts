import type { ColorVariant } from '../../../../types';

// export type StatusColour =
//   | 'pink'
//   | 'tangerine'
//   | 'orange'
//   | 'yellow'
//   | 'green'
//   | 'teal'
//   | 'sky'
//   | 'indigo'
//   | 'purple'
//   | 'neutral'
//   | 'error'

//NOTE: Temporary
export type StatusColour = ColorVariant | 'error';

export type StatusColourSet = {
	border: string;
	fill: string;
	text: string;
};

export const COLOURS: Record<StatusColour, StatusColourSet> = {
	pink: { border: '#F57FC6', fill: '#FDD8EE', text: '#C7117F' },
	tangerine: { border: '#F68E5F', fill: '#FFD7C3', text: '#F05E1F' },
	orange: { border: '#FEA339', fill: '#FFE2BF', text: '#E87D00' },
	yellow: { border: '#F9C93F', fill: '#FFF3D2', text: '#E39600' },
	green: { border: '#6CD62B', fill: '#D1FEB6', text: '#4B991C' },
	teal: { border: '#2BD6AD', fill: '#D9FFF6', text: '#349A82' },
	sky: { border: '#35A1EF', fill: '#DAEFFE', text: '#0C5A93' },
	indigo: { border: '#8170F1', fill: '#DCD7FF', text: '#211090' },
	purple: { border: '#C865EA', fill: '#F3D6FD', text: '#681A83' },
	neutral: { border: '#B2B5C7', fill: '#F6F6F9', text: '#555A74' },
	error: { border: '#F96666', fill: '#F96666', text: '#F96666' }
};
