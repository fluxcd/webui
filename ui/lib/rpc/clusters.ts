
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

export interface ListNamespacesForContextReq {
    contextname: string;
    
}

interface ListNamespacesForContextReqJSON {
    contextName: string;
    
}


const ListNamespacesForContextReqToJSON = (m: ListNamespacesForContextReq): ListNamespacesForContextReqJSON => {
    return {
        contextName: m.contextname,
        
    };
};

export interface ListNamespacesForContextRes {
    namespaces: string[];
    
}

interface ListNamespacesForContextResJSON {
    namespaces: string[];
    
}


const JSONToListNamespacesForContextRes = (m: ListNamespacesForContextRes | ListNamespacesForContextResJSON): ListNamespacesForContextRes => {
    
    return {
        namespaces: m.namespaces,
        
    };
};

export interface Condition {
    type: string;
    status: string;
    reason: string;
    message: string;
    timestamp: string;
    
}

interface ConditionJSON {
    type: string;
    status: string;
    reason: string;
    message: string;
    timestamp: string;
    
}


const JSONToCondition = (m: Condition | ConditionJSON): Condition => {
    
    return {
        type: m.type,
        status: m.status,
        reason: m.reason,
        message: m.message,
        timestamp: m.timestamp,
        
    };
};

export interface Kustomization {
    name: string;
    namespace: string;
    targetnamespace: string;
    path: string;
    sourceref: string;
    conditions: Condition[];
    interval: string;
    prune: boolean;
    reconcilerequestat: string;
    reconcileat: string;
    sourcerefkind: string;
    
}

interface KustomizationJSON {
    name: string;
    namespace: string;
    targetNamespace: string;
    path: string;
    sourceRef: string;
    conditions: ConditionJSON[];
    interval: string;
    prune: boolean;
    reconcileRequestAt: string;
    reconcileAt: string;
    sourceRefKind: string;
    
}


const JSONToKustomization = (m: Kustomization | KustomizationJSON): Kustomization => {
    
    return {
        name: m.name,
        namespace: m.namespace,
        targetnamespace: (((m as Kustomization).targetnamespace) ? (m as Kustomization).targetnamespace : (m as KustomizationJSON).targetNamespace),
        path: m.path,
        sourceref: (((m as Kustomization).sourceref) ? (m as Kustomization).sourceref : (m as KustomizationJSON).sourceRef),
        conditions: (m.conditions as (Condition | ConditionJSON)[]).map(JSONToCondition),
        interval: m.interval,
        prune: m.prune,
        reconcilerequestat: (((m as Kustomization).reconcilerequestat) ? (m as Kustomization).reconcilerequestat : (m as KustomizationJSON).reconcileRequestAt),
        reconcileat: (((m as Kustomization).reconcileat) ? (m as Kustomization).reconcileat : (m as KustomizationJSON).reconcileAt),
        sourcerefkind: (((m as Kustomization).sourcerefkind) ? (m as Kustomization).sourcerefkind : (m as KustomizationJSON).sourceRefKind),
        
    };
};

export interface ListKustomizationsReq {
    contextname: string;
    namespace: string;
    
}

interface ListKustomizationsReqJSON {
    contextName: string;
    namespace: string;
    
}


