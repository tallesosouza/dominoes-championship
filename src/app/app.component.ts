import { Component, inject, type OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
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

	ngOnInit(): void {
		this.userStorage.init();
	}
}
