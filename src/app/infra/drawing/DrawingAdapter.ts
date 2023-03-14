import { Drawing } from '../../core/port/Drawing'
import { DrawingIntegration } from './DrawingIntegration'

export interface DrawingAdapter extends Drawing, DrawingIntegration {}
