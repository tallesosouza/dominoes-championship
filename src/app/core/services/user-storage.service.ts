import { Injectable, inject } from '@angular/core';
import type { UserInterface } from '@core/interfaces/user';
import { generateUUID } from '@shared/utils/functions';
import { BehaviorSubject } from 'rxjs';
import { CrudStorageService } from './crud-storage.service';

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

	public getByUuid(uuid: string) {
		return this.store$.getValue().find((res) => res.uuid === uuid);
	}

	private setData(data: UserInterface[]) {
		this.store$.next(data);
		this.crudService.set(this.key, data);
	}

	public post(data: UserInterface) {
		const dtoData: UserInterface = {
			...data,
			uuid: generateUUID(),
		};
		const dto = [...this.getValue(), dtoData];
		this.setData(dto);
	}

	public put(data: UserInterface) {
		const dto = this.getValue().map((res) => (res.uuid === data.uuid ? data : res));
		this.setData(dto);
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
