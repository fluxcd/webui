
import {createTwirpRequest, throwTwirpError, Fetch} from './twirp';


export interface Context {
    name: string;
    
}

interface ContextJSON {
    name: string;
    
}


const JSONToContext = (m: Context | ContextJSON): Context => {
    
    return {
        name: m.name,
        
    };
};

export interface ListContextsReq {
    
}

interface ListContextsReqJSON {
    
}


const ListContextsReqToJSON = (m: ListContextsReq): ListContextsReqJSON => {
    return {
        
    };
};

export interface ListContextsRes {
    currentcontext: string;
    contexts: Context[];
    
}

interface ListContextsResJSON {
    currentContext: string;
    contexts: ContextJSON[];
    
}


const JSONToListContextsRes = (m: ListContextsRes | ListContextsResJSON): ListContextsRes => {
    
    return {
        currentcontext: (((m as ListContextsRes).currentcontext) ? (m as ListContextsRes).currentcontext : (m as ListContextsResJSON).currentContext),
        contexts: (m.contexts as (Context | ContextJSON)[]).map(JSONToContext),
        
    };
};

export interface Kustomization {
    name: string;
    
}

interface KustomizationJSON {
    name: string;
    
}


const JSONToKustomization = (m: Kustomization | KustomizationJSON): Kustomization => {
    
    return {
        name: m.name,
        
    };
};

export interface ListKustomizationsReq {
    contextname: string;
    
}

interface ListKustomizationsReqJSON {
    contextName: string;
    
}


const ListKustomizationsReqToJSON = (m: ListKustomizationsReq): ListKustomizationsReqJSON => {
    return {
        contextName: m.contextname,
        
    };
};

export interface ListKustomizationsRes {
    kustomizations: Kustomization[];
    
}

interface ListKustomizationsResJSON {
    kustomizations: KustomizationJSON[];
    
}


const JSONToListKustomizationsRes = (m: ListKustomizationsRes | ListKustomizationsResJSON): ListKustomizationsRes => {
    
    return {
        kustomizations: (m.kustomizations as (Kustomization | KustomizationJSON)[]).map(JSONToKustomization),
        
    };
};

export interface Clusters {
    listContexts: (listContextsReq: ListContextsReq) => Promise<ListContextsRes>;
    
    listKustomizations: (listKustomizationsReq: ListKustomizationsReq) => Promise<ListKustomizationsRes>;
    
}

export class DefaultClusters implements Clusters {
    private hostname: string;
    private fetch: Fetch;
    private writeCamelCase: boolean;
    private pathPrefix = "/twirp/clusters.Clusters/";

    constructor(hostname: string, fetch: Fetch, writeCamelCase = false) {
        this.hostname = hostname;
        this.fetch = fetch;
        this.writeCamelCase = writeCamelCase;
    }
    listContexts(listContextsReq: ListContextsReq): Promise<ListContextsRes> {
        const url = this.hostname + this.pathPrefix + "ListContexts";
        let body: ListContextsReq | ListContextsReqJSON = listContextsReq;
        if (!this.writeCamelCase) {
            body = ListContextsReqToJSON(listContextsReq);
        }
        return this.fetch(createTwirpRequest(url, body)).then((resp) => {
            if (!resp.ok) {
                return throwTwirpError(resp);
            }

            return resp.json().then(JSONToListContextsRes);
        });
    }
    
    listKustomizations(listKustomizationsReq: ListKustomizationsReq): Promise<ListKustomizationsRes> {
        const url = this.hostname + this.pathPrefix + "ListKustomizations";
        let body: ListKustomizationsReq | ListKustomizationsReqJSON = listKustomizationsReq;
        if (!this.writeCamelCase) {
            body = ListKustomizationsReqToJSON(listKustomizationsReq);
        }
        return this.fetch(createTwirpRequest(url, body)).then((resp) => {
            if (!resp.ok) {
                return throwTwirpError(resp);
            }

            return resp.json().then(JSONToListKustomizationsRes);
        });
    }
    
}

