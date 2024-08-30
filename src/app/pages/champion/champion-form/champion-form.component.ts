import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
	FormBuilder,
	ReactiveFormsModule,
	type UntypedFormGroup,
	Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import type { ChampionInterface } from '@core/interfaces/champion';
import type { UserInterface } from '@core/interfaces/user';
import { ChampionStorageService } from '@core/services/champion-storage.service';
import { UserStorageService } from '@core/services/user-storage.service';
import { InputTextComponent } from '@shared/components/inputs/input-text/input-text.component';
import { MainHeaderComponent } from '@shared/components/main-header/main-header.component';
import { ProfileImageComponent } from '@shared/components/profile-image/profile-image.component';
import { BaseFormDirective } from '@shared/directives/base-form.directive';
import {
	FIRST_PHASE_TABLES_QUANT,
	SECOND_PHASE_TABLES_QUANT,
	THIRD_PHASE_TABLES_QUANT,
} from '@shared/helpers/champion-config';
import { createEmptyArrays } from '@shared/utils/functions';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { ChipModule } from 'primeng/chip';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';

@Component({
	selector: 'app-champion-form',
	standalone: true,
	imports: [
		MainHeaderComponent,
		ReactiveFormsModule,
		InputTextComponent,
		ButtonModule,
		CheckboxModule,
		MultiSelectModule,
		ProfileImageComponent,
		InputTextModule,
		CardModule,
		NgClass,
		ChipModule,
		RouterLink,
	],
	styles: `
		:host {
			&.ng-invalid.ng-touched.ng-dirty input {
				border-color: red !important;
			}
		}
	`,
	templateUrl: './champion-form.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChampionFormComponent extends BaseFormDirective {
	private build = inject(FormBuilder);
	private userStorageService = inject(UserStorageService);
	private championStorageService = inject(ChampionStorageService);
	private router = inject(Router);

	override model: UntypedFormGroup = this.getModel();
	protected loading = signal(false);
	protected userList = toSignal(this.userStorageService.get());

	protected readonly PLAYERS_MAX = 32;

	private getModel() {
		return this.build.group({
			uuid: [''],
			title: ['', Validators.required],
			description: [''],
			players: ['', [Validators.required]],
			tournamentPhase: ['FIRST_PHASE'],
			stage: [0],
		});
	}

	protected get playersValues(): UserInterface[] {
		// biome-ignore lint/complexity/useLiteralKeys: <explanation>
		return this.controls['players'].value;
	}

	protected get controls() {
		return this.model.controls;
	}

	override submit(): void {
		this.championStorageService.post(this.prepareData());
		this.showToast({
			severity: 'success',
			summary: 'Cadastro',
			detail: 'Campeonato cadastrado com sucesso',
		});
		this.router.navigate(['/champion']);
	}

	private prepareData() {
		const dto: ChampionInterface = this.model.getRawValue();

		dto.players.map((player) => {
			player.status = 'CLASSIFIED';
			return player;
		});

		dto.stages = {
			firstPhase: {
				status: 'START',
				tables: [...createEmptyArrays(FIRST_PHASE_TABLES_QUANT)],
			},
			secondPhase: {
				status: 'START',
				tables: [...createEmptyArrays(SECOND_PHASE_TABLES_QUANT)],
			},
			thirdPhase: {
				status: 'START',
				tables: [...createEmptyArrays(THIRD_PHASE_TABLES_QUANT)],
			},
		};

		return dto;
	}
}
