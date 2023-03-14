export interface ControllerPort {
    activate(pointerId:string): Promise<void>;
}