const ListKustomizationsReqToJSON = (m: ListKustomizationsReq): ListKustomizationsReqJSON => {
    return {
        contextName: m.contextname,
        namespace: m.namespace,
        
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

export interface Artifact {
    checksum: string;
    lastupdateat: number;
    path: string;
    revision: string;
    url: string;
    
}

interface ArtifactJSON {
    checksum: string;
    lastupdateat: number;
    path: string;
    revision: string;
    url: string;
    
}


const JSONToArtifact = (m: Artifact | ArtifactJSON): Artifact => {
    
    return {
        checksum: m.checksum,
        lastupdateat: m.lastupdateat,
        path: m.path,
        revision: m.revision,
        url: m.url,
        
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
    namespace: string;
    gitimplementation: string;
    timeout: string;
    secretrefname: string;
    conditions: Condition[];
    artifact: Artifact;
    
}

interface SourceJSON {
    name: string;
    url: string;
    reference: GitRepositoryRefJSON;
    type: string;
    provider: string;
    bucketname: string;
    region: string;
    namespace: string;
    gitimplementation: string;
    timeout: string;
    secretRefName: string;
    conditions: ConditionJSON[];
    artifact: ArtifactJSON;
    
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
        namespace: m.namespace,
        gitimplementation: m.gitimplementation,
        timeout: m.timeout,
        secretrefname: (((m as Source).secretrefname) ? (m as Source).secretrefname : (m as SourceJSON).secretRefName),
        conditions: (m.conditions as (Condition | ConditionJSON)[]).map(JSONToCondition),
        artifact: JSONToArtifact(m.artifact),
        
    };
};

export interface ListSourcesReq {
    contextname: string;
    namespace: string;
    sourcetype: string;
    
}

interface ListSourcesReqJSON {
    contextName: string;
    namespace: string;
    sourceType: string;
    
}


const ListSourcesReqToJSON = (m: ListSourcesReq): ListSourcesReqJSON => {
    return {
        contextName: m.contextname,
        namespace: m.namespace,
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

export interface SyncKustomizationReq {
    contextname: string;
    namespace: string;
    kustomizationname: string;
    withsource: boolean;
    
}

interface SyncKustomizationReqJSON {
    contextName: string;
    namespace: string;
    kustomizationName: string;
    withSource: boolean;
    
}


const SyncKustomizationReqToJSON = (m: SyncKustomizationReq): SyncKustomizationReqJSON => {
    return {
        contextName: m.contextname,
        namespace: m.namespace,
        kustomizationName: m.kustomizationname,
        withSource: m.withsource,
        
    };
};

export interface SyncKustomizationRes {
    kustomization: Kustomization;
    
}

interface SyncKustomizationResJSON {
    kustomization: KustomizationJSON;
    
}


const JSONToSyncKustomizationRes = (m: SyncKustomizationRes | SyncKustomizationResJSON): SyncKustomizationRes => {
    
    return {
        kustomization: JSONToKustomization(m.kustomization),
        
    };
};

export interface HelmRelease {
    name: string;
    namespace: string;
    interval: string;
    chartname: string;
    version: string;
    sourcekind: string;
    sourcename: string;
    sourcenamespace: string;
    
}

interface HelmReleaseJSON {
    name: string;
    namespace: string;
    interval: string;
    chartName: string;
    version: string;
    sourceKind: string;
    sourceName: string;
    sourceNamespace: string;
    
}


const JSONToHelmRelease = (m: HelmRelease | HelmReleaseJSON): HelmRelease => {
    
    return {
        name: m.name,
        namespace: m.namespace,
        interval: m.interval,
        chartname: (((m as HelmRelease).chartname) ? (m as HelmRelease).chartname : (m as HelmReleaseJSON).chartName),
        version: m.version,
        sourcekind: (((m as HelmRelease).sourcekind) ? (m as HelmRelease).sourcekind : (m as HelmReleaseJSON).sourceKind),
        sourcename: (((m as HelmRelease).sourcename) ? (m as HelmRelease).sourcename : (m as HelmReleaseJSON).sourceName),
        sourcenamespace: (((m as HelmRelease).sourcenamespace) ? (m as HelmRelease).sourcenamespace : (m as HelmReleaseJSON).sourceNamespace),
        
    };
};

export interface ListHelmReleasesReq {
    contextname: string;
    namespace: string;
    
}

interface ListHelmReleasesReqJSON {
    contextName: string;
    namespace: string;
    
}


const ListHelmReleasesReqToJSON = (m: ListHelmReleasesReq): ListHelmReleasesReqJSON => {
    return {
        contextName: m.contextname,
        namespace: m.namespace,
        
    };
};

export interface ListHelmReleasesRes {
    helmReleases: HelmRelease[];
    
}

interface ListHelmReleasesResJSON {
    helm_releases: HelmReleaseJSON[];
    
}


const JSONToListHelmReleasesRes = (m: ListHelmReleasesRes | ListHelmReleasesResJSON): ListHelmReleasesRes => {
    
    return {
        helmReleases: ((((m as ListHelmReleasesRes).helmReleases) ? (m as ListHelmReleasesRes).helmReleases : (m as ListHelmReleasesResJSON).helm_releases) as (HelmRelease | HelmReleaseJSON)[]).map(JSONToHelmRelease),
        
    };
};

export interface Container {
    name: string;
    image: string;
    
}

interface ContainerJSON {
    name: string;
    image: string;
    
}


const JSONToContainer = (m: Container | ContainerJSON): Container => {
    
    return {
        name: m.name,
        image: m.image,
        
    };
};

export interface PodTemplate {
    containers: Container[];
    
}

interface PodTemplateJSON {
    containers: ContainerJSON[];
    
}


const JSONToPodTemplate = (m: PodTemplate | PodTemplateJSON): PodTemplate => {
    
    return {
        containers: (m.containers as (Container | ContainerJSON)[]).map(JSONToContainer),
        
    };
};

export interface Workload {
    name: string;
    namespace: string;
    kustomizationrefname: string;
    kustomizationrefnamespace: string;
    podtemplate: PodTemplate;
    
}

interface WorkloadJSON {
    name: string;
    namespace: string;
    kustomizationRefName: string;
    kustomizationRefNamespace: string;
    podTemplate: PodTemplateJSON;
    
}


const JSONToWorkload = (m: Workload | WorkloadJSON): Workload => {
    
    return {
        name: m.name,
        namespace: m.namespace,
        kustomizationrefname: (((m as Workload).kustomizationrefname) ? (m as Workload).kustomizationrefname : (m as WorkloadJSON).kustomizationRefName),
        kustomizationrefnamespace: (((m as Workload).kustomizationrefnamespace) ? (m as Workload).kustomizationrefnamespace : (m as WorkloadJSON).kustomizationRefNamespace),
        podtemplate: JSONToPodTemplate((((m as Workload).podtemplate) ? (m as Workload).podtemplate : (m as WorkloadJSON).podTemplate)),
        
    };
};

export interface ListWorkloadsReq {
    contextname: string;
    namespace: string;
    
}

interface ListWorkloadsReqJSON {
    contextName: string;
    namespace: string;
    
}


const ListWorkloadsReqToJSON = (m: ListWorkloadsReq): ListWorkloadsReqJSON => {
    return {
        contextName: m.contextname,
        namespace: m.namespace,
        
    };
};

export interface ListWorkloadsRes {
    workloads: Workload[];
    
}

interface ListWorkloadsResJSON {
    workloads: WorkloadJSON[];
    
}


const JSONToListWorkloadsRes = (m: ListWorkloadsRes | ListWorkloadsResJSON): ListWorkloadsRes => {
    
    return {
        workloads: (m.workloads as (Workload | WorkloadJSON)[]).map(JSONToWorkload),
        
    };
};

export interface ListKustomizationChildrenReq {
    contextname: string;
    kustomizationname: string;
    kustomizationnamespace: string;
    
}

interface ListKustomizationChildrenReqJSON {
    contextName: string;
    kustomizationName: string;
    KustomizationNamespace: string;
    
}


export interface ListKustomizationChildrenRes {
    workloads: Workload[];
    
}

interface ListKustomizationChildrenResJSON {
    workloads: WorkloadJSON[];
    
}


export interface Event {
    type: string;
    reason: string;
    message: string;
    timestamp: number;
    
}

interface EventJSON {
    type: string;
    reason: string;
    message: string;
    timestamp: number;
    
}


const JSONToEvent = (m: Event | EventJSON): Event => {
    
    return {
        type: m.type,
        reason: m.reason,
        message: m.message,
        timestamp: m.timestamp,
        
    };
};

export interface ListEventsReq {
    contextname: string;
    namespace: string;
    
}

interface ListEventsReqJSON {
    contextName: string;
    namespace: string;
    
}


const ListEventsReqToJSON = (m: ListEventsReq): ListEventsReqJSON => {
    return {
        contextName: m.contextname,
        namespace: m.namespace,
        
    };
};

export interface ListEventsRes {
    events: Event[];
    
}

interface ListEventsResJSON {
    events: EventJSON[];
    
}


const JSONToListEventsRes = (m: ListEventsRes | ListEventsResJSON): ListEventsRes => {
    
    return {
        events: (m.events as (Event | EventJSON)[]).map(JSONToEvent),
        
    };
};

export interface Clusters {
    listContexts: (listContextsReq: ListContextsReq) => Promise<ListContextsRes>;
    
    listNamespacesForContext: (listNamespacesForContextReq: ListNamespacesForContextReq) => Promise<ListNamespacesForContextRes>;
    
    listKustomizations: (listKustomizationsReq: ListKustomizationsReq) => Promise<ListKustomizationsRes>;
    
    listSources: (listSourcesReq: ListSourcesReq) => Promise<ListSourcesRes>;
    
    syncKustomization: (syncKustomizationReq: SyncKustomizationReq) => Promise<SyncKustomizationRes>;
    
    listHelmReleases: (listHelmReleasesReq: ListHelmReleasesReq) => Promise<ListHelmReleasesRes>;
    
    listWorkloads: (listWorkloadsReq: ListWorkloadsReq) => Promise<ListWorkloadsRes>;
    
    listEvents: (listEventsReq: ListEventsReq) => Promise<ListEventsRes>;
    
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
    
    listNamespacesForContext(listNamespacesForContextReq: ListNamespacesForContextReq): Promise<ListNamespacesForContextRes> {
        const url = this.hostname + this.pathPrefix + "ListNamespacesForContext";
        let body: ListNamespacesForContextReq | ListNamespacesForContextReqJSON = listNamespacesForContextReq;
        if (!this.writeCamelCase) {
            body = ListNamespacesForContextReqToJSON(listNamespacesForContextReq);
        }
        return this.fetch(createTwirpRequest(url, body)).then((resp) => {
            if (!resp.ok) {
                return throwTwirpError(resp);
            }

            return resp.json().then(JSONToListNamespacesForContextRes);
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
    
    syncKustomization(syncKustomizationReq: SyncKustomizationReq): Promise<SyncKustomizationRes> {
        const url = this.hostname + this.pathPrefix + "SyncKustomization";
        let body: SyncKustomizationReq | SyncKustomizationReqJSON = syncKustomizationReq;
        if (!this.writeCamelCase) {
            body = SyncKustomizationReqToJSON(syncKustomizationReq);
        }
        return this.fetch(createTwirpRequest(url, body)).then((resp) => {
            if (!resp.ok) {
                return throwTwirpError(resp);
            }

            return resp.json().then(JSONToSyncKustomizationRes);
        });
    }
    
    listHelmReleases(listHelmReleasesReq: ListHelmReleasesReq): Promise<ListHelmReleasesRes> {
        const url = this.hostname + this.pathPrefix + "ListHelmReleases";
        let body: ListHelmReleasesReq | ListHelmReleasesReqJSON = listHelmReleasesReq;
        if (!this.writeCamelCase) {
            body = ListHelmReleasesReqToJSON(listHelmReleasesReq);
        }
        return this.fetch(createTwirpRequest(url, body)).then((resp) => {
            if (!resp.ok) {
                return throwTwirpError(resp);
            }

            return resp.json().then(JSONToListHelmReleasesRes);
        });
    }
    
    listWorkloads(listWorkloadsReq: ListWorkloadsReq): Promise<ListWorkloadsRes> {
        const url = this.hostname + this.pathPrefix + "ListWorkloads";
        let body: ListWorkloadsReq | ListWorkloadsReqJSON = listWorkloadsReq;
        if (!this.writeCamelCase) {
            body = ListWorkloadsReqToJSON(listWorkloadsReq);
        }
        return this.fetch(createTwirpRequest(url, body)).then((resp) => {
            if (!resp.ok) {
                return throwTwirpError(resp);
            }

            return resp.json().then(JSONToListWorkloadsRes);
        });
    }
    
    listEvents(listEventsReq: ListEventsReq): Promise<ListEventsRes> {
        const url = this.hostname + this.pathPrefix + "ListEvents";
        let body: ListEventsReq | ListEventsReqJSON = listEventsReq;
        if (!this.writeCamelCase) {
            body = ListEventsReqToJSON(listEventsReq);
        }
        return this.fetch(createTwirpRequest(url, body)).then((resp) => {
            if (!resp.ok) {
                return throwTwirpError(resp);
            }

            return resp.json().then(JSONToListEventsRes);
        });
    }
    
}

