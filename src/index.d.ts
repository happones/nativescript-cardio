import { Common } from './cardio.common';
export declare class Cardio extends Common {
	onScan(): Promise<any>;
}

/**
 * Check required permissions for using device camera.
 */
export function requestPermissions();