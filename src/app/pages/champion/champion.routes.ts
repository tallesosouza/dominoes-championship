import type { Routes } from '@angular/router';
import { ChampionComponent } from './champion.component';

export const CHAMPION_ROUTES: Routes = [
	{
		path: '',
		component: ChampionComponent,
	},
	// {
	// 	path: 'new',
	// 	component: UserFormComponent,
	// },
	// {
	// 	path: 'edit/:uuid',
	// 	component: UserFormComponent,
	// },
];
