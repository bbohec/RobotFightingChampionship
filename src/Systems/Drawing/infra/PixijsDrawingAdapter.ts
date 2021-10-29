import { Dimension } from '../../../Components/port/Dimension'
import { Physical, position, Position } from '../../../Components/Physical'
import { DrawingAdapter } from '../port/DrawingAdapter'
import { Application, InteractionEvent, Sprite } from 'pixi.js'
import { PixiJSEntity } from '../port/PixiJSEntity'
import { CommonDrawingAdapter } from './CommonDrawingAdapter'
import { ShapeType } from '../../../Components/port/ShapeType'
import { shapeAssets } from '../../../public/scripts/shapeAssets'
import { PixiEvent } from '../port/PixiEvent'

const drawEntityOnPositionMessage = (physicalComponent:Physical) => `Draw entity ${physicalComponent.entityId} on position ${JSON.stringify(physicalComponent.position)}`
const eraseEntityMessage = (id: string) => `Erase entity ${id}`
const entityIdMissingOnPixiEntities = (entityId:string) => `Entity id '${entityId} missing on pixijsEntities'`
const missingShapeType = (shapeType: ShapeType) => `Missing shape type '${shapeType}''`

export class PixijsDrawingAdapter extends CommonDrawingAdapter implements DrawingAdapter {
    public updatePlayerPointerId (playerPointerId:string): Promise<void> {
        return this.loadPixijsEvents(playerPointerId)
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
        this.resolution = this.conserveAspectRatio(resolution)
        this.updatePixiEntities()
        this.resizePixiAppRenderer()
    }

    public retrieveResolution (): Dimension {
        return { x: this.pixiApp.renderer.view.width, y: this.pixiApp.renderer.view.height }
    }

    public absolutePositionByEntityId (entityId: string): Position {
        const entity = this.pixijsEntities.get(entityId)
        if (entity) return {
            x: entity.sprite.x,
            y: entity.sprite.y
        }
        throw new Error(entityIdMissingOnPixiEntities(entityId))
    }

    public drawEntity (physicalComponent: Physical): Promise<void> {
        console.log(drawEntityOnPositionMessage(physicalComponent))
        const pixiEntity = this.pixijsEntities.get(physicalComponent.entityId)
        return pixiEntity
            ? this.updatePixiEntity(pixiEntity, physicalComponent)
            : this.createPixiEntity(physicalComponent)
    }

    public eraseEntity (id: string): Promise<void> {
        const pixiEntity = this.pixijsEntities.get(id)
        return pixiEntity ? this.erasePixiEntity(pixiEntity) : Promise.resolve()
    }

    public addingViewToDom (htmlElement:HTMLElement):void {
        htmlElement.appendChild(this.pixiApp.view)
    }

    private loadPixijsEvents (playerPointerId:string):Promise<void> {
        this.playerPointerId = playerPointerId
        const stage = this.pixiApp.stage
        stage.interactive = true
        stage.buttonMode = true
        stage.on(PixiEvent.MOUSE_DOWN, (event:InteractionEvent) => this.onPixiEventMouseDown(event))
        return Promise.resolve()
    }

    private onPixiEventMouseDown (event: InteractionEvent): Promise<void> {
        return this.sendUpdatePlayerPointerPositionGameEvent(position(event.data.global.x, event.data.global.y))
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

    private resizePixiAppRenderer () {
        this.pixiApp.renderer.resize(this.resolution.x, this.resolution.y)
    }

    private updatePixiEntity (pixiEntity: PixiJSEntity, physicalComponent:Physical): Promise<void> {
        pixiEntity.physical = physicalComponent
        return this.updatePixiEntityGraphically(pixiEntity)
    }

    private createPixiEntity (physicalComponent: Physical):Promise<void> {
        const shapeAsset = this.shapeAssets.get(physicalComponent.shape)
        if (!shapeAsset) return Promise.reject(new Error(missingShapeType(physicalComponent.shape)))
        const sprite = this.pixiApp.stage.addChild(Sprite.from(shapeAsset.toString()))
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
        pixiEntity.sprite.width = this.resolution.x / this.gridDimension.x
        pixiEntity.sprite.height = this.resolution.y / this.gridDimension.y
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
        const absolutePosition = this.relativePositionToAbsolutePosition(pixiEntity.physical.position, this.offset)
        pixiEntity.sprite.x = absolutePosition.x
        pixiEntity.sprite.y = absolutePosition.y
        return Promise.resolve()
    }

    private erasePixiEntity (pixiEntity: PixiJSEntity): Promise<void> {
        console.log(eraseEntityMessage(pixiEntity.physical.entityId))
        pixiEntity.sprite.destroy()
        this.pixijsEntities.delete(pixiEntity.physical.entityId)
        return Promise.resolve()
    }

    private pixijsEntities:Map<string, PixiJSEntity> = new Map()
    private shapeAssets: Map<ShapeType, URL> = shapeAssets
    private pixiApp = new Application({ width: this.resolution.x, height: this.resolution.y })
}
