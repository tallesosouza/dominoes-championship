import { animate, style, transition, trigger } from '@angular/animations';
import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MENU_LIST } from '@core/const/menu-list';
import type { MenuInterface } from '@core/interfaces/menu';
import { LoadingService } from '@core/services/loading.service';
import { SkeletonModule } from 'primeng/skeleton';
import { TooltipModule } from 'primeng/tooltip';
import { FooterComponent } from '../footer/footer.component';
import { LoadingComponent } from '../loading/loading.component';

@Component({
	selector: 'app-sidebar-menu',
	standalone: true,
	imports: [
		NgClass,
		TooltipModule,
		SkeletonModule,
		RouterLink,
		RouterLinkActive,
		FooterComponent,
		LoadingComponent,
	],
	templateUrl: './sidebar-menu.component.html',
	styleUrl: './sidebar-menu.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [
		trigger('toggleMenuInternal', [
			transition(':enter', [style({ opacity: 0 }), animate('500ms', style({ opacity: 1 }))]),
			transition(':leave', [animate('100ms', style({ opacity: 0 }))]),
		]),
	],
})
export class SidebarMenuComponent {
	private loadingService = inject(LoadingService);

	protected openMenu = signal(false);
	protected menuList = signal<MenuInterface[]>(MENU_LIST);
	protected loading = toSignal(this.loadingService.get());

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
