import { Injectable, inject } from '@angular/core';
import type { ChampionInterface } from '@core/interfaces/champion';
import { generateUUID } from '@shared/utils/functions';
import { BehaviorSubject } from 'rxjs';
import { CrudStorageService } from './crud-storage.service';

@Injectable({
	providedIn: 'root',
})
export class ChampionStorageService {
	private crudService = inject(CrudStorageService);

	private store$ = new BehaviorSubject<ChampionInterface[]>([]);
	private readonly key = 'champion';

	public init() {
		const dto = this.crudService.get(this.key) as ChampionInterface[];

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

	private setData(data: ChampionInterface[]) {
		this.store$.next(data);
		this.crudService.set(this.key, data);
	}

	public post(data: ChampionInterface) {
		const dtoData: ChampionInterface = {
			...data,
			uuid: generateUUID(),
		};
		const dto = [...this.getValue(), dtoData];
		this.setData(dto);
	}

	public put(data: ChampionInterface) {
		const dto = this.getValue().map((res) => (res.uuid === data.uuid ? data : res));
		this.setData(dto);
	}

	public delete(uuid: string) {
		const dto = this.getValue().filter((res) => res.uuid !== uuid);
		this.store$.next(dto);
		this.crudService.set(this.key, dto);
	}

	public getByTitleAndDescription(value: string) {
		return this.getValue().filter(
			(res) =>
				this.filterUserLogic(res.title, value) ||
				this.filterUserLogic(res.description ?? '', value),
		);
	}

	private filterUserLogic(resValue: string, controlValue: string) {
		const resValueConvert = resValue.toLowerCase();
		const controlValueConvert = controlValue.toLowerCase();

		return resValueConvert.includes(controlValueConvert);
	}
}
