import { animate, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, HostListener, input, signal } from '@angular/core';
import type { ChampionInterface } from '@core/interfaces/champion';
import { ButtonDirective } from 'primeng/button';

@Component({
	selector: 'app-champion-card',
	standalone: true,
	imports: [ButtonDirective],
	templateUrl: './champion-card.component.html',
	styleUrl: './champion-card.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [
		trigger('buttonAnimation', [
			transition(':enter', [
				style({ opacity: 0, transform: 'translateX(20px)' }),
				animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' })),
			]),
			transition(':leave', [
				animate('300ms ease-in', style({ opacity: 0, transform: 'translateX(20px)' })),
			]),
		]),
	],
})
export class ChampionCardComponent {
	public gridData = input.required<ChampionInterface>();
	protected showButton = signal(false);

	@HostListener('mouseenter')
	onMouseEnter() {
		this.showButton.set(true);
	}

	@HostListener('mouseleave')
	onMouseLeave() {
		this.showButton.set(false);
	}
}
