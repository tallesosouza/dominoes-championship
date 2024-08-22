import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ContainerDialogComponent } from '../container-dialog/container-dialog.component';

@Component({
	selector: 'app-confirme-dialog',
	standalone: true,
	imports: [ContainerDialogComponent, ButtonModule],
	templateUrl: './confirme-dialog.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmeDialogComponent {
	private ref: DynamicDialogRef = inject(DynamicDialogRef);
	private config: DynamicDialogConfig = inject(DynamicDialogConfig);

	protected title = signal<string>(this.config.data?.title);
	protected description = signal(this.config.data?.description);

	protected close(value: boolean) {
		this.ref.close(value);
	}
}
