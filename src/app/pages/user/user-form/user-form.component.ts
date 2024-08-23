import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import type { Params } from '@angular/router';
import { ImageCropperDialogComponent } from '@shared/components/dialog/image-cropper-dialog/image-cropper-dialog.component';
import { InputFileComponent } from '@shared/components/inputs/input-file/input-file.component';
import { InputTextComponent } from '@shared/components/inputs/input-text/input-text.component';
import { MainHeaderComponent } from '@shared/components/main-header/main-header.component';
import { ProfileImageComponent } from '@shared/components/profile-image/profile-image.component';
import { BaseFormDirective } from '@shared/directives/base-form.directive';
import { DIALOG_CONFIG, DIALOG_TEMPLATE } from '@shared/helpers/dialog-config';
import { ButtonModule } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { FileUploadModule } from 'primeng/fileupload';

@Component({
	selector: 'app-user-form',
	standalone: true,
	imports: [
		MainHeaderComponent,
		InputTextComponent,
		ReactiveFormsModule,
		ButtonModule,
		ProfileImageComponent,
		FileUploadModule,
		InputFileComponent,
	],
	templateUrl: './user-form.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserFormComponent extends BaseFormDirective {
	private build = inject(FormBuilder);
	private dialogService = inject(DialogService);
	private cd = inject(ChangeDetectorRef);

	override model = this.getModel();

	private getModel() {
		return this.build.group({
			uuid: [''],
			name: ['', Validators.required],
			surname: [''],
			image: [''],
		});
	}

	get controls() {
		return this.model.controls;
	}

	override submit(params?: Params): void {
		// throw new Error('Method not implemented.');
	}

	protected showImageCropperDialog(file: Event) {
		console.log(file);
		this.dialogService
			.open(ImageCropperDialogComponent, {
				data: {
					title: 'Remover jogador',
					description: 'Você tem certeza que deseja remover este jogador?',
					file,
				},
				...DIALOG_CONFIG,
				...DIALOG_TEMPLATE.LARGE_DEFAULT,
			})
			.onClose.subscribe((res) => {
				if (res) {
					this.controls.image.patchValue(res);
					this.cd.detectChanges();
				}
			});
	}
}
