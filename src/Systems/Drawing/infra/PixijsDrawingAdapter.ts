import { Dimension } from '../../../Components/port/Dimension'
import { Physical, Position } from '../../../Components/Physical'
import { DrawingAdapter } from '../port/DrawingAdapter'
import { PixiJSEntity } from '../port/PixiJSEntity'
import { ShapeType } from '../../../Components/port/ShapeType'
import { Logger } from '../../../Log/port/logger'
import { PixiApplicationCommon } from '../../Controller/infra/PixiApplicationCommon'
import { Application } from '@pixi/app'
import { Sprite } from 'pixi.js'

const drawEntityOnPositionMessage = (physicalComponent:Physical) => `Draw entity ${physicalComponent.entityId} on position ${JSON.stringify(physicalComponent.position)}`
const eraseEntityMessage = (id: string) => `Erase entity ${id}`
const entityIdMissingOnPixiEntities = (entityId:string) => `Entity id '${entityId} missing on pixijsEntities'`
const missingShapeType = (shapeType: ShapeType) => `Missing shape type '${shapeType}''`

export class PixijsDrawingAdapter extends PixiApplicationCommon implements DrawingAdapter {
    constructor (shapeAssets:Map<ShapeType, URL>, logger:Logger, applicationInstance:Application) {
        super()
        this.applicationInstance = applicationInstance
        this.shapeAssets = shapeAssets
        this.logger = logger
    }

    public refreshEntity (physicalComponent: Physical): Promise<void> {
        return (physicalComponent.visible)
            ? this.drawEntity(physicalComponent)
            : this.eraseEntity(physicalComponent.entityId)
    }

    private drawEntity (physicalComponent: Physical): Promise<void> {
        this.logger.info(drawEntityOnPositionMessage(physicalComponent))
        const pixiEntity = this.pixijsEntities.get(physicalComponent.entityId)
        return pixiEntity
            ? this.updatePixiEntity(pixiEntity, physicalComponent)
            : this.createPixiEntity(physicalComponent)
    }

    private eraseEntity (id: string): Promise<void> {
        const pixiEntity = this.pixijsEntities.get(id)
        return pixiEntity ? this.erasePixiEntity(pixiEntity) : Promise.resolve()
    }

    public retrieveDrawnEntities (): Map<string, Physical> {
        const drawnEntities:Map<string, Physical> = new Map()
        for (const [entityId, pixiEntity] of this.pixijsEntities) drawnEntities.set(entityId, pixiEntity.physical)
        return drawnEntities
    }

    public eraseAll (): void {
        for (const [, pixiEntity] of this.pixijsEntities) this.erasePixiEntity(pixiEntity)
    }

    public changeResolution (resolution: Dimension): void {
        this.updatePixiEntities()
        this.resizePixiAppRenderer(this.conserveAspectRatio(resolution))
    }

    public retrieveResolution (): Dimension {
        return { x: this.applicationInstance.renderer.view.width, y: this.applicationInstance.renderer.view.height }
    }

    public absolutePositionByEntityId (entityId: string): Position {
        const entity = this.pixijsEntities.get(entityId)
        if (entity) return {
            x: entity.sprite.x,
            y: entity.sprite.y
        }
        throw new Error(entityIdMissingOnPixiEntities(entityId))
    }

    public addingViewToDom (htmlElement:HTMLElement):void {
        htmlElement.appendChild(this.applicationInstance.view)
    }

    private conserveAspectRatio (resolution: Dimension) {
        const diffRatio = resolution.x / this.gridDimension.x - resolution.y / this.gridDimension.y
        if (diffRatio > 0) resolution.x = ((resolution.x / this.gridDimension.x) - Math.abs(diffRatio)) * this.gridDimension.x
        if (diffRatio < 0) resolution.y = ((resolution.y / this.gridDimension.y) - Math.abs(diffRatio)) * this.gridDimension.y
        return resolution
    }

    private updatePixiEntities () {
        for (const [, pixiEntity] of this.pixijsEntities) this.updatePixiEntityGraphically(pixiEntity)
    }

    private resizePixiAppRenderer (resolution:Dimension) {
        this.applicationInstance.renderer.resize(resolution.x, resolution.y)
    }

    private updatePixiEntity (pixiEntity: PixiJSEntity, physicalComponent:Physical): Promise<void> {
        pixiEntity.physical = physicalComponent
        return this.updatePixiEntityGraphically(pixiEntity)
    }

    private createPixiEntity (physicalComponent: Physical):Promise<void> {
        const shapeAsset = this.shapeAssets.get(physicalComponent.shape)
        if (!shapeAsset) return Promise.reject(new Error(missingShapeType(physicalComponent.shape)))
        const sprite = this.applicationInstance.stage.addChild(Sprite.from(shapeAsset.toString()))
        this.pixijsEntities.set(physicalComponent.entityId, {
            physical: physicalComponent,
            sprite: sprite,
            spriteOriginalDimension: { x: sprite.width, y: sprite.height }
        })
        const pixiEntity = this.pixijsEntities.get(physicalComponent.entityId)
        return pixiEntity
            ? this.updatePixiEntityGraphically(pixiEntity)
            : Promise.reject(new Error(entityIdMissingOnPixiEntities(physicalComponent.entityId)))
    }

    private updatePixiEntitySize (pixiEntity: PixiJSEntity) {
        const resolution = this.retrieveResolution()
        pixiEntity.sprite.width = resolution.x / this.gridDimension.x
        pixiEntity.sprite.height = resolution.y / this.gridDimension.y
    }

    private updatePixiEntityGraphically (pixiEntity: PixiJSEntity):Promise<void> {
        return Promise.all([
            this.updatePixiEntityAbsolutePosition(pixiEntity),
            this.updatePixiEntitySize(pixiEntity)
        ])
            .then(() => Promise.resolve())
            .catch(error => Promise.reject(error))
    }

    private updatePixiEntityAbsolutePosition (pixiEntity:PixiJSEntity) :Promise<void> {
        const absolutePosition = this.relativePositionToAbsolutePosition(pixiEntity.physical.position, this.offset, this.retrieveResolution())
        pixiEntity.sprite.x = absolutePosition.x
        pixiEntity.sprite.y = absolutePosition.y
        return Promise.resolve()
    }

    private erasePixiEntity (pixiEntity: PixiJSEntity): Promise<void> {
        this.logger.info(eraseEntityMessage(pixiEntity.physical.entityId))
        pixiEntity.sprite.destroy()
        this.pixijsEntities.delete(pixiEntity.physical.entityId)
        return Promise.resolve()
    }

    private pixijsEntities:Map<string, PixiJSEntity> = new Map()
    private shapeAssets: Map<ShapeType, URL>
    private logger :Logger
    private applicationInstance: Application
}
