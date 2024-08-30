import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import type { PlayerInterface, StagesInterface, TablesInterface } from '@core/interfaces/champion';
import type { ToastInterface } from '@core/interfaces/toats';
import { ChampionStageSummaryComponent } from '@shared/components/champion-stage-summary/champion-stage-summary.component';
import { DeskCardComponent } from '@shared/components/desk-card/desk-card.component';
import { SEVENTH_PHASE_TABLES_QUANT, isSeventhPhaseValid } from '@shared/helpers/champion-config';
import { createEmptyArrays } from '@shared/utils/functions';
import { MessageService } from 'primeng/api';
import { ButtonDirective } from 'primeng/button';

type DrawChangeDTO = Pick<StagesInterface, 'seventhPhase'>;

@Component({
	selector: 'app-champion-progress-seventh-step',
	standalone: true,
	imports: [DeskCardComponent, ButtonDirective, ChampionStageSummaryComponent],
	templateUrl: './champion-progress-seventh-step.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChampionProgressSeventhStepComponent {
	private messageService = inject(MessageService);

	protected onNextChange = output();
	protected onPrevChange = output();
	protected onUpdateResult = output<StagesInterface>();
	protected onDrawChange = output<StagesInterface>();
	public gridData = input.required<TablesInterface>();
	public players = input.required<Array<PlayerInterface[]>>();

	protected drawButtonDisabled = computed(() => {
		if (this.gridData()?.status !== 'START') {
			return true;
		}
		return false;
	});

	protected nextChange() {
		if (this.logicNextValid().isValid) {
			this.onNextChange.emit();
		} else {
			this.showToast({
				severity: 'warn',
				summary: 'Alerta',
				detail: this.logicNextValid().message,
			});
		}
	}

	private logicNextValid() {
		const dto = {
			isValid: false,
			message: '',
		};
		if (this.gridData()?.status === 'START') {
			dto.message = 'Efetue o sorteio para poder prosseguir';
		} else if (!isSeventhPhaseValid(this.gridData())) {
			dto.message = 'Elimine 02 jogadores de cada mesa para poder prosseguir';
		} else {
			dto.isValid = true;
		}

		return dto;
	}

	protected updateResult(data: Array<PlayerInterface[]>) {
		const dto: DrawChangeDTO = {
			seventhPhase: {
				...this.gridData(),
				tables: data ? data : this.gridData().tables,
			},
		};
		this.onUpdateResult.emit(dto as StagesInterface);
	}

	protected eliminatePlayer(id: number, data: PlayerInterface) {
		const selectMax = 2;
		let quant = this.gridData().tables[id].filter((res) => res.status === 'ELIMINATED').length;
		const index = this.gridData().tables[id].findIndex((res) => res.uuid === data.uuid);
		const status = this.gridData().tables[id][index].status;

		if (quant < selectMax || status === 'ELIMINATED') {
			switch (status) {
				case 'IN_PROGRESS':
				case 'CLASSIFIED':
					this.gridData().tables[id][index].status = 'ELIMINATED';
					break;
				case 'ELIMINATED':
					this.gridData().tables[id][index].status = 'IN_PROGRESS';
					break;
			}
		}

		quant = this.gridData().tables[id].filter((res) => res.status === 'ELIMINATED').length;

		if (quant === selectMax) {
			this.gridData().tables[id].map((player) => {
				if (player.status === 'IN_PROGRESS') {
					player.status = 'CLASSIFIED';
				}
				return player;
			});
		} else {
			this.gridData().tables[id].map((player) => {
				if (player.status === 'CLASSIFIED') {
					player.status = 'IN_PROGRESS';
				}
				return player;
			});
		}

		this.updateResult(this.gridData().tables);
	}

	protected generateDraw() {
		if (!this.drawButtonDisabled()) {
		}
		const dto: DrawChangeDTO = {
			seventhPhase: this.distributePlayers(),
		};
		this.onDrawChange.emit(dto as StagesInterface);
	}

	private distributePlayers(): TablesInterface {
		const dto: TablesInterface = {
			tables: createEmptyArrays(SEVENTH_PHASE_TABLES_QUANT),
			status: 'IN_PROGRESS',
		};

		const playersClassified = this.players().map((res) =>
			res.filter((player) => player.status === 'CLASSIFIED'),
		);

		playersClassified.flatMap((res, index) => {
			// biome-ignore lint/complexity/noForEach: <explanation>
			res.forEach((value) => {
				dto.tables[index].push({
					...value,
					status: 'IN_PROGRESS',
				});
			});
		});

		return dto;
	}

	private showToast(data: ToastInterface) {
		this.messageService.add(data);
	}
}
