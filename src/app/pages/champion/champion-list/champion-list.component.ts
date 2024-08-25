import { ChangeDetectionStrategy, Component, type OnInit, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import type { ChampionInterface } from '@core/interfaces/champion';
import { ChampionCardComponent } from '@shared/components/champion-card/champion-card.component';
import { MainHeaderComponent } from '@shared/components/main-header/main-header.component';
import { ButtonDirective } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
@Component({
	selector: 'app-champion-list',
	standalone: true,
	imports: [
		MainHeaderComponent,
		InputGroupModule,
		InputGroupAddonModule,
		ReactiveFormsModule,
		InputTextModule,
		ButtonDirective,
		CardModule,
		ChampionCardComponent,
		RouterLink,
	],
	templateUrl: './champion-list.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChampionListComponent implements OnInit {
	protected searchControl = new FormControl();
	protected gridData = signal<ChampionInterface[]>([
		{
			uuid: '123-123-123',
			title: 'Lorem Ipsum dolor',
			description: 'Lorem Ipsum dolor seet amet log',
		},
	]);

	ngOnInit(): void {
		this.searchControl.disable();
	}
}
