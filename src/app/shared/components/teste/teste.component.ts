import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'app-teste',
	standalone: true,
	imports: [],
	templateUrl: './teste.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TesteComponent {}
