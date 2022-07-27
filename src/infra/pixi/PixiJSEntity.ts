import { Sprite } from 'pixi.js'
import { Dimension } from '../../app/core/components/Dimensional'
import { Physical } from '../../app/core/components/Physical'

export interface PixiJSEntity {
    physical: Physical;
    spriteOriginalDimension:Dimension;
    sprite: Sprite;
}
