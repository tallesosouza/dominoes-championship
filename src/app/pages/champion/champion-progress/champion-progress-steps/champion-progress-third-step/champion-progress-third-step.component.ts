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
import { THIRD_PHASE_TABLES_QUANT, isThirdPhaseValid } from '@shared/helpers/champion-config';
import { createEmptyArrays, distributePlayers } from '@shared/utils/functions';
import { MessageService } from 'primeng/api';
import { ButtonDirective } from 'primeng/button';

type DrawChangeDTO = Pick<StagesInterface, 'thirdPhase'>;

@Component({
	selector: 'app-champion-progress-third-step',
	standalone: true,
	imports: [DeskCardComponent, ButtonDirective, ChampionStageSummaryComponent],
	templateUrl: './champion-progress-third-step.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChampionProgressThirdStepComponent {
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
		} else if (!isThirdPhaseValid(this.gridData())) {
			dto.message = 'Elimine 01 jogador de cada mesa para poder prosseguir';
		} else {
			this.updateResult('FINALIZED');
			dto.isValid = true;
		}

		return dto;
	}

	protected updateResult(status?: TablesStatusInterface, data?: Array<PlayerInterface[]>) {
		const dto: DrawChangeDTO = {
			thirdPhase: {
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
				thirdPhase: this.distributePlayers(),
			};
			this.onDrawChange.emit(dto as StagesInterface);
		}
	}

	private distributePlayers(): TablesInterface {
		const dto: TablesInterface = {
			tables: createEmptyArrays(THIRD_PHASE_TABLES_QUANT),
			status: 'IN_PROGRESS',
			skipStepClassified: [],
		};

		const playersClassified = this.players().map((res) =>
			res.filter((player) => player.status === 'CLASSIFIED'),
		);

		const distributePlayersData = distributePlayers(playersClassified, THIRD_PHASE_TABLES_QUANT);

		dto.skipStepClassified;

		// biome-ignore lint/complexity/noForEach: <explanation>
		distributePlayersData.leftovers.forEach((res) => {
			dto.skipStepClassified?.push(res);
		});

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
