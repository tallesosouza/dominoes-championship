import type { TablesInterface } from '@core/interfaces/champion';

export const FIRST_PHASE_TABLES_QUANT = 8;
export const SECOND_PHASE_TABLES_QUANT = 6;

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
