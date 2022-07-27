
export type GenericComponent<C extends string, T extends Record<string, any>> = Readonly<{
    entityId: string;
    componentType: C;
} & T>;
