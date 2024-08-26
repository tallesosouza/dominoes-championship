import type { UserInterface } from './user';

export interface ChampionInterface {
	uuid: string;
	title: string;
	description?: string;
	tournamentPhase:
		| 'FIRST_PHASE'
		| 'SECOND_PHASE'
		| 'THIRD_PHASE'
		| 'FOURTH_PHASE'
		| 'FIFTH_PHASE'
		| 'SIXTH_PHASE'
		| 'SEVENTH_PHASE'
		| 'SEMI_FINAL'
		| 'FINAL';
	players: Array<UserInterface & { status: 'ELIMINATED' | 'IN_PROGRESS' | 'CLASSIFIED' }>;
}
