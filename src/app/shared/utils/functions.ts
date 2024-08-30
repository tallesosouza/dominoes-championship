import type { PlayerInterface } from '@core/interfaces/champion';
import { PLAYERS_TABLE_DEFAULT_QUANT } from '@shared/helpers/champion-config';

export function generateUUID(): string {
	let uuid = '';
	for (let i = 0; i < 36; i++) {
		if (i === 8 || i === 13 || i === 18 || i === 23) {
			uuid += '-';
		} else if (i === 14) {
			uuid += '4';
		} else {
			const random = (Math.random() * 16) | 0;
			uuid += i === 19 ? ((random & 0x3) | 0x8).toString(16) : random.toString(16);
		}
	}
	return uuid;
}

export function createEmptyArrays(quantity: number) {
	return Array.from({ length: quantity }, () => []);
}

export function shuffleArray(array: PlayerInterface[]) {
	return array.sort(() => Math.random() - 0.5);
}

export function distributePlayers(
	dto: Array<PlayerInterface[]>,
	maxTables: number,
	maxPlayersPerTable = PLAYERS_TABLE_DEFAULT_QUANT,
) {
	const previousMatches = new Map<string, Set<string>>();
	const availablePlayers = new Set<string>();
	const leftovers: PlayerInterface[] = [];
	const groups: Array<PlayerInterface[]> = [];

	// Preencher o mapa com todos os jogadores que já jogaram juntos
	// biome-ignore lint/complexity/noForEach: <explanation>
	dto.forEach((table) => {
		// biome-ignore lint/complexity/noForEach: <explanation>
		table.forEach((player) => {
			if (!previousMatches.has(player.uuid)) {
				previousMatches.set(player.uuid, new Set<string>());
			}
			// biome-ignore lint/complexity/noForEach: <explanation>
			table.forEach((opponent) => {
				if (opponent.uuid !== player.uuid) {
					previousMatches.get(player.uuid)?.add(opponent.uuid);
				}
			});
		});
	});

	// Adicionar todos os jogadores à lista de disponíveis
	// biome-ignore lint/complexity/noForEach: <explanation>
	dto.forEach((table) => {
		// biome-ignore lint/complexity/noForEach: <explanation>
		table.forEach((player) => {
			availablePlayers.add(player.uuid);
		});
	});

	// Função para verificar se o jogador pode ser adicionado à mesa
	function canAddToTable(table: PlayerInterface[], player: PlayerInterface): boolean {
		return table.every(
			(currentPlayer) => !previousMatches.get(player.uuid)?.has(currentPlayer.uuid),
		);
	}

	// Distribuir os jogadores nas mesas
	for (let i = 0; i < maxTables && availablePlayers.size > 0; i++) {
		const table: PlayerInterface[] = [];
		for (const playerUuid of availablePlayers) {
			// biome-ignore lint/style/noNonNullAssertion: <explanation>
			const player = dto.flat().find((p) => p.uuid === playerUuid)!;
			if (canAddToTable(table, player)) {
				table.push(player);
				availablePlayers.delete(playerUuid);
				if (table.length === maxPlayersPerTable) break;
			}
		}
		if (table.length > 0) {
			groups.push(table);
		}
	}

	// Jogadores que não conseguiram ser colocados em nenhuma mesa
	// biome-ignore lint/complexity/noForEach: <explanation>
	dto.flat().forEach((player) => {
		if (availablePlayers.has(player.uuid)) {
			leftovers.push(player);
		}
	});

	// Preencher mesas incompletas com jogadores do leftovers
	// biome-ignore lint/complexity/noForEach: <explanation>
	groups.forEach((table) => {
		while (table.length < maxPlayersPerTable && leftovers.length > 0) {
			const randomIndex = Math.floor(Math.random() * leftovers.length);
			const player = leftovers[randomIndex];

			table.push(player);
			leftovers.splice(randomIndex, 1); // Remove o jogador dos leftovers
		}
	});

	return { groups, leftovers };
}
