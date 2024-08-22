import { inject, Injectable } from '@angular/core';
import { CrudStorageService } from './crud-storage.service';
import { BehaviorSubject, filter, map } from 'rxjs';
import type { UserInterface } from '@core/interfaces/user';

@Injectable({
	providedIn: 'root',
})
export class UserStorageService {
	private crudService = inject(CrudStorageService);

	private store$ = new BehaviorSubject<UserInterface[]>([]);
	private readonly key = 'user';

	public init() {
		const dto = this.crudService.get(this.key) as UserInterface[];

		if (dto) {
			this.store$.next(dto);
		}
	}

	public getValue() {
		return this.store$.getValue();
	}

	public get() {
		return this.store$.asObservable();
	}

	public set(value: UserInterface) {
		const dto = [...this.getValue(), value];
		this.store$.next(dto);
		this.crudService.set(this.key, dto);
	}

	public delete(uuid: string) {
		const dto = this.getValue().filter((res) => res.uuid !== uuid);
		this.store$.next(dto);
		this.crudService.set(this.key, dto);
	}

	public getByNameOrSurname(value: string) {
		return this.getValue().filter(
			(res) =>
				this.filterUserLogic(res.name, value) || this.filterUserLogic(res.surname ?? '', value),
		);
	}

	private filterUserLogic(resValue: string, controlValue: string) {
		const resValueConvert = resValue.toLowerCase();
		const controlValueConvert = controlValue.toLowerCase();

		return resValueConvert.includes(controlValueConvert);
	}
}
