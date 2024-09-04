import type { Routes } from '@angular/router';
import { ChampionFormComponent } from './champion/champion-form/champion-form.component';
import { ChampionListComponent } from './champion/champion-list/champion-list.component';
import { ChampionProgressComponent } from './champion/champion-progress/champion-progress.component';
import { PagesComponent } from './pages.component';
import { UserFormComponent } from './user/user-form/user-form.component';
import { UserListComponent } from './user/user-list/user-list.component';

export const PAGES_ROUTES: Routes = [
	{
		path: '',
		component: PagesComponent,
		children: [
			{
				path: 'user',
				children: [
					{
						path: '',
						component: UserListComponent,
					},
					{
						path: 'new',
						component: UserFormComponent,
					},
					{
						path: 'edit/:uuid',
						component: UserFormComponent,
					},
				],
				// loadChildren: () => import('./user/user.routes').then((m) => m.USER_ROUTES),
			},
			{
				path: 'champion',
				children: [
					{
						path: '',
						component: ChampionListComponent,
					},
					{
						path: 'new',
						component: ChampionFormComponent,
					},
					{
						path: 'progress/:uuid',
						component: ChampionProgressComponent,
					},
				],
				// loadChildren: () => import('./champion/champion.routes').then((m) => m.CHAMPION_ROUTES),
			},
		],
	},
];
