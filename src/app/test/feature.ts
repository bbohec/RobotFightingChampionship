import { Suite, describe } from 'mocha'
import { EventKind } from '../core/type/EventKind'
import { featureEventDescription } from '../messages'

export const feature = (action:EventKind, mochaSuite: (this: Suite) => void) => describe(featureEventDescription(action), mochaSuite)
