import { Test, describe } from 'mocha'
import { ClientGameSystem } from '../core/ecs/systems/ClientGameSystem'
import { ServerGameSystem } from '../core/ecs/systems/ServerGameSystem'
import { GameEvent } from '../core/type/GameEvent'
import { FakeClientGameAdapters } from '../infra/game/client/FakeClientGameAdapters'
import { FakeServerAdapters } from '../infra/game/server/FakeServerAdapters'
import { stringifyWithDetailledSetAndMap } from '../messages'

type ScenarioType = 'client' | 'server'

export const serverScenario = (
    title:string,
    gameEvent:GameEvent|GameEvent[],
    clientIds:string[],
    tests:((game:ServerGameSystem, adapters:FakeServerAdapters, gameEvent:GameEvent|GameEvent[])=>Test)[],
    nextIdentifiers?:string[],
    skip?:boolean
) => {
    const serverTestSuite = () => {
        const adapters = new FakeServerAdapters(clientIds, nextIdentifiers)
        const game = new ServerGameSystem(adapters)
        tests.forEach(test => test(game, adapters, gameEvent))
    }
    return (skip)
        ? describe.skip(scenarioEventDescription(title, gameEvent, 'server', skip), serverTestSuite)
        : describe(scenarioEventDescription(title, gameEvent, 'server', skip), serverTestSuite)
}
export const clientScenario = (
    title:string,
    gameEvents:GameEvent|GameEvent[],
    clientId:string,
    // beforeMochaFunc:((game:ClientGameSystem, adapters:FakeClientGameAdapters)=>Func)|undefined,
    tests:((game:ClientGameSystem, adapters:FakeClientGameAdapters, gameEvent:GameEvent|GameEvent[])=>Test)[],
    nextIdentifiers?:string[],
    skip?:boolean
) => {
    const clientTestSuite = () => {
        const adapters = new FakeClientGameAdapters(clientId, nextIdentifiers)
        const game = new ClientGameSystem(adapters)
        // eslint-disable-next-line no-unused-expressions
        // if (beforeMochaFunc)before(beforeMochaFunc(game, adapters))
        tests.forEach(test => test(game, adapters, gameEvents))
    }
    return (skip)
        ? describe.skip(scenarioEventDescription(title, gameEvents, 'client', skip), clientTestSuite)
        : describe(scenarioEventDescription(title, gameEvents, 'client', skip), clientTestSuite)
}

export const scenarioEventDescription = (title:string, events: GameEvent|GameEvent[], scenarioType:ScenarioType, skip?:boolean): string =>
    ((Array.isArray(events))
        ? `
    ${(skip) ? pendingTestPrefix : ''}Scenario ${title} - ${scenarioType}:\n${events.map(event => `        Event action '${event.action}.'
        Entity references :'${stringifyWithDetailledSetAndMap(event.entityRefences)}'`).join('\n        And\n')}`
        : `
    ${(skip) ? pendingTestPrefix : ''}Scenario ${title} - ${scenarioType}:
        Event action '${events.action}.'
        Entity references :'${stringifyWithDetailledSetAndMap(events.entityRefences)}'
    `
    )
const pendingTestPrefix = '[PENDING] '
