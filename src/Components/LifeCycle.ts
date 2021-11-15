import { GenericComponent } from './GenericComponent'
import { ComponentName } from './port/ComponentName'
export class LifeCycle extends GenericComponent {
    componentName: ComponentName = ComponentName.LifeCycle
    isCreated: boolean = false;
}
