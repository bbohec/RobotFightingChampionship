import { Func, Test, before, describe } from 'mocha'
import { stringifyWithDetailledSetAndMap } from '../Event/detailledStringify'
import { GameEvent } from '../Event/GameEvent'
import { ClientGameSystem } from '../Systems/Game/ClientGame'
import { FakeClientAdapters } from '../Systems/Game/infra/FakeClientAdapters'
import { FakeServerAdapters } from '../Systems/Game/infra/FakeServerAdapters'
import { ServerGameSystem } from '../Systems/Game/ServerGame'

type ScenarioType = 'client' | 'server'

export const serverScenario = (
    title:string,
    gameEvent:GameEvent|GameEvent[],
    clientIds:string[],
    beforeMochaFunc:((game:ServerGameSystem, adapters:FakeServerAdapters)=>Func)|undefined,
    tests:((game:ServerGameSystem, adapters:FakeServerAdapters, gameEvent:GameEvent|GameEvent[])=>Test)[],
    nextIdentifiers?:string[],
    skip?:boolean
) => {
    const serverTestSuite = () => {
        const adapters = new FakeServerAdapters(clientIds, nextIdentifiers)
        const game = new ServerGameSystem(adapters)
        // eslint-disable-next-line no-unused-expressions
        if (beforeMochaFunc)before(beforeMochaFunc(game, adapters))
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
    beforeMochaFunc:((game:ClientGameSystem, adapters:FakeClientAdapters)=>Func)|undefined,
    tests:((game:ClientGameSystem, adapters:FakeClientAdapters, gameEvent:GameEvent|GameEvent[])=>Test)[],
    nextIdentifiers?:string[],
    skip?:boolean
) => {
    const clientTestSuite = () => {
        const adapters = new FakeClientAdapters(clientId, nextIdentifiers)
        const game = new ClientGameSystem(adapters)
        // eslint-disable-next-line no-unused-expressions
        if (beforeMochaFunc)before(beforeMochaFunc(game, adapters))
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
