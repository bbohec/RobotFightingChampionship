import { Sprite } from 'pixi.js'
import { Dimension } from '../../core/components/Dimensional'
import { Physical } from '../../core/components/Physical'

export interface PixiJSEntity {
    physical: Physical;
    spriteOriginalDimension:Dimension;
    sprite: Sprite;
}
