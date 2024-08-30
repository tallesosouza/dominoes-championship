import type { TablesInterface } from '@core/interfaces/champion';

export const FIRST_PHASE_TABLES_QUANT = 8;
export const SECOND_PHASE_TABLES_QUANT = 6;
export const THIRD_PHASE_TABLES_QUANT = 4;
export const FOURTH_PHASE_TABLES_QUANT = 3;
export const FIFTH_PHASE_TABLES_QUANT = 3;
export const SIXTH_PHASE_TABLES_QUANT = 2;
export const SEVENTH_PHASE_TABLES_QUANT = 1;
export const EIGHTH_PHASE_TABLES_QUANT = 1;

export const PLAYERS_TABLE_DEFAULT_QUANT = 4;

export function isFirstPhaseValid(data: TablesInterface) {
	const eliminatedQuant = data.tables.flatMap((res) =>
		res.filter((res) => res.status === 'ELIMINATED'),
	);

	if (eliminatedQuant.length === FIRST_PHASE_TABLES_QUANT) {
		return true;
	}
	return false;
}

export function isSecondPhaseValid(data: TablesInterface) {
	const eliminatedQuant = data.tables.flatMap((res) =>
		res.filter((res) => res.status === 'ELIMINATED'),
	);

	if (eliminatedQuant.length === SECOND_PHASE_TABLES_QUANT) {
		return true;
	}
	return false;
}

export function isThirdPhaseValid(data: TablesInterface) {
	const eliminatedQuant = data.tables.flatMap((res) =>
		res.filter((res) => res.status === 'ELIMINATED'),
	);

	if (eliminatedQuant.length === THIRD_PHASE_TABLES_QUANT) {
		return true;
	}
	return false;
}

export function isFourthPhaseValid(data: TablesInterface) {
	const eliminatedQuant = data.tables.flatMap((res) =>
		res.filter((res) => res.status === 'ELIMINATED'),
	);

	if (eliminatedQuant.length === FOURTH_PHASE_TABLES_QUANT) {
		return true;
	}
	return false;
}

export function isFifthPhaseValid(data: TablesInterface) {
	const eliminatedQuant = data.tables.flatMap((res) =>
		res.filter((res) => res.status === 'ELIMINATED'),
	);

	if (eliminatedQuant.length === FIFTH_PHASE_TABLES_QUANT) {
		return true;
	}
	return false;
}

export function isSixthPhaseValid(data: TablesInterface) {
	const eliminatedQuant = data.tables.flatMap((res) =>
		res.filter((res) => res.status === 'ELIMINATED'),
	);

	if (eliminatedQuant.length === SIXTH_PHASE_TABLES_QUANT * 2) {
		return true;
	}
	return false;
}

export function isSeventhPhaseValid(data: TablesInterface) {
	const eliminatedQuant = data.tables.flatMap((res) =>
		res.filter((res) => res.status === 'ELIMINATED'),
	);

	if (eliminatedQuant.length === SEVENTH_PHASE_TABLES_QUANT * 2) {
		return true;
	}
	return false;
}

export function isEighthPhaseValid(data: TablesInterface) {
	const eliminatedQuant = data.tables.flatMap((res) =>
		res.filter((res) => res.status === 'ELIMINATED'),
	);

	if (eliminatedQuant.length === EIGHTH_PHASE_TABLES_QUANT) {
		return true;
	}
	return false;
}
