import type { Routes } from '@angular/router';
import { PagesComponent } from './pages.component';

export const PAGES_ROUTES: Routes = [
	{
		path: '',
		component: PagesComponent,
		children: [
			{
				path: 'user',
				loadChildren: () => import('./user/user.routes').then((m) => m.USER_ROUTES),
			},
			{
				path: 'champion',
				loadChildren: () => import('./champion/champion.routes').then((m) => m.CHAMPION_ROUTES),
			},
		],
	},
];
