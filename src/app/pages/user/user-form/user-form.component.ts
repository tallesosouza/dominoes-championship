import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	type OnInit,
	computed,
	inject,
	input,
	signal,
} from '@angular/core';
import {
	FormBuilder,
	ReactiveFormsModule,
	type UntypedFormGroup,
	Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import type { FileInterface } from '@core/interfaces/file';
import { UploadService } from '@core/services/upload.service';
import { UserStorageService } from '@core/services/user-storage.service';
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
import { finalize, take } from 'rxjs';

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
export class UserFormComponent extends BaseFormDirective implements OnInit {
	private build = inject(FormBuilder);
	private dialogService = inject(DialogService);
	private cd = inject(ChangeDetectorRef);
	private uploadService = inject(UploadService);
	private userStorageService = inject(UserStorageService);
	private router = inject(Router);

	protected loading = signal(false);
	public uuid = input('');
	protected titlePage = computed(() => (this.uuid() ? 'Editar' : 'Cadastro'));
	override model: UntypedFormGroup = this.getModel();

	ngOnInit(): void {
		this.setModelData();
	}

	private getModel() {
		return this.build.group({
			uuid: [''],
			name: ['', Validators.required],
			surname: [''],
			image: [''],
		});
	}

	protected resetImage() {
		this.model.get('image')?.patchValue('');
		this.cd.detectChanges();
	}

	private setModelData() {
		if (this.uuid()) {
			const dto = this.userStorageService.getByUuid(this.uuid());
			if (dto) {
				this.model.patchValue(dto);
			}
		}
	}

	get imageSrc() {
		const dto = this.model.get('image')?.value;
		if (dto.url) {
			return dto.url;
		}
		return dto;
	}

	override submit(): void {
		this.loading.set(true);
		const imageValue = this.model.get('image')?.value;
		if (imageValue && !imageValue.public_id && !imageValue.id) {
			this.uploadImage(imageValue);
		} else {
			this.save();
		}
	}

	protected showImageCropperDialog(file: Event) {
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
					this.model.get('image')?.patchValue(res);
					this.cd.detectChanges();
				}
			});
	}

	private uploadImage(imageValue: string) {
		this.uploadService
			.upload(imageValue)
			.pipe(
				finalize(() => this.loading.set(false)),
				take(1),
			)
			.subscribe({
				next: (res) => {
					const dto: FileInterface = {
						url: res.secure_url,
						id: res.public_id,
					};
					this.model.get('image')?.patchValue(dto);
					this.save();
				},
				error: () => {
					this.showToast({
						severity: 'error',
						summary: 'Error',
						detail: 'Erro ao cadastrar a imagem',
					});
				},
			});
	}

	private save() {
		if (this.uuid()) {
			this.putUserStorage();
		} else {
			this.postUserStorage();
		}
	}

	private postUserStorage() {
		this.userStorageService.post(this.model.getRawValue());

		this.showToast({
			severity: 'success',
			summary: 'Cadastro',
			detail: 'Usuário cadastrado com sucesso',
		});

		this.router.navigate(['/user']);
		this.loading.set(false);
	}

	private putUserStorage() {
		this.userStorageService.put(this.model.getRawValue());

		this.showToast({
			severity: 'success',
			summary: 'Editar',
			detail: 'Usuário editado com sucesso',
		});

		this.router.navigate(['/user']);
		this.loading.set(false);
	}
}
