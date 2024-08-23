import { NgClass } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	type ElementRef,
	HostListener,
	ViewChild,
	computed,
	input,
	output,
	signal,
} from '@angular/core';
import type { FileInterface } from '@core/interfaces/file';
import { ProfileImageComponent } from '@shared/components/profile-image/profile-image.component';
import { ButtonDirective } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

@Component({
	selector: 'app-input-file',
	standalone: true,
	imports: [ButtonDirective, NgClass, TooltipModule, ProfileImageComponent],
	templateUrl: './input-file.component.html',
	styleUrl: './input-file.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputFileComponent {
	@ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

	public label = input('');
	public icon = input('fa fa-cloud-arrow-up');
	public iconVisible = input(true);
	public imageSrc = input<FileInterface | string>('');
	protected onChangeInput = output<Event>();
	protected changeDelete = output();

	protected srcPreview = computed<string>(() => {
		const dto: FileInterface = this.imageSrc() as FileInterface;

		if (dto?.url) {
			return dto?.url;
		}
		return this.imageSrc() as string;
	});

	protected isActive = signal(false);

	protected changeInput(event: Event) {
		this.onChangeInput.emit(event);
	}

	protected emptyValue() {
		if (this.fileInput.nativeElement.value) {
			this.fileInput.nativeElement.value = '';
		}
	}

	protected clickDelete() {
		this.changeDelete.emit();
	}

	@HostListener('dragover', ['$event']) public onDragOver(event: Event) {
		event.preventDefault();
		event.stopPropagation();
		this.isActive.set(true);
	}

	@HostListener('dragleave', ['$event']) public onDragLeave(event: Event) {
		event.preventDefault();
		event.stopPropagation();
		this.isActive.set(false);
	}

	@HostListener('drop', ['$event']) public onDrop(event: DragEvent) {
		event.preventDefault();
		event.stopPropagation();
		this.isActive.set(false);

		if (event.dataTransfer && event.dataTransfer.files.length > 0) {
			const fileInput = event.target as HTMLDivElement;

			const input = fileInput.nextElementSibling as HTMLInputElement;
			input.files = event.dataTransfer.files;

			const changeEvent = new Event('change');
			input.dispatchEvent(changeEvent);
		}
	}
}
