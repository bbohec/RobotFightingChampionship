import { Physical } from '../components/Physical'

export interface Drawing {
    refreshEntity(physicalComponent:Physical): Promise<void>;
}

export const idNotFoundOnDrawIds = (entityId:string) => `id '${entityId}' not found on drawIds`
export const idAlreadyDraw = (id: string): string => `id '${id}' already draw`
export const methodNotImplemented = 'Method not implemented.'
