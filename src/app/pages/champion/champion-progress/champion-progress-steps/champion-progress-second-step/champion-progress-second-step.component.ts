import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import type {
	PlayerInterface,
	StagesInterface,
	TablesInterface,
	TablesStatusInterface,
} from '@core/interfaces/champion';
import type { ToastInterface } from '@core/interfaces/toats';
import { DeskCardComponent } from '@shared/components/desk-card/desk-card.component';
import { SECOND_PHASE_TABLES_QUANT, isSecondPhaseValid } from '@shared/helpers/champion-config';
import { createEmptyArrays } from '@shared/utils/functions';
import { MessageService } from 'primeng/api';
import { ButtonDirective } from 'primeng/button';

type DrawChangeDTO = Pick<StagesInterface, 'secondPhase'>;

@Component({
	selector: 'app-champion-progress-second-step',
	standalone: true,
	imports: [DeskCardComponent, ButtonDirective],
	templateUrl: './champion-progress-second-step.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChampionProgressSecondStepComponent {
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

	protected playersClassified = computed(() => {
		const dto = this.players().map((res) => res.filter((value) => value.status === 'CLASSIFIED'));
		return dto;
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
		} else if (!isSecondPhaseValid(this.gridData())) {
			dto.message = 'Elimine 01 jogador de cada mesa para poder prosseguir';
		} else {
			this.updateResult('FINALIZED');
			dto.isValid = true;
		}

		return dto;
	}

	protected updateResult(value?: TablesStatusInterface) {
		const dto: DrawChangeDTO = {
			secondPhase: {
				...this.gridData(),
				status: value ? value : this.gridData().status,
			},
		};
		this.onUpdateResult.emit(dto as StagesInterface);
	}

	protected generateDraw() {
		if (!this.drawButtonDisabled()) {
		}
		const dto: DrawChangeDTO = {
			secondPhase: this.distributePlayers(),
		};
		this.onDrawChange.emit(dto as StagesInterface);
	}

	private distributePlayers(): TablesInterface {
		const dto: TablesInterface = {
			tables: createEmptyArrays(SECOND_PHASE_TABLES_QUANT),
			status: 'IN_PROGRESS',
		};
		this.players()
			.flat()
			.filter((value) => value.status === 'CLASSIFIED')
			.sort(() => Math.random() - 0.5)
			.forEach((player, index) =>
				dto.tables[index % dto.tables.length].push({
					...player,
					status: 'IN_PROGRESS',
				}),
			);

		return dto;
	}

	private showToast(data: ToastInterface) {
		this.messageService.add(data);
	}
}
