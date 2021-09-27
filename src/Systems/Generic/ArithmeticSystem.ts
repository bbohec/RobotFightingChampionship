import { Position } from '../../Components/Physical'
import { GenericSystem } from './GenericSystem'

export abstract class ArtithmeticSystem extends GenericSystem {
    protected pythagoreHypotenuse (position:Position):number {
        return Math.sqrt(Math.pow(position.x, 2) + Math.pow(position.y, 2))
    }
}
