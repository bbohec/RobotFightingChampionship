import { DrawingIntegration } from './DrawingIntegration'
import { DrawingPort } from './DrawingPort'
export interface DrawingAdapter extends DrawingPort, DrawingIntegration {}
