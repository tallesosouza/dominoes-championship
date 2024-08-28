import type { UserInterface } from './user';

export interface ChampionInterface {
	uuid: string;
	title: string;
	description?: string;
	tournamentPhase: TournamentPhaseDto;
	players: PlayerInterface[];
	stages: StagesInterface;
	stage: number;
}

export type PlayerInterface = UserInterface & {
	status: 'ELIMINATED' | 'IN_PROGRESS' | 'CLASSIFIED';
};

export type TournamentPhaseDto =
	| 'FIRST_PHASE'
	| 'SECOND_PHASE'
	| 'THIRD_PHASE'
	| 'FOURTH_PHASE'
	| 'FIFTH_PHASE'
	| 'SIXTH_PHASE'
	| 'SEVENTH_PHASE'
	| 'SEMI_FINAL'
	| 'FINAL';

export interface StagesInterface {
	firstPhase: TablesInterface;
}

export type TablesInterface = {
	tables: Array<PlayerInterface[]>;
	status: 'START' | 'IN_PROGRESS' | 'FINALIZED';
};
