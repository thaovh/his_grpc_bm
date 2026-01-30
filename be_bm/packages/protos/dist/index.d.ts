export declare const PROTO_PATH: {
    readonly auth: string;
    readonly users: string;
    readonly masterData: string;
    readonly integration: string;
    readonly commons: string;
    readonly machine: string;
    readonly attendance: string;
    readonly gatewayConfig: string;
    readonly inventory: {
        readonly main: string;
        readonly inpatient: string;
        readonly other: string;
        readonly expMest: string;
        readonly expMestCabinet: string;
        readonly summary: string;
    };
};
export declare const PROTO_LOADER_OPTIONS: {
    keepCase: boolean;
    longs: StringConstructor;
    enums: StringConstructor;
    defaults: boolean;
    oneofs: boolean;
};
export declare const PROTO_ROOT_DIR: string;
