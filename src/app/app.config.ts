import { provideHttpClient } from '@angular/common/http';
import {
	type ApplicationConfig,
	DEFAULT_CURRENCY_CODE,
	LOCALE_ID,
	provideZoneChangeDetection,
} from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { APP_ROUTES } from './app.routes';

export const appConfig: ApplicationConfig = {
	providers: [
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideRouter(APP_ROUTES, withComponentInputBinding()),
		provideAnimationsAsync(),
		provideHttpClient(),
		{ provide: LOCALE_ID, useValue: 'pt' },
		{ provide: DEFAULT_CURRENCY_CODE, useValue: 'BRL' },
		DialogService,
		MessageService,
	],
};
