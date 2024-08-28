import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
	selector: 'app-profile-image',
	standalone: true,
	imports: [NgClass],
	template: `
    @if (src()) {
      <img
        [class]="getSize() + ' border-circle shadow-5 flex'"
        [src]="src()"
        [alt]="alt()"
      />
    } @else {
      <div
        [class]="getSize() +
        ' text-4xl surface-100 border-circle shadow-5 flex align-items-center justify-content-center'"
      >
        <i class="fa fa-user" [ngClass]="{' text-sm ' : this.size() === 'small' }"></i>
      </div>
    }
  `,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileImageComponent {
	public src = input<string | null | undefined>('');
	public alt = input('');
	public size = input<'small' | 'medium' | 'large' | 'xLarge'>('small');

	public getSize = computed(() => {
		switch (this.size()) {
			case 'xLarge':
				return 'w-7rem h-7rem';
			case 'large':
				return 'w-5rem h-5rem';
			case 'medium':
				return 'w-4rem h-4rem';
			case 'small':
				return 'w-2rem h-2rem';
		}
	});
}
