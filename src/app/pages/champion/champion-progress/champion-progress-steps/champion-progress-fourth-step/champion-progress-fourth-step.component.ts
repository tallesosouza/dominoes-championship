import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import type {
	PlayerInterface,
	StagesInterface,
	TablesInterface,
	TablesStatusInterface,
} from '@core/interfaces/champion';
import type { ToastInterface } from '@core/interfaces/toats';
import { ChampionStageSummaryComponent } from '@shared/components/champion-stage-summary/champion-stage-summary.component';
import { DeskCardComponent } from '@shared/components/desk-card/desk-card.component';
import { FOURTH_PHASE_TABLES_QUANT, isFourthPhaseValid } from '@shared/helpers/champion-config';
import { createEmptyArrays, distributePlayers } from '@shared/utils/functions';
import { MessageService } from 'primeng/api';
import { ButtonDirective } from 'primeng/button';

type DrawChangeDTO = Pick<StagesInterface, 'fourthPhase'>;

@Component({
	selector: 'app-champion-progress-fourth-step',
	standalone: true,
	imports: [DeskCardComponent, ButtonDirective, ChampionStageSummaryComponent],
	templateUrl: './champion-progress-fourth-step.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChampionProgressFourthStepComponent {
	private messageService = inject(MessageService);

	protected onNextChange = output();
	protected onPrevChange = output();
	protected onUpdateResult = output<StagesInterface>();
	protected onDrawChange = output<StagesInterface>();
	public gridData = input.required<TablesInterface>();
	public players = input.required<Array<PlayerInterface[]>>();
	public previousStep = input.required<TablesInterface>();

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
		} else if (!isFourthPhaseValid(this.gridData())) {
			dto.message = 'Elimine 01 jogador de cada mesa para poder prosseguir';
		} else {
			this.updateResult('FINALIZED');
			dto.isValid = true;
		}

		return dto;
	}

	protected updateResult(status?: TablesStatusInterface, data?: Array<PlayerInterface[]>) {
		const dto: DrawChangeDTO = {
			fourthPhase: {
				...this.gridData(),
				tables: data ? data : this.gridData().tables,
				status: status ? status : this.gridData().status,
			},
		};
		this.onUpdateResult.emit(dto as StagesInterface);
	}

	protected eliminatePlayer(id: number, data: PlayerInterface) {
		this.gridData().tables[id].map((player) => {
			if (player.uuid === data.uuid) {
				player.status = 'ELIMINATED';
			} else {
				player.status = 'CLASSIFIED';
			}
			return player;
		});
		this.updateResult(undefined, this.gridData()?.tables);
	}

	protected generateDraw() {
		if (!this.drawButtonDisabled()) {
			const dto: DrawChangeDTO = {
				fourthPhase: this.distributePlayers(),
			};
			this.onDrawChange.emit(dto as StagesInterface);
		}
	}

	private distributePlayers(): TablesInterface {
		const dto: TablesInterface = {
			tables: createEmptyArrays(FOURTH_PHASE_TABLES_QUANT),
			status: 'IN_PROGRESS',
		};

		const playersClassified = this.players().map((res) =>
			res.filter((player) => player.status === 'CLASSIFIED'),
		);

		const distributePlayersData = distributePlayers(playersClassified, FOURTH_PHASE_TABLES_QUANT);

		distributePlayersData.groups.flatMap((res, index) => {
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
