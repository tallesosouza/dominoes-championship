import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'app-footer',
	standalone: true,
	imports: [],
	template: `
    <div class="bg-bluegray-500 w-full gap-2 py-1 flex align-items-center justify-content-center text-white">
      <p class="caption text-white">Desenvolvido por Vitor Fel</p> <i class="fa-solid fa-copyright text-xs"></i>
    </div>
  `,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {}
