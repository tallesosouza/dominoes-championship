import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { TablesInterface } from '@core/interfaces/champion';
import { ChipModule } from 'primeng/chip';
import { DividerModule } from 'primeng/divider';
import { MainHeaderComponent } from '../main-header/main-header.component';

@Component({
	selector: 'app-champion-stage-summary',
	standalone: true,
	imports: [DividerModule, MainHeaderComponent, ChipModule],
	templateUrl: './champion-stage-summary.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChampionStageSummaryComponent {
	public titleClassified = input.required<string>();
	public titleClassifiedSkip = input<string>();

	public gridData = input.required<TablesInterface>();

	protected playersClassifieds = computed(() => {
		return this.gridData().tables.flatMap((res) =>
			res.filter((player) => player.status === 'CLASSIFIED'),
		);
	});

	protected playersEliminated = computed(() => {
		return this.gridData().tables.flatMap((res) =>
			res.filter((player) => player.status === 'ELIMINATED'),
		);
	});

	protected playersClassifiedSkip = computed(() => {
		return this.gridData().skipStepClassified;
	});

	// protected playersEliminated

	// protected playersClassifiedSkip
}
