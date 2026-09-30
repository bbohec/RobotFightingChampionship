import type { Sprite } from 'pixi.js'
import type { Dimension } from '../../core/ecs/components/Dimensional'
import type { Physical } from '../../core/ecs/components/Physical'

export interface PixiJSEntity {
  physical: Physical
  spriteOriginalDimension: Dimension
  sprite: Sprite
}
