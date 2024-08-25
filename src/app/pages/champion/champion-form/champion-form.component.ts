import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import type { UserInterface } from '@core/interfaces/user';
import { UserStorageService } from '@core/services/user-storage.service';
import { InputTextComponent } from '@shared/components/inputs/input-text/input-text.component';
import { MainHeaderComponent } from '@shared/components/main-header/main-header.component';
import { ProfileImageComponent } from '@shared/components/profile-image/profile-image.component';
import { BaseFormDirective } from '@shared/directives/base-form.directive';
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

	override model = this.getModel();
	protected loading = signal(false);
	protected userList = toSignal(this.userStorageService.get());

	protected readonly PLAYERS_MAX = 16;

	private getModel() {
		return this.build.group({
			title: ['', Validators.required],
			description: [''],
			players: ['', [Validators.required]],
		});
	}

	protected get playersValues(): UserInterface[] {
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		return this.controls.players.value as any;
	}

	protected get controls() {
		return this.model.controls;
	}

	override submit(): void {
		console.log(this.model.getRawValue());
	}
}
