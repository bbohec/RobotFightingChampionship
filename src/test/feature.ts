import { Suite, describe } from 'mocha'
import { Action } from '../Event/Action'
import { featureEventDescription } from '../messages'

export const feature = (action:Action, mochaSuite: (this: Suite) => void) => describe(featureEventDescription(action), mochaSuite)
