import {
	type ApplicationConfig,
	DEFAULT_CURRENCY_CODE,
	LOCALE_ID,
	provideZoneChangeDetection,
} from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { APP_ROUTES } from './app.routes';
import { MessageService } from 'primeng/api';

export const appConfig: ApplicationConfig = {
	providers: [
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideRouter(APP_ROUTES),
		provideAnimationsAsync(),
		{ provide: LOCALE_ID, useValue: 'pt' },
		{ provide: DEFAULT_CURRENCY_CODE, useValue: 'BRL' },
		DialogService,
		MessageService,
	],
};
