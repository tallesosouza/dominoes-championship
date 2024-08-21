import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
	selector: 'app-main-header',
	standalone: true,
	imports: [],
	template: `
    <div class="w-full flex gap-2 mb-5">
      <div class="bg-primary min-h-full" style="width: .3rem;"></div>
      <div class="flex-1 surface-200 py-2 px-3">
        <h3 class="mb-2">{{ title() }}</h3>
        <h6 >{{ description() }}</h6>
      </div>
    </div>
  `,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainHeaderComponent {
	public title = input.required<string>();
	public description = input('');
}
