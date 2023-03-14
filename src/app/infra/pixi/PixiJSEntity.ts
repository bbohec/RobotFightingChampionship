import { Sprite } from 'pixi.js'
import { Dimension } from '../../core/ecs/components/Dimensional'
import { Physical } from '../../core/ecs/components/Physical'

export interface PixiJSEntity {
    physical: Physical;
    spriteOriginalDimension:Dimension;
    sprite: Sprite;
}
