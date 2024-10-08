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
import {
	isEighthPhaseValid,
	isFifthPhaseValid,
	isFirstPhaseValid,
	isFourthPhaseValid,
	isSecondPhaseValid,
	isSeventhPhaseValid,
	isSixthPhaseValid,
	isThirdPhaseValid,
} from '@shared/helpers/champion-config';
import { DIALOG_CONFIG, DIALOG_TEMPLATE } from '@shared/helpers/dialog-config';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { StepperModule } from 'primeng/stepper';
import { ChampionProgressEighthStepComponent } from './champion-progress-steps/champion-progress-eighth-step/champion-progress-eighth-step.component';
import { ChampionProgressFifthStepComponent } from './champion-progress-steps/champion-progress-fifth-step/champion-progress-fifth-step.component';
import { ChampionProgressFirstStepComponent } from './champion-progress-steps/champion-progress-first-step/champion-progress-first-step.component';
import { ChampionProgressFourthStepComponent } from './champion-progress-steps/champion-progress-fourth-step/champion-progress-fourth-step.component';
import { ChampionProgressSecondStepComponent } from './champion-progress-steps/champion-progress-second-step/champion-progress-second-step.component';
import { ChampionProgressSeventhStepComponent } from './champion-progress-steps/champion-progress-seventh-step/champion-progress-seventh-step.component';
import { ChampionProgressSixthStepComponent } from './champion-progress-steps/champion-progress-sixth-step/champion-progress-sixth-step.component';
import { ChampionProgressThirdStepComponent } from './champion-progress-steps/champion-progress-third-step/champion-progress-third-step.component';

@Component({
	selector: 'app-champion-progress',
	standalone: true,
	imports: [
		StepperModule,
		ChampionProgressFirstStepComponent,
		ChampionProgressSecondStepComponent,
		ChampionProgressThirdStepComponent,
		ChampionProgressFourthStepComponent,
		ChampionProgressFifthStepComponent,
		ChampionProgressSixthStepComponent,
		ChampionProgressSeventhStepComponent,
		ChampionProgressEighthStepComponent,
	],
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
							if (res) {
								if (res.stage < this.STAGES_MAX) {
									res.stage += 1;
								}
								this.setPhaseFinalized(res.stages);
							}
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

	protected updateResult() {
		this.championStorageService.put(this.gridData() as ChampionInterface);
	}

	protected generateDraw(data: StagesInterface, loadingDisable?: boolean) {
		if (!loadingDisable) {
			this.loadingService.setToggle();
		}
		const dto = {
			...this.gridData(),
			stages: {
				...this.gridData()?.stages,
				...data,
			},
		};
		this.championStorageService.put(dto as ChampionInterface);
	}

	protected stagesUpdateResult(data: StagesInterface) {
		const dto = {
			...this.gridData(),
			stages: {
				...this.gridData()?.stages,
				...data,
			},
		};

		this.championStorageService.put(dto as ChampionInterface);
	}

	private setPhaseFinalized(data: StagesInterface) {
		if (isFirstPhaseValid(data.firstPhase)) {
			data.firstPhase.status = 'FINALIZED';
		}

		if (isSecondPhaseValid(data.secondPhase)) {
			data.secondPhase.status = 'FINALIZED';
		}

		if (isThirdPhaseValid(data.thirdPhase)) {
			data.thirdPhase.status = 'FINALIZED';
		}

		if (isFourthPhaseValid(data.fourthPhase)) {
			data.fourthPhase.status = 'FINALIZED';
		}

		if (isFifthPhaseValid(data.fifthPhase)) {
			data.fifthPhase.status = 'FINALIZED';
		}

		if (isSixthPhaseValid(data.sixthPhase)) {
			data.sixthPhase.status = 'FINALIZED';
		}

		if (isSeventhPhaseValid(data.seventhPhase)) {
			data.seventhPhase.status = 'FINALIZED';
		}

		if (isEighthPhaseValid(data.eighthPhase)) {
			data.eighthPhase.status = 'FINALIZED';
		}

		return data;
	}
}
