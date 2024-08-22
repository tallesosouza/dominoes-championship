import {
	ChangeDetectionStrategy,
	Component,
	DestroyRef,
	type OnInit,
	computed,
	inject,
	signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import type { UserInterface } from '@core/interfaces/user';
import { UserStorageService } from '@core/services/user-storage.service';
import { ConfirmeDialogComponent } from '@shared/components/dialog/confirme-dialog/confirme-dialog.component';
import { MainHeaderComponent } from '@shared/components/main-header/main-header.component';
import { ProfileImageComponent } from '@shared/components/profile-image/profile-image.component';
import { DIALOG_CONFIG, DIALOG_TEMPLATE } from '@shared/helpers/dialog-config';
import { ButtonModule } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { debounceTime, finalize, take, tap } from 'rxjs';

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
	private userStorageService = inject(UserStorageService);
	private dialogService = inject(DialogService);

	protected searchControl = new FormControl();
	protected gridData = signal<UserInterface[]>([]);
	protected loading = signal(true);

	isGridData = computed(() => {
		if (this.gridData().length) {
			return true;
		}
		return false;
	});

	ngOnInit(): void {
		this.getUserList();
		this.searchControlObservable();
	}

	protected navigatorEdit(uuid: string) {
		this.router.navigate([`edit/${uuid}`], {
			relativeTo: this.route,
		});
	}

	private searchControlObservable() {
		this.searchControl.valueChanges
			.pipe(
				tap(() => this.loading.set(true)),
				debounceTime(300),
				takeUntilDestroyed(this.destroy),
			)
			.subscribe((value) => {
				const dto = this.userStorageService.getByNameOrSurname(value);
				this.gridData.update((_) => dto);
				this.loading.set(false);
			});
	}

	private getUserList() {
		this.userStorageService
			.get()
			.pipe(
				debounceTime(300),
				finalize(() => this.loading.set(false)),
				take(1),
			)
			.subscribe((res) => this.gridData.set(res));
	}

	protected userDelete(uuid: string) {
		this.dialogService
			.open(ConfirmeDialogComponent, {
				data: {
					title: 'Remover jogador',
					description: 'Você tem certeza que deseja remover este jogador?',
				},
				...DIALOG_CONFIG,
				...DIALOG_TEMPLATE.SMALL_AUTO,
			})
			.onClose.subscribe((res) => {
				if (res) {
					this.userStorageService.delete(uuid);
					this.getUserList();
				}
			});
	}
}
