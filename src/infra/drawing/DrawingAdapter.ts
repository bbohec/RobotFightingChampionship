import { Drawing } from '../../app/core/port/Drawing'
import { DrawingIntegration } from './DrawingIntegration'

export interface DrawingAdapter extends Drawing, DrawingIntegration {}
