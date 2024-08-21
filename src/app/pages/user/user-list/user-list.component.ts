import {
	ChangeDetectionStrategy,
	Component,
	computed,
	DestroyRef,
	inject,
	type OnInit,
	signal,
} from '@angular/core';
import type { UserInterface } from '@core/interfaces/user';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ProfileImageComponent } from '@shared/components/profile-image/profile-image.component';
import { MainHeaderComponent } from '@shared/components/main-header/main-header.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, switchMap, take, takeUntil } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
	selector: 'app-user-list',
	standalone: true,
	imports: [
		TableModule,
		ButtonModule,
		TooltipModule,
		ProfileImageComponent,
		MainHeaderComponent,
		RouterLink,
		InputGroupModule,
		InputGroupAddonModule,
		InputTextModule,
		ReactiveFormsModule,
	],
	templateUrl: './user-list.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListComponent implements OnInit {
	private router = inject(Router);
	private route = inject(ActivatedRoute);
	private destroy = inject(DestroyRef);

	protected searchControl = new FormControl();

	protected gridData = signal<UserInterface[]>([]);

	isGridData = computed(() => {
		if (this.gridData().length) {
			return true;
		}
		return false;
	});

	ngOnInit(): void {
		this.searchControlObservable();
	}

	protected navigatorEdit(uuid: string) {
		this.router.navigate([`edit/${uuid}`], {
			relativeTo: this.route,
		});
	}

	private searchControlObservable() {
		this.searchControl.valueChanges
			.pipe(debounceTime(300), takeUntilDestroyed(this.destroy))
			.subscribe((value) => {
				const dto = this.gridData().filter((res) => this.filterUserLogic(res.name, value));
				console.log(dto);
			});
	}

	private filterUserLogic(resValue: string, controlValue: string) {
		const resValueConvert = resValue.toLowerCase();
		const controlValueConvert = controlValue.toLowerCase();

		return resValueConvert.includes(controlValueConvert);
	}
}
