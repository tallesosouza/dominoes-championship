import { NgIf, NgTemplateOutlet } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	ContentChild,
	type TemplateRef,
	input,
	output,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
	selector: 'app-container-dialog',
	standalone: true,
	imports: [NgTemplateOutlet, ButtonModule, NgIf],
	templateUrl: './container-dialog.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContainerDialogComponent {
	@ContentChild('headerTemplate') headerTemplate?: TemplateRef<unknown>;

	public onClickClose = output();
	public title = input('');
	public viewClose = input(true);
}
