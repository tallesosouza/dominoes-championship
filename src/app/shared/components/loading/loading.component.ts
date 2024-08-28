import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
	selector: 'app-loading',
	standalone: true,
	imports: [],
	templateUrl: './loading.component.html',
	styleUrl: './loading.component.scss',
	animations: [
		trigger('moveAnimation', [
			state(
				'closed',
				style({
					left: '4rem',
				}),
			),
			state(
				'open',
				style({
					left: '18.75rem',
				}),
			),
			transition('closed => open', [animate('300ms')]),
			transition('open => closed', [animate('400ms')]),
		]),
	],
	host: {
		'[@moveAnimation]': 'isMenuOpen() ? "open" : "closed"',
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingComponent {
	public isMenuOpen = input();
}
