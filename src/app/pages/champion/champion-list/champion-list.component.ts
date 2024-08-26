import {
	ChangeDetectionStrategy,
	Component,
	DestroyRef,
	type OnInit,
	inject,
	signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import type { ChampionInterface } from '@core/interfaces/champion';
import { ChampionStorageService } from '@core/services/champion-storage.service';
import { ChampionCardComponent } from '@shared/components/champion-card/champion-card.component';
import { MainHeaderComponent } from '@shared/components/main-header/main-header.component';
import { ButtonDirective } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { debounceTime, take } from 'rxjs';
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
	private championStorage = inject(ChampionStorageService);
	private destroy = inject(DestroyRef);

	protected searchControl = new FormControl();
	protected gridData = signal<ChampionInterface[]>([]);

	ngOnInit(): void {
		this.getChampionList();
		this.searchControlObservable();
	}

	private getChampionList() {
		this.championStorage
			.get()
			.pipe(take(1))
			.subscribe((res) => {
				this.gridData.set(res);
			});
	}

	private searchControlObservable() {
		this.searchControl.valueChanges
			.pipe(debounceTime(300), takeUntilDestroyed(this.destroy))
			.subscribe((value) => {
				const dto = this.championStorage.getByTitleAndDescription(value);
				this.gridData.update((_) => dto);
			});
	}
}
