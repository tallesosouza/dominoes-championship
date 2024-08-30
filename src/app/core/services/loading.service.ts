import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class LoadingService {
	private store$ = new BehaviorSubject(false);

	public get() {
		return this.store$.asObservable();
	}

	public set(value: boolean) {
		this.store$.next(value);
	}

	public setToggle() {
		this.set(true);

		setTimeout(() => {
			this.set(false);
		}, 1000);
	}
}
