import type { Routes } from '@angular/router';
import { PagesComponent } from './pages.component';
import { SidebarMenuComponent } from '@shared/components/sidebar-menu/sidebar-menu.component';

export const PAGES_ROUTES: Routes = [
	{
		path: '',
		component: PagesComponent,
		children: [],
	},
];
