import type { Routes } from '@angular/router';
import { PagesComponent } from './pages.component';
import { SidebarMenuComponent } from '@shared/components/sidebar-menu/sidebar-menu.component';

export const PAGES_ROUTES: Routes = [
	{
		path: '',
		component: PagesComponent,
		children: [
			{
				path: 'user',
				loadChildren: () => import('./user/user.routes').then((m) => m.USER_ROUTES),
			},
		],
	},
];
