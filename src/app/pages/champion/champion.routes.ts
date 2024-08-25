import type { Routes } from '@angular/router';
import { ChampionFormComponent } from './champion-form/champion-form.component';
import { ChampionListComponent } from './champion-list/champion-list.component';
import { ChampionComponent } from './champion.component';

export const CHAMPION_ROUTES: Routes = [
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
		component: ChampionComponent,
	},
];
