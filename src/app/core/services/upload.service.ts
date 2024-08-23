import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import type { UploadInterface } from '@core/interfaces/upload';

@Injectable({
	providedIn: 'root',
})
export class UploadService {
	private http = inject(HttpClient);

	private readonly API = 'https://api.cloudinary.com/v1_1/dish0y9ko/image/upload/';

	upload(file: string) {
		const formData = new FormData();
		formData.append('file', file);
		formData.append('upload_preset', 'cloudinary-domino');

		return this.http.post<UploadInterface>(this.API, formData);
	}
}
