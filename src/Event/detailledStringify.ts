export const stringifyWithDetailledSetAndMap = (value: any) => JSON.stringify(value, detailledStringifyForSetAndMap)
export const mapToObjectLiteral = (value: Map<any, any>): Record<string, any> => Array.from(value).reduce((obj: Record<string, any>, [key, value]) => {
    obj[key] = value
    return obj
}, {})
export const detailledStringifyForSetAndMap = (key: string, value: any): any =>
    (value instanceof Set)
        ? [...value.values()]
        : (value instanceof Map) ? mapToObjectLiteral(value) : value
