import { ChangeDetectionStrategy, Component, type OnInit, computed, input } from '@angular/core';
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
export class ChampionStageSummaryComponent implements OnInit {
	public titleClassified = input.required<string>();
	public titleClassifiedSkip = input<string>();

	public gridData = input.required<TablesInterface>();
	public previousStep = input<TablesInterface>();

	protected playersClassifieds = computed(() => {
		const players = this.gridData().tables.flatMap((res) =>
			res.filter((player) => player.status === 'CLASSIFIED'),
		);
		const playersPrevious = this.previousStep()?.skipStepClassified ?? [];

		return playersPrevious.concat(players);
	});

	protected playersEliminated = computed(() => {
		return this.gridData().tables.flatMap((res) =>
			res.filter((player) => player.status === 'ELIMINATED'),
		);
	});

	protected playersClassifiedSkip = computed(() => {
		return this.gridData().skipStepClassified;
	});

	ngOnInit(): void {
		console.log(this.gridData());
	}
}
