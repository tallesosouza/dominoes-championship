import {
	ChangeDetectionStrategy,
	Component,
	effect,
	forwardRef,
	Input,
	input,
	signal,
} from '@angular/core';
import {
	type ControlValueAccessor,
	FormsModule,
	NG_VALUE_ACCESSOR,
	ReactiveFormsModule,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';

const NG_VALUE_ACCESSOR_INPUT_TEXT = {
	provide: NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => InputTextComponent),
	multi: true,
};

@Component({
	selector: 'app-input-text',
	standalone: true,
	imports: [InputTextModule, ReactiveFormsModule, FormsModule],
	templateUrl: './input-text.component.html',
	providers: [NG_VALUE_ACCESSOR_INPUT_TEXT],
	changeDetection: ChangeDetectionStrategy.OnPush,
	styles: `
		:host {
			display: flex;
			flex-direction: column;
			gap: .5rem;

			&.ng-invalid.ng-touched.ng-dirty input {
				border-color: red !important;
			}
		}
	`,
})
export class InputTextComponent implements ControlValueAccessor {
	protected innerValue = signal('');
	protected setValue = effect(() => this.onChange(this.innerValue()));

	public label = input('');
	public inputId = input('');
	public placeHolder = input('');
	@Input() isReadyOnly = false;
	@Input() disabled = false;

	private onChange: (value: string) => void = () => {};
	protected onTouched: () => void = () => {};

	public writeValue(obj: string): void {
		this.innerValue.set(obj);
	}

	public registerOnChange(fn: (_value: string) => void): void {
		this.onChange = fn;
	}

	public registerOnTouched(fn: () => void): void {
		this.onTouched = fn;
	}

	public setDisabledState(isDisabled: boolean): void {
		this.disabled = isDisabled;
		this.isReadyOnly = isDisabled;
	}
}
