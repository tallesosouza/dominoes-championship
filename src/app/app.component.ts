import { Component, type OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChampionStorageService } from '@core/services/champion-storage.service';
import { UserStorageService } from '@core/services/user-storage.service';
import { ToastComponent } from '@shared/components/toast/toast.component';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [RouterOutlet, ToastComponent],
	template: `
		<app-toast />
		<router-outlet />
	`,
})
export class AppComponent implements OnInit {
	private userStorage = inject(UserStorageService);
	private championStorage = inject(ChampionStorageService);

	ngOnInit(): void {
		this.userStorage.init();
		this.championStorage.init();
	}
}
