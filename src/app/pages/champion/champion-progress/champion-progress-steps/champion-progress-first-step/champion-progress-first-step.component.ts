import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import type { PlayerInterface, StagesInterface, TablesInterface } from '@core/interfaces/champion';
import type { ToastInterface } from '@core/interfaces/toats';
import { DeskCardComponent } from '@shared/components/desk-card/desk-card.component';
import { FIRST_PHASE_TABLES_QUANT, isFirstPhaseValid } from '@shared/helpers/champion-config';
import { createEmptyArrays } from '@shared/utils/functions';
import { MessageService } from 'primeng/api';
import { ButtonDirective } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

@Component({
	selector: 'app-champion-progress-first-step',
	standalone: true,
	imports: [ButtonDirective, RippleModule, DeskCardComponent],
	templateUrl: './champion-progress-first-step.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChampionProgressFirstStepComponent {
	private messageService = inject(MessageService);

	protected onNextChange = output();
	protected onUpdateResult = output();
	protected onDrawChange = output<StagesInterface>();
	public gridData = input.required<TablesInterface>();
	public players = input<PlayerInterface[]>([]);

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

		if (this.gridData()?.status === 'FINALIZED') {
			dto.isValid = true;
		}

		if (this.gridData()?.status === 'START') {
			dto.message = 'Efetue o sorteio para poder prosseguir';
		} else if (!isFirstPhaseValid(this.gridData())) {
			dto.message = 'Elimine 01 jogador de cada mesa para poder prosseguir';
		}

		return dto;
	}

	protected generateDraw() {
		if (!this.drawButtonDisabled()) {
			const dto = {
				firstPhase: this.distributePlayers(),
			};
			this.onDrawChange.emit(dto);
		}
	}

	private distributePlayers(): TablesInterface {
		const dto: TablesInterface = {
			tables: createEmptyArrays(FIRST_PHASE_TABLES_QUANT),
			status: 'IN_PROGRESS',
		};
		this.players()
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
