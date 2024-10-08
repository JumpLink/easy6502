import type { Simulator } from '../simulator.js';

export interface SimulatorEvent {
    simulator: Simulator;
    message?: string;
    type?: string;
}