import { Physical } from '../../../core/components/Physical'
import { Sprite } from 'pixi.js'
import { Dimension } from '../../../core/components/Dimensional'

export interface PixiJSEntity {
    physical: Physical;
    spriteOriginalDimension:Dimension;
    sprite: Sprite;
}
