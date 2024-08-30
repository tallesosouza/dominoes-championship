import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { PlayerInterface } from '@core/interfaces/champion';
import { ProfileImageComponent } from '../profile-image/profile-image.component';

@Component({
	selector: 'app-winner-card',
	standalone: true,
	imports: [ProfileImageComponent, NgClass],
	templateUrl: './winner-card.component.html',
	styleUrl: './winner-card.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WinnerCardComponent {
	public gridData = input<PlayerInterface | undefined>(undefined);
}
