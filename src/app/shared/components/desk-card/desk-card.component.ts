import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import type { PlayerInterface } from '@core/interfaces/champion';
import { ButtonDirective } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ProfileImageComponent } from '../profile-image/profile-image.component';

@Component({
	selector: 'app-desk-card',
	standalone: true,
	imports: [ButtonDirective, TooltipModule, ProfileImageComponent, NgClass],
	styleUrl: './desk-card.component.scss',
	templateUrl: './desk-card.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeskCardComponent {
	public onChangeTableResult = output<PlayerInterface[]>();
	public gridData = input<PlayerInterface[]>([]);
	public index = input<number>(0);
	public disable = input(false);

	public number = computed(() => {
		const num = this.index() + 1;

		if (num < 10) {
			return `0${num}`;
		}
		return num;
	});

	protected playerEliminated(uuid: string) {
		if (!this.disable()) {
			const dto = this.gridData().map((player) => {
				if (player.uuid === uuid) {
					player.status = 'ELIMINATED';
				} else {
					player.status = 'CLASSIFIED';
				}

				return player;
			});
			this.onChangeTableResult.emit(dto);
		}
	}
}
