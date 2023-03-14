/* eslint-disable no-unused-vars */
export enum TestStep {
    Given = 'Given',
    AndGiven = 'And given',
    AndThen = 'And then',
    Then = 'Then'
}

export const isGiven = (testStep: TestStep) => testStep === TestStep.Given || testStep === TestStep.AndGiven
