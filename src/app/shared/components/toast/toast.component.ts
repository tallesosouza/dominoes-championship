import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ToastModule } from 'primeng/toast';

@Component({
	selector: 'app-toast',
	standalone: true,
	imports: [ToastModule],
	template: `
    	<p-toast [breakpoints]="{ '920px': { width: '100%', right: '0', left: '0' } }" />
    `,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastComponent {}
