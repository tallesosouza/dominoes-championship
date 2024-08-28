import {
	ChangeDetectionStrategy,
	Component,
	DestroyRef,
	type OnInit,
	inject,
	input,
	signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import type { ChampionInterface, StagesInterface } from '@core/interfaces/champion';
import type { ToastInterface } from '@core/interfaces/toats';
import { ChampionStorageService } from '@core/services/champion-storage.service';
import { LoadingService } from '@core/services/loading.service';
import { ConfirmeDialogComponent } from '@shared/components/dialog/confirme-dialog/confirme-dialog.component';
import { isFirstPhaseValid } from '@shared/helpers/champion-config';
import { DIALOG_CONFIG, DIALOG_TEMPLATE } from '@shared/helpers/dialog-config';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { StepperModule } from 'primeng/stepper';
import { ChampionProgressFirstStepComponent } from './champion-progress-steps/champion-progress-first-step/champion-progress-first-step.component';

@Component({
	selector: 'app-champion-progress',
	standalone: true,
	imports: [StepperModule, ChampionProgressFirstStepComponent],
	templateUrl: './champion-progress.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChampionProgressComponent implements OnInit {
	private championStorageService = inject(ChampionStorageService);
	private route = inject(Router);
	private messageService = inject(MessageService);
	private destroy = inject(DestroyRef);
	private loadingService = inject(LoadingService);
	private dialogService = inject(DialogService);

	private readonly STAGES_MAX = 7;
	protected readonly INIT_STEP = 0;

	protected uuid = input('');
	public gridData = signal<ChampionInterface | null>(null);

	protected active = signal(this.INIT_STEP);

	ngOnInit(): void {
		this.setData();
		this.active.set(this.gridData()?.stage ?? this.INIT_STEP);
	}

	next() {
		this.active.update((value) => {
			let step = value;
			if (step < this.STAGES_MAX) {
				step += 1;
			}
			return step;
		});
	}

	prev() {
		this.active.update((value) => {
			let step = value;
			if (step > this.INIT_STEP) {
				step -= 1;
			}
			return step;
		});
	}

	protected logicNext() {
		const stage = this.gridData()?.stage ?? 0;
		if (stage === this.active()) {
			this.dialogService
				.open(ConfirmeDialogComponent, {
					data: {
						title: 'Avançar para a próxima fase?',
						description: 'Depois de avançar, não será possível alterar as informações.',
					},
					...DIALOG_CONFIG,
					...DIALOG_TEMPLATE.SMALL_HORIZONTAL,
				})
				.onClose.subscribe((res) => {
					if (res) {
						this.next();
						this.gridData.update((res) => {
							if (res) res.stage += 1;
							return res;
						});
						this.updateResult();
					}
				});
		} else {
			this.next();
		}
	}

	private showToast(data: ToastInterface) {
		this.messageService.add(data);
	}

	private setData() {
		const dto = this.championStorageService.getByUuid(this.uuid());
		if (dto) {
			this.championStorageService
				.get()
				.pipe(takeUntilDestroyed(this.destroy))
				.subscribe((res) => {
					const dto = res.find((res) => res.uuid === this.uuid());
					if (dto) {
						this.gridData.set(dto);
					}
				});
		} else {
			this.route.navigate(['/champion']);
			this.showToast({
				severity: 'error',
				summary: 'Error',
				detail: 'Error ao carregar o torneio',
			});
		}
	}

	protected generateDraw(data: StagesInterface) {
		this.loadingService.setToggle();
		const dto = {
			...this.gridData(),
			stages: {
				...this.gridData()?.stages,
				...data,
			},
		};
		this.championStorageService.put(dto as ChampionInterface);
	}

	protected updateResult() {
		const dto = this.gridData() as ChampionInterface;

		if (isFirstPhaseValid(dto.stages.firstPhase)) {
			dto.stages.firstPhase.status = 'FINALIZED';
		}

		this.championStorageService.put(this.gridData() as ChampionInterface);
	}
}
