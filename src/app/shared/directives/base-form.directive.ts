import { Directive, inject } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import type { Params } from '@angular/router';
import type { ToastInterface } from '@core/interfaces/toats';
import { MessageService } from 'primeng/api';

@Directive({
	selector: '[appBaseForm]',
	standalone: true,
})
export abstract class BaseFormDirective {
	private messageService = inject(MessageService);
	model!: FormGroup;

	abstract submit(params?: Params): void;

	onSubmit(params?: Params) {
		if (this.model.valid) {
			this.submit(params);
		} else {
			this.showAlert();
			this.validateForm(this.model);
		}
	}

	validateForm(formGroup: FormGroup | FormArray) {
		const keys = Object.keys(formGroup.controls);

		for (const field of keys) {
			const control = formGroup.get(field);

			if (control) {
				control.markAsDirty();
				control.markAsTouched();

				if (control instanceof FormGroup || control instanceof FormArray) {
					this.validateForm(control);
				}
			}
		}
	}

	onClearForm() {
		this.model.reset();
	}

	private showAlert() {
		const dto: ToastInterface = {
			severity: 'warn',
			summary: 'Atenção',
			detail: 'Verifique os campos obrigatórios',
		};

		this.messageService.add(dto);
	}

	public showToast(data: ToastInterface) {
		this.messageService.add(data);
	}
}
