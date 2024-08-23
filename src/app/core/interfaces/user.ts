import type { FileInterface } from './file';

export interface UserInterface {
	uuid?: string;
	name: string;
	surname?: string;
	image?: FileInterface;
}
