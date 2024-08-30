import { NgClass } from '@angular/common';
import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	type OnInit,
	computed,
	inject,
	input,
	output,
} from '@angular/core';
import type { PlayerInterface, StagesInterface, TablesInterface } from '@core/interfaces/champion';
import type { ToastInterface } from '@core/interfaces/toats';
import { DeskCardComponent } from '@shared/components/desk-card/desk-card.component';
import { ProfileImageComponent } from '@shared/components/profile-image/profile-image.component';
import { WinnerCardComponent } from '@shared/components/winner-card/winner-card.component';
import { EIGHTH_PHASE_TABLES_QUANT, isEighthPhaseValid } from '@shared/helpers/champion-config';
import { createEmptyArrays } from '@shared/utils/functions';
import { MessageService, type TreeNode } from 'primeng/api';
import { ButtonDirective } from 'primeng/button';
import { OrganizationChartModule } from 'primeng/organizationchart';
import { TooltipModule } from 'primeng/tooltip';

type DrawChangeDTO = Pick<StagesInterface, 'eighthPhase'>;

@Component({
	selector: 'app-champion-progress-eighth-step',
	standalone: true,
	imports: [
		DeskCardComponent,
		ButtonDirective,
		OrganizationChartModule,
		ProfileImageComponent,
		WinnerCardComponent,
		TooltipModule,
		NgClass,
	],
	templateUrl: './champion-progress-eighth-step.component.html',
	styles: `

  :host ::ng-deep {
    .p-organizationchart-node-content {
      min-width: 15rem;
      padding: 0 !important;
    }
  }
  
  `,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChampionProgressEighthStepComponent implements OnInit {
	private messageService = inject(MessageService);
	private cd = inject(ChangeDetectorRef);

	protected onNextChange = output();
	protected onPrevChange = output();
	protected onUpdateResult = output<StagesInterface>();
	protected onDrawChange = output<StagesInterface>();
	public gridData = input.required<TablesInterface>();
	public players = input.required<Array<PlayerInterface[]>>();

	public playerWinner = computed(() => {
		const players = this.gridData().tables.flatMap((res) =>
			res.filter((player) => player.status === 'CLASSIFIED'),
		);

		return players.find((res) => res.status === 'CLASSIFIED');
	});

	protected organizationChartData = computed<TreeNode[]>(() => {
		const players = this.gridData().tables.flat();

		if (!players || !players[0] || !players[1]) {
			return [];
		}

		return [
			{
				label: '',
				expanded: true,
				data: 'TEMPLATE',
				children: [
					{
						data: {
							uuid: players[0].uuid,
							name: players[0].name,
							surname: players[0].surname ?? '',
							image: players[0].image,
							status: players[0].status,
						},
					},
					{
						data: {
							uuid: players[1].uuid,
							name: players[1].name,
							surname: players[1].surname ?? '',
							image: players[1].image,
							status: players[1].status,
						},
					},
				],
			},
		];
	});

	protected drawButtonDisabled = computed(() => {
		if (this.gridData()?.status !== 'START') {
			return true;
		}
		return false;
	});

	ngOnInit(): void {
		if (!this.drawButtonDisabled()) {
			this.generateDraw();
		}
	}

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
		} else if (!isEighthPhaseValid(this.gridData())) {
			dto.message = 'Elimine 01 jogador para poder prosseguir';
		} else {
			dto.isValid = true;
		}

		return dto;
	}

	protected updateResult(data: Array<PlayerInterface[]>) {
		const dto: DrawChangeDTO = {
			eighthPhase: {
				...this.gridData(),
				tables: data ? data : this.gridData().tables,
			},
		};
		this.onUpdateResult.emit(dto as StagesInterface);
	}

	protected eliminatePlayer(id: number, data: PlayerInterface) {
		if (this.gridData().status !== 'FINALIZED') {
			this.gridData().tables[id].map((player) => {
				if (player.uuid === data.uuid) {
					player.status = 'ELIMINATED';
				} else {
					player.status = 'CLASSIFIED';
				}
				return player;
			});
			this.updateResult(this.gridData().tables);
		}
	}

	protected generateDraw() {
		const dto: DrawChangeDTO = {
			eighthPhase: this.distributePlayers(),
		};
		this.onDrawChange.emit(dto as StagesInterface);
		this.cd.detectChanges();
	}

	private distributePlayers(): TablesInterface {
		const dto: TablesInterface = {
			tables: createEmptyArrays(EIGHTH_PHASE_TABLES_QUANT),
			status: 'IN_PROGRESS',
		};

		const playersClassified = this.players().flatMap((res) =>
			res.filter((player) => player.status === 'CLASSIFIED'),
		);

		// biome-ignore lint/complexity/noForEach: <explanation>
		playersClassified.forEach((player) => {
			dto.tables[0].push({
				...player,
				status: 'IN_PROGRESS',
			});
		});

		return dto;
	}

	private showToast(data: ToastInterface) {
		this.messageService.add(data);
	}
}
