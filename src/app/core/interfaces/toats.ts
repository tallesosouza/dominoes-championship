export interface ToastInterface {
	severity: 'success' | 'info' | 'warn' | 'error';
	summary: string;
	detail?: string;
}
