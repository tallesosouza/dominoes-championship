import type { Routes } from '@angular/router';
import { UserListComponent } from './user-list/user-list.component';
import { UserFormComponent } from './user-form/user-form.component';

export const USER_ROUTES: Routes = [
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
];
