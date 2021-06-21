export interface DrawingPort {
    eraseEntity(id:string):Promise<void>;
    drawEntity(id:string): Promise<void>;
}
