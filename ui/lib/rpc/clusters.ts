
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

export interface Condition {
    type: string;
    status: string;
    reason: string;
    message: string;
    
}

interface ConditionJSON {
    type: string;
    status: string;
    reason: string;
    message: string;
    
}


const JSONToCondition = (m: Condition | ConditionJSON): Condition => {
    
    return {
        type: m.type,
        status: m.status,
        reason: m.reason,
        message: m.message,
        
    };
};

export interface Kustomization {
    name: string;
    namespace: string;
    targetnamespace: string;
    path: string;
    sourceref: string;
    conditions: Condition[];
    
}

interface KustomizationJSON {
    name: string;
    namespace: string;
    targetNamespace: string;
    path: string;
    sourceRef: string;
    conditions: ConditionJSON[];
    
}


const JSONToKustomization = (m: Kustomization | KustomizationJSON): Kustomization => {
    
    return {
        name: m.name,
        namespace: m.namespace,
        targetnamespace: (((m as Kustomization).targetnamespace) ? (m as Kustomization).targetnamespace : (m as KustomizationJSON).targetNamespace),
        path: m.path,
        sourceref: (((m as Kustomization).sourceref) ? (m as Kustomization).sourceref : (m as KustomizationJSON).sourceRef),
        conditions: (m.conditions as (Condition | ConditionJSON)[]).map(JSONToCondition),
        
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

export interface GitRepositoryRef {
    branch: string;
    tag: string;
    semver: string;
    commit: string;
    
}

interface GitRepositoryRefJSON {
    branch: string;
    tag: string;
    semver: string;
    commit: string;
    
}


const JSONToGitRepositoryRef = (m: GitRepositoryRef | GitRepositoryRefJSON): GitRepositoryRef => {
    
    return {
        branch: m.branch,
        tag: m.tag,
        semver: m.semver,
        commit: m.commit,
        
    };
};

export interface Source {
    name: string;
    url: string;
    reference: GitRepositoryRef;
    type: string;
    provider: string;
    bucketname: string;
    region: string;
    
}

interface SourceJSON {
    name: string;
    url: string;
    reference: GitRepositoryRefJSON;
    type: string;
    provider: string;
    bucketname: string;
    region: string;
    
}


const JSONToSource = (m: Source | SourceJSON): Source => {
    
    return {
        name: m.name,
        url: m.url,
        reference: JSONToGitRepositoryRef(m.reference),
        type: m.type,
        provider: m.provider,
        bucketname: m.bucketname,
        region: m.region,
        
    };
};

export interface ListSourcesReq {
    contextname: string;
    sourcetype: string;
    
}

interface ListSourcesReqJSON {
    contextName: string;
    sourceType: string;
    
}


const ListSourcesReqToJSON = (m: ListSourcesReq): ListSourcesReqJSON => {
    return {
        contextName: m.contextname,
        sourceType: m.sourcetype,
        
    };
};

export interface ListSourcesRes {
    sources: Source[];
    
}

interface ListSourcesResJSON {
    sources: SourceJSON[];
    
}


const JSONToListSourcesRes = (m: ListSourcesRes | ListSourcesResJSON): ListSourcesRes => {
    
    return {
        sources: (m.sources as (Source | SourceJSON)[]).map(JSONToSource),
        
    };
};

export interface Clusters {
    listContexts: (listContextsReq: ListContextsReq) => Promise<ListContextsRes>;
    
    listKustomizations: (listKustomizationsReq: ListKustomizationsReq) => Promise<ListKustomizationsRes>;
    
    listSources: (listSourcesReq: ListSourcesReq) => Promise<ListSourcesRes>;
    
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
    
    listSources(listSourcesReq: ListSourcesReq): Promise<ListSourcesRes> {
        const url = this.hostname + this.pathPrefix + "ListSources";
        let body: ListSourcesReq | ListSourcesReqJSON = listSourcesReq;
        if (!this.writeCamelCase) {
            body = ListSourcesReqToJSON(listSourcesReq);
        }
        return this.fetch(createTwirpRequest(url, body)).then((resp) => {
            if (!resp.ok) {
                return throwTwirpError(resp);
            }

            return resp.json().then(JSONToListSourcesRes);
        });
    }
    
}

