
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
    contexts: Context[];
    
}

interface ListContextsResJSON {
    contexts: ContextJSON[];
    
}


const JSONToListContextsRes = (m: ListContextsRes | ListContextsResJSON): ListContextsRes => {
    
    return {
        contexts: (m.contexts as (Context | ContextJSON)[]).map(JSONToContext),
        
    };
};

export interface Clusters {
    listContexts: (listContextsReq: ListContextsReq) => Promise<ListContextsRes>;
    
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
    
}

