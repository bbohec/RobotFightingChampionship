import { Suite, describe } from 'mocha'
import { Action } from '../app/core/type/Action'
import { featureEventDescription } from '../app/messages'

export const feature = (action:Action, mochaSuite: (this: Suite) => void) => describe(featureEventDescription(action), mochaSuite)
