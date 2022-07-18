import { Physical } from '../../../Components/Physical'
import { Sprite } from 'pixi.js'
import { Dimension } from '../../../Components/Dimensional'

export interface PixiJSEntity {
    physical: Physical;
    spriteOriginalDimension:Dimension;
    sprite: Sprite;
}
