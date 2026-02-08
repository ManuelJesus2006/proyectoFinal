// To parse this data:
//
//   import { Convert } from "./file";
//
//   const techProductsResponse = Convert.toTechProductsResponse(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface TechProductsResponse {
    id:               number;
    business:         string;
    name:             string;
    type:             string;
    price:            number;
    imageUrl:         string;
    release_date:     Date;
    characteristics?: Characteristics;
    creation_date:    Date;
    update_date:      Date;
}

export interface Characteristics {
    speed?:       string;
    max_speed?:   string;
    voltage?:     string;
    memory?:      string;
    boost_clock?: string;
    tdp?:         string;
    socket?:      string;
    chipset?:     string;
    form_factor?: string;
    type?:        string;
    interface?:   string;
    speed_read?:  string;
    speed_write?: string;
    rpm?:         string;
    cache?:       string;
    fans?:        string;
    noise?:       string;
    height?:      string;
    fan?:         string;
    wattage?:     string;
    efficiency?:  string;
    modular?:     string;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toTechProductsResponse(json: string): TechProductsResponse[] {
        return cast(JSON.parse(json), a(r("TechProductsResponse")));
    }

    public static techProductsResponseToJson(value: TechProductsResponse[]): string {
        return JSON.stringify(uncast(value, a(r("TechProductsResponse"))), null, 2);
    }
}

function invalidValue(typ: any, val: any, key: any, parent: any = ''): never {
    const prettyTyp = prettyTypeName(typ);
    const parentText = parent ? ` on ${parent}` : '';
    const keyText = key ? ` for key "${key}"` : '';
    throw Error(`Invalid value${keyText}${parentText}. Expected ${prettyTyp} but got ${JSON.stringify(val)}`);
}

function prettyTypeName(typ: any): string {
    if (Array.isArray(typ)) {
        if (typ.length === 2 && typ[0] === undefined) {
            return `an optional ${prettyTypeName(typ[1])}`;
        } else {
            return `one of [${typ.map(a => { return prettyTypeName(a); }).join(", ")}]`;
        }
    } else if (typeof typ === "object" && typ.literal !== undefined) {
        return typ.literal;
    } else {
        return typeof typ;
    }
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = '', parent: any = ''): any {
    function transformPrimitive(typ: string, val: any): any {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val, key, parent);
    }

    function transformUnion(typs: any[], val: any): any {
        // val must validate against one typ in typs
        const l = typs.length;
        for (let i = 0; i < l; i++) {
            const typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) {}
        }
        return invalidValue(typs, val, key, parent);
    }

    function transformEnum(cases: string[], val: any): any {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases.map(a => { return l(a); }), val, key, parent);
    }

    function transformArray(typ: any, val: any): any {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue(l("array"), val, key, parent);
        return val.map(el => transform(el, typ, getProps));
    }

    function transformDate(val: any): any {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue(l("Date"), val, key, parent);
        }
        return d;
    }

    function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue(l(ref || "object"), val, key, parent);
        }
        const result: any = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps, key, ref);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps, key, ref);
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val, key, parent);
    }
    if (typ === false) return invalidValue(typ, val, key, parent);
    let ref: any = undefined;
    while (typeof typ === "object" && typ.ref !== undefined) {
        ref = typ.ref;
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
            : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
            : invalidValue(typ, val, key, parent);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(val);
    return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps);
}

function l(typ: any) {
    return { literal: typ };
}

function a(typ: any) {
    return { arrayItems: typ };
}

function u(...typs: any[]) {
    return { unionMembers: typs };
}

function o(props: any[], additional: any) {
    return { props, additional };
}

function m(additional: any) {
    return { props: [], additional };
}

function r(name: string) {
    return { ref: name };
}

const typeMap: any = {
    "TechProductsResponse": o([
        { json: "id", js: "id", typ: 0 },
        { json: "business", js: "business", typ: "" },
        { json: "name", js: "name", typ: "" },
        { json: "type", js: "type", typ: "" },
        { json: "price", js: "price", typ: 3.14 },
        { json: "imageUrl", js: "imageUrl", typ: "" },
        { json: "release_date", js: "release_date", typ: Date },
        { json: "characteristics", js: "characteristics", typ: u(undefined, r("Characteristics")) },
        { json: "creation_date", js: "creation_date", typ: Date },
        { json: "update_date", js: "update_date", typ: Date },
    ], false),
    "Characteristics": o([
        { json: "speed", js: "speed", typ: u(undefined, "") },
        { json: "max_speed", js: "max_speed", typ: u(undefined, "") },
        { json: "voltage", js: "voltage", typ: u(undefined, "") },
        { json: "memory", js: "memory", typ: u(undefined, "") },
        { json: "boost_clock", js: "boost_clock", typ: u(undefined, "") },
        { json: "tdp", js: "tdp", typ: u(undefined, "") },
        { json: "socket", js: "socket", typ: u(undefined, "") },
        { json: "chipset", js: "chipset", typ: u(undefined, "") },
        { json: "form_factor", js: "form_factor", typ: u(undefined, "") },
        { json: "type", js: "type", typ: u(undefined, "") },
        { json: "interface", js: "interface", typ: u(undefined, "") },
        { json: "speed_read", js: "speed_read", typ: u(undefined, "") },
        { json: "speed_write", js: "speed_write", typ: u(undefined, "") },
        { json: "rpm", js: "rpm", typ: u(undefined, "") },
        { json: "cache", js: "cache", typ: u(undefined, "") },
        { json: "fans", js: "fans", typ: u(undefined, "") },
        { json: "noise", js: "noise", typ: u(undefined, "") },
        { json: "height", js: "height", typ: u(undefined, "") },
        { json: "fan", js: "fan", typ: u(undefined, "") },
        { json: "wattage", js: "wattage", typ: u(undefined, "") },
        { json: "efficiency", js: "efficiency", typ: u(undefined, "") },
        { json: "modular", js: "modular", typ: u(undefined, "") },
    ], false),
};
