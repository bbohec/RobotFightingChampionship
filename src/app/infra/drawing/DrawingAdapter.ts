import type { Drawing } from '../../core/port/Drawing'
import type { DrawingIntegration } from './DrawingIntegration'

export interface DrawingAdapter extends Drawing, DrawingIntegration {}
