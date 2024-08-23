import {
	ChangeDetectionStrategy,
	Component,
	type ElementRef,
	ViewChild,
	input,
	output,
} from '@angular/core';
import { ButtonDirective } from 'primeng/button';

@Component({
	selector: 'app-input-file',
	standalone: true,
	imports: [ButtonDirective],
	templateUrl: './input-file.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputFileComponent {
	@ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

	public label = input('');
	public icon = input('fa fa-cloud-arrow-up');
	public iconVisible = input(true);
	protected onChangeInput = output<Event>();

	protected changeInput(event: Event) {
		this.onChangeInput.emit(event);
	}

	protected emptyValue() {
		if (this.fileInput.nativeElement.value) {
			this.fileInput.nativeElement.value = '';
		}
	}
}
