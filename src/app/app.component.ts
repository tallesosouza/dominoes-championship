import { Component, inject, type OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserStorageService } from '@core/services/user-storage.service';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [RouterOutlet],
	template: '<router-outlet />',
})
export class AppComponent implements OnInit {
	private userStorage = inject(UserStorageService);

	ngOnInit(): void {
		this.userStorage.init();
	}
}
