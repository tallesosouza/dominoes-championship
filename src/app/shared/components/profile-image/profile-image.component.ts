import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
	selector: 'app-profile-image',
	standalone: true,
	imports: [],
	template: `
    @if (src()) {
      <img
        [class]="getSize() + ' border-circle shadow-5'"
        [src]="src()"
        [alt]="alt()"
      />
    } @else {
      <div
        [class]="getSize() +
        ' text-4xl surface-100 border-circle shadow-5 flex align-items-center justify-content-center'"
      >
        <i class="fa fa-user"></i>
      </div>
    }
  `,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileImageComponent {
	public src = input<string | null>('');
	public alt = input('');
	public size = input<'small' | 'medium' | 'large' | 'xLarge'>('small');

	public getSize = computed(() => {
		switch (this.size()) {
			case 'xLarge':
				return 'w-6rem h-6rem';
			case 'large':
				return 'w-5rem h-5rem';
			case 'medium':
				return 'w-4rem h-4rem';
			case 'small':
				return 'w-2rem h-2rem';
		}
	});
}
