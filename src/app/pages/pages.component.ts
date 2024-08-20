import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarMenuComponent } from '@shared/components/sidebar-menu/sidebar-menu.component';

@Component({
	selector: 'app-pages',
	standalone: true,
	imports: [RouterOutlet, SidebarMenuComponent],
	template: `
    <app-sidebar-menu>
      <router-outlet />
    </app-sidebar-menu>
  `,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PagesComponent {}
