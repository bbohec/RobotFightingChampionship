type AbstractComponent<Class> = Function & { prototype: Class }
export type PotentialClass<Class> = AbstractComponent<Class> | { new(...args: unknown[]): Class; };
