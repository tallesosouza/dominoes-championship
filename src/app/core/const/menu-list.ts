import type { MenuInterface } from '@core/interfaces/menu';

export const MENU_LIST: MenuInterface[] = [
	{
		label: 'Home',
		routerLink: '/home',
		iconClass: 'fa-house',
	},
	{
		label: 'Jogadores',
		routerLink: '/user',
		iconClass: 'fa-user',
	},
	{
		label: 'Campeonato',
		routerLink: '/champion',
		iconClass: 'fa-trophy',
	},
	{
		label: 'Salvar',
		routerLink: '/save',
		iconClass: 'fa-cloud',
	},
];
