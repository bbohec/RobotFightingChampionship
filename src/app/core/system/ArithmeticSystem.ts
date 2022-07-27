import { Position } from '../components/Physical'
import { GenericServerSystem } from './GenericServerSystem'

export abstract class ArtithmeticSystem extends GenericServerSystem {
    protected pythagoreHypotenuse (position:Position):number {
        return Math.sqrt(Math.pow(position.x, 2) + Math.pow(position.y, 2))
    }
}
