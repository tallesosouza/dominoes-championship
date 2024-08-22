import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class CrudStorageService {
	get(key: string): unknown {
		const dto = localStorage.getItem(key);
		if (dto) {
			return JSON.parse(dto);
		}
		return null;
	}

	set(key: string, value: unknown) {
		const dto = JSON.stringify(value);
		localStorage.setItem(key, dto);
	}

	delete(key: string) {
		localStorage.removeItem(key);
	}
}
