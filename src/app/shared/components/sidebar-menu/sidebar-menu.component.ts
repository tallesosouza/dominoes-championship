import { animate, style, transition, trigger } from '@angular/animations';
import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { TooltipModule } from 'primeng/tooltip';
import { SkeletonModule } from 'primeng/skeleton';
import { RouterLink, RouterLinkActive } from '@angular/router';
import type { MenuInterface } from '@core/interfaces/menu';
import { MENU_LIST } from '@core/const/menu-list';
import { FooterComponent } from '../footer/footer.component';

@Component({
	selector: 'app-sidebar-menu',
	standalone: true,
	imports: [NgClass, TooltipModule, SkeletonModule, RouterLink, RouterLinkActive, FooterComponent],
	templateUrl: './sidebar-menu.component.html',
	styleUrl: './sidebar-menu.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [
		trigger('toogleMenuInternal', [
			transition(':enter', [style({ opacity: 0 }), animate('500ms', style({ opacity: 1 }))]),
			transition(':leave', [animate('100ms', style({ opacity: 0 }))]),
		]),
	],
})
export class SidebarMenuComponent {
	protected openMenu = signal(false);
	protected menuList = signal<MenuInterface[]>(MENU_LIST);

	protected tooltipMenuText = computed(() => {
		if (this.openMenu()) {
			return 'Fechar menu';
		}

		return 'Abrir menu';
	});

	protected clickToggleMenu() {
		this.openMenu.set(!this.openMenu());
	}
}
