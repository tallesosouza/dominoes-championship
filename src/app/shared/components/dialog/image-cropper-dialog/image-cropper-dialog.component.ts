import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { DomSanitizer, type SafeUrl } from '@angular/platform-browser';
import { type ImageCroppedEvent, ImageCropperComponent, type LoadedImage } from 'ngx-image-cropper';
import { ContainerDialogComponent } from '../container-dialog/container-dialog.component';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ButtonDirective } from 'primeng/button';

@Component({
	selector: 'app-image-cropper-dialog',
	standalone: true,
	imports: [ImageCropperComponent, ContainerDialogComponent, ButtonDirective],
	templateUrl: './image-cropper-dialog.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageCropperDialogComponent {
	private sanitizer = inject(DomSanitizer);
	private ref = inject(DynamicDialogRef);
	private config = inject(DynamicDialogConfig);

	protected imageChangedEvent = signal<Event | null>(this.config.data?.file);
	protected croppedImage = signal<SafeUrl>('');

	protected imageCropped(event: ImageCroppedEvent) {
		if (event.objectUrl) {
			const dto = this.sanitizer.bypassSecurityTrustUrl(event.objectUrl);
			this.croppedImage.set(dto);
		}
	}

	protected close() {
		this.ref.close(null);
	}

	protected confirm() {
		this.ref.close(this.croppedImage());
	}
}
