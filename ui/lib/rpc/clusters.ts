
import {createTwirpRequest, throwTwirpError, Fetch} from './twirp';


export interface Context {
    name?: string;
}

interface ContextJSON {
    name?: string;
}



const JSONToContext = (m: Context | ContextJSON): Context => {
    if (m === null) {
		return null;
	}
    return {
        name: m.name,
    };
};


export interface ListContextsReq {
}

interface ListContextsReqJSON {
}


const ListContextsReqToJSON = (_: ListContextsReq): ListContextsReqJSON => {
    return {};
};


export interface ListContextsRes {
    currentContext?: string;
    contexts?: Context[];
}

interface ListContextsResJSON {
    current_context?: string;
    contexts?: ContextJSON[];
}



const JSONToListContextsRes = (m: ListContextsRes | ListContextsResJSON): ListContextsRes => {
    if (m === null) {
		return null;
	}
    return {
        currentContext: (((m as ListContextsRes).currentContext) ? (m as ListContextsRes).currentContext : (m as ListContextsResJSON).current_context),
        contexts: (m.contexts as (Context | ContextJSON)[]).map(JSONToContext),
    };
};


export interface ListNamespacesForContextReq {
    contextname?: string;
}

interface ListNamespacesForContextReqJSON {
    contextName?: string;
}



const ListNamespacesForContextReqToJSON = (m: ListNamespacesForContextReq): ListNamespacesForContextReqJSON => {
	if (m === null) {
		return null;
	}
	
    return {
        contextName: m.contextname,
    };
};


export interface ListNamespacesForContextRes {
    namespaces?: string[];
}

interface ListNamespacesForContextResJSON {
    namespaces?: string[];
}



const JSONToListNamespacesForContextRes = (m: ListNamespacesForContextRes | ListNamespacesForContextResJSON): ListNamespacesForContextRes => {
    if (m === null) {
		return null;
	}
    return {
        namespaces: m.namespaces,
    };
};


export interface Condition {
    type?: string;
    status?: string;
    reason?: string;
    message?: string;
    timestamp?: string;
}

interface ConditionJSON {
    type?: string;
    status?: string;
    reason?: string;
    message?: string;
    timestamp?: string;
}



const JSONToCondition = (m: Condition | ConditionJSON): Condition => {
    if (m === null) {
		return null;
	}
    return {
        type: m.type,
        status: m.status,
        reason: m.reason,
        message: m.message,
        timestamp: m.timestamp,
    };
};


export interface ObjectRef {
    name?: string;
    namespace?: string;
    apiVersion?: string;
    kind?: string;
}

interface ObjectRefJSON {
    name?: string;
    namespace?: string;
    api_version?: string;
    kind?: string;
}



const JSONToObjectRef = (m: ObjectRef | ObjectRefJSON): ObjectRef => {
    if (m === null) {
		return null;
	}
    return {
        name: m.name,
        namespace: m.namespace,
        apiVersion: (((m as ObjectRef).apiVersion) ? (m as ObjectRef).apiVersion : (m as ObjectRefJSON).api_version),
        kind: m.kind,
    };
};


export interface Decryption {
    provider?: string;
    secretRef?: ObjectRef;
}

interface DecryptionJSON {
    provider?: string;
    secret_ref?: ObjectRefJSON;
}



const JSONToDecryption = (m: Decryption | DecryptionJSON): Decryption => {
    if (m === null) {
		return null;
	}
    return {
        provider: m.provider,
        secretRef: JSONToObjectRef((((m as Decryption).secretRef) ? (m as Decryption).secretRef : (m as DecryptionJSON).secret_ref)),
    };
};


export interface Kustomization {
    name?: string;
    namespace?: string;
    dependsOn?: ObjectRef[];
    decryption?: Decryption;
    interval?: string;
    kubeconfig?: string;
    path?: string;
    prune?: boolean;
    healthChecks?: ObjectRef[];
    serviceAccountName?: string;
    sourceRef?: ObjectRef;
    suspend?: boolean;
    targetNamespace?: string;
    timeout?: string;
    conditions?: Condition[];
    reconcileRequestAt?: string;
    reconciledAt?: string;
}

interface KustomizationJSON {
    name?: string;
    namespace?: string;
    depends_on?: ObjectRefJSON[];
    decryption?: DecryptionJSON;
    interval?: string;
    kubeconfig?: string;
    path?: string;
    prune?: boolean;
    health_checks?: ObjectRefJSON[];
    service_account_name?: string;
    source_ref?: ObjectRefJSON;
    suspend?: boolean;
    target_namespace?: string;
    timeout?: string;
    conditions?: ConditionJSON[];
    reconcile_request_at?: string;
    reconciled_at?: string;
}



const JSONToKustomization = (m: Kustomization | KustomizationJSON): Kustomization => {
    if (m === null) {
		return null;
	}
    return {
        name: m.name,
        namespace: m.namespace,
        dependsOn: ((((m as Kustomization).dependsOn) ? (m as Kustomization).dependsOn : (m as KustomizationJSON).depends_on) as (ObjectRef | ObjectRefJSON)[]).map(JSONToObjectRef),
        decryption: JSONToDecryption(m.decryption),
        interval: m.interval,
        kubeconfig: m.kubeconfig,
        path: m.path,
        prune: m.prune,
        healthChecks: ((((m as Kustomization).healthChecks) ? (m as Kustomization).healthChecks : (m as KustomizationJSON).health_checks) as (ObjectRef | ObjectRefJSON)[]).map(JSONToObjectRef),
        serviceAccountName: (((m as Kustomization).serviceAccountName) ? (m as Kustomization).serviceAccountName : (m as KustomizationJSON).service_account_name),
        sourceRef: JSONToObjectRef((((m as Kustomization).sourceRef) ? (m as Kustomization).sourceRef : (m as KustomizationJSON).source_ref)),
        suspend: m.suspend,
        targetNamespace: (((m as Kustomization).targetNamespace) ? (m as Kustomization).targetNamespace : (m as KustomizationJSON).target_namespace),
        timeout: m.timeout,
        conditions: (m.conditions as (Condition | ConditionJSON)[]).map(JSONToCondition),
        reconcileRequestAt: (((m as Kustomization).reconcileRequestAt) ? (m as Kustomization).reconcileRequestAt : (m as KustomizationJSON).reconcile_request_at),
        reconciledAt: (((m as Kustomization).reconciledAt) ? (m as Kustomization).reconciledAt : (m as KustomizationJSON).reconciled_at),
    };
};


export interface ListKustomizationsReq {
    contextName?: string;
    namespace?: string;
}

interface ListKustomizationsReqJSON {
    context_name?: string;
    namespace?: string;
}



const ListKustomizationsReqToJSON = (m: ListKustomizationsReq): ListKustomizationsReqJSON => {
	if (m === null) {
		return null;
	}
	
    return {
        context_name: m.contextName,
        namespace: m.namespace,
    };
};


export interface ListKustomizationsRes {
    kustomizations?: Kustomization[];
}

interface ListKustomizationsResJSON {
    kustomizations?: KustomizationJSON[];
}



const JSONToListKustomizationsRes = (m: ListKustomizationsRes | ListKustomizationsResJSON): ListKustomizationsRes => {
    if (m === null) {
		return null;
	}
    return {
        kustomizations: (m.kustomizations as (Kustomization | KustomizationJSON)[]).map(JSONToKustomization),
    };
};


export interface GitRepositoryRef {
    branch?: string;
    tag?: string;
    semver?: string;
    commit?: string;
}

interface GitRepositoryRefJSON {
    branch?: string;
    tag?: string;
    semver?: string;
    commit?: string;
}



const JSONToGitRepositoryRef = (m: GitRepositoryRef | GitRepositoryRefJSON): GitRepositoryRef => {
    if (m === null) {
		return null;
	}
    return {
        branch: m.branch,
        tag: m.tag,
        semver: m.semver,
        commit: m.commit,
    };
};


export interface Artifact {
    checksum?: string;
    lastUpdatedAt?: number;
    path?: string;
    revision?: string;
    url?: string;
}

interface ArtifactJSON {
    checksum?: string;
    last_updated_at?: number;
    path?: string;
    revision?: string;
    url?: string;
}



const JSONToArtifact = (m: Artifact | ArtifactJSON): Artifact => {
    if (m === null) {
		return null;
	}
    return {
        checksum: m.checksum,
        lastUpdatedAt: (((m as Artifact).lastUpdatedAt) ? (m as Artifact).lastUpdatedAt : (m as ArtifactJSON).last_updated_at),
        path: m.path,
        revision: m.revision,
        url: m.url,
    };
};


export interface Source {
    name?: string;
    url?: string;
    reference?: GitRepositoryRef;
    type?: string;
    provider?: string;
    bucketName?: string;
    region?: string;
    namespace?: string;
    gitImplementation?: string;
    timeout?: string;
    secretRefName?: string;
    conditions?: Condition[];
    artifact?: Artifact;
}

interface SourceJSON {
    name?: string;
    url?: string;
    reference?: GitRepositoryRefJSON;
    type?: string;
    provider?: string;
    bucket_name?: string;
    region?: string;
    namespace?: string;
    git_implementation?: string;
    timeout?: string;
    secret_ref_name?: string;
    conditions?: ConditionJSON[];
    artifact?: ArtifactJSON;
}



const JSONToSource = (m: Source | SourceJSON): Source => {
    if (m === null) {
		return null;
	}
    return {
        name: m.name,
        url: m.url,
        reference: JSONToGitRepositoryRef(m.reference),
        type: m.type,
        provider: m.provider,
        bucketName: (((m as Source).bucketName) ? (m as Source).bucketName : (m as SourceJSON).bucket_name),
        region: m.region,
        namespace: m.namespace,
        gitImplementation: (((m as Source).gitImplementation) ? (m as Source).gitImplementation : (m as SourceJSON).git_implementation),
        timeout: m.timeout,
        secretRefName: (((m as Source).secretRefName) ? (m as Source).secretRefName : (m as SourceJSON).secret_ref_name),
        conditions: (m.conditions as (Condition | ConditionJSON)[]).map(JSONToCondition),
        artifact: JSONToArtifact(m.artifact),
    };
};


export interface ListSourcesReq {
    contextName?: string;
    namespace?: string;
    sourceType?: string;
}

interface ListSourcesReqJSON {
    context_name?: string;
    namespace?: string;
    source_type?: string;
}



const ListSourcesReqToJSON = (m: ListSourcesReq): ListSourcesReqJSON => {
	if (m === null) {
		return null;
	}
	
    return {
        context_name: m.contextName,
        namespace: m.namespace,
        source_type: m.sourceType,
    };
};


export interface ListSourcesRes {
    sources?: Source[];
}

interface ListSourcesResJSON {
    sources?: SourceJSON[];
}



const JSONToListSourcesRes = (m: ListSourcesRes | ListSourcesResJSON): ListSourcesRes => {
    if (m === null) {
		return null;
	}
    return {
        sources: (m.sources as (Source | SourceJSON)[]).map(JSONToSource),
    };
};


export interface SyncKustomizationReq {
    contextName?: string;
    namespace?: string;
    kustomizationName?: string;
    withSource?: boolean;
}

interface SyncKustomizationReqJSON {
    context_name?: string;
    namespace?: string;
    kustomization_name?: string;
    with_source?: boolean;
}



const SyncKustomizationReqToJSON = (m: SyncKustomizationReq): SyncKustomizationReqJSON => {
	if (m === null) {
		return null;
	}
	
    return {
        context_name: m.contextName,
        namespace: m.namespace,
        kustomization_name: m.kustomizationName,
        with_source: m.withSource,
    };
};


export interface SyncKustomizationRes {
    kustomization?: Kustomization;
}

interface SyncKustomizationResJSON {
    kustomization?: KustomizationJSON;
}



const JSONToSyncKustomizationRes = (m: SyncKustomizationRes | SyncKustomizationResJSON): SyncKustomizationRes => {
    if (m === null) {
		return null;
	}
    return {
        kustomization: JSONToKustomization(m.kustomization),
    };
};


export interface HelmRelease {
    name?: string;
    namespace?: string;
    interval?: string;
    chartName?: string;
    version?: string;
    sourceKind?: string;
    sourceName?: string;
    sourceNamespace?: string;
    conditions?: Condition[];
}

interface HelmReleaseJSON {
    name?: string;
    namespace?: string;
    interval?: string;
    chart_name?: string;
    version?: string;
    source_kind?: string;
    source_name?: string;
    source_namespace?: string;
    conditions?: ConditionJSON[];
}



const JSONToHelmRelease = (m: HelmRelease | HelmReleaseJSON): HelmRelease => {
    if (m === null) {
		return null;
	}
    return {
        name: m.name,
        namespace: m.namespace,
        interval: m.interval,
        chartName: (((m as HelmRelease).chartName) ? (m as HelmRelease).chartName : (m as HelmReleaseJSON).chart_name),
        version: m.version,
        sourceKind: (((m as HelmRelease).sourceKind) ? (m as HelmRelease).sourceKind : (m as HelmReleaseJSON).source_kind),
        sourceName: (((m as HelmRelease).sourceName) ? (m as HelmRelease).sourceName : (m as HelmReleaseJSON).source_name),
        sourceNamespace: (((m as HelmRelease).sourceNamespace) ? (m as HelmRelease).sourceNamespace : (m as HelmReleaseJSON).source_namespace),
        conditions: (m.conditions as (Condition | ConditionJSON)[]).map(JSONToCondition),
    };
};


export interface ListHelmReleasesReq {
    contextName?: string;
    namespace?: string;
}

interface ListHelmReleasesReqJSON {
    context_name?: string;
    namespace?: string;
}



const ListHelmReleasesReqToJSON = (m: ListHelmReleasesReq): ListHelmReleasesReqJSON => {
	if (m === null) {
		return null;
	}
	
    return {
        context_name: m.contextName,
        namespace: m.namespace,
    };
};


export interface ListHelmReleasesRes {
    helmReleases?: HelmRelease[];
}

interface ListHelmReleasesResJSON {
    helm_releases?: HelmReleaseJSON[];
}



const JSONToListHelmReleasesRes = (m: ListHelmReleasesRes | ListHelmReleasesResJSON): ListHelmReleasesRes => {
    if (m === null) {
		return null;
	}
    return {
        helmReleases: ((((m as ListHelmReleasesRes).helmReleases) ? (m as ListHelmReleasesRes).helmReleases : (m as ListHelmReleasesResJSON).helm_releases) as (HelmRelease | HelmReleaseJSON)[]).map(JSONToHelmRelease),
    };
};


export interface Container {
    name?: string;
    image?: string;
}

interface ContainerJSON {
    name?: string;
    image?: string;
}



const JSONToContainer = (m: Container | ContainerJSON): Container => {
    if (m === null) {
		return null;
	}
    return {
        name: m.name,
        image: m.image,
    };
};


export interface PodTemplate {
    containers?: Container[];
}

interface PodTemplateJSON {
    containers?: ContainerJSON[];
}



const JSONToPodTemplate = (m: PodTemplate | PodTemplateJSON): PodTemplate => {
    if (m === null) {
		return null;
	}
    return {
        containers: (m.containers as (Container | ContainerJSON)[]).map(JSONToContainer),
    };
};


export interface Workload {
    name?: string;
    namespace?: string;
    kustomizationRefName?: string;
    kustomizationRefNamespace?: string;
    podTemplate?: PodTemplate;
}

interface WorkloadJSON {
    name?: string;
    namespace?: string;
    kustomization_ref_name?: string;
    kustomization_ref_namespace?: string;
    pod_template?: PodTemplateJSON;
}



const JSONToWorkload = (m: Workload | WorkloadJSON): Workload => {
    if (m === null) {
		return null;
	}
    return {
        name: m.name,
        namespace: m.namespace,
        kustomizationRefName: (((m as Workload).kustomizationRefName) ? (m as Workload).kustomizationRefName : (m as WorkloadJSON).kustomization_ref_name),
        kustomizationRefNamespace: (((m as Workload).kustomizationRefNamespace) ? (m as Workload).kustomizationRefNamespace : (m as WorkloadJSON).kustomization_ref_namespace),
        podTemplate: JSONToPodTemplate((((m as Workload).podTemplate) ? (m as Workload).podTemplate : (m as WorkloadJSON).pod_template)),
    };
};


export interface ListWorkloadsReq {
    contextName?: string;
    namespace?: string;
}

interface ListWorkloadsReqJSON {
    context_name?: string;
    namespace?: string;
}



const ListWorkloadsReqToJSON = (m: ListWorkloadsReq): ListWorkloadsReqJSON => {
	if (m === null) {
		return null;
	}
	
    return {
        context_name: m.contextName,
        namespace: m.namespace,
    };
};


export interface ListWorkloadsRes {
    workloads?: Workload[];
}

interface ListWorkloadsResJSON {
    workloads?: WorkloadJSON[];
}



const JSONToListWorkloadsRes = (m: ListWorkloadsRes | ListWorkloadsResJSON): ListWorkloadsRes => {
    if (m === null) {
		return null;
	}
    return {
        workloads: (m.workloads as (Workload | WorkloadJSON)[]).map(JSONToWorkload),
    };
};


export interface ListKustomizationChildrenReq {
    contextName?: string;
    kustomizationName?: string;
    kustomizationNamespace?: string;
}

interface ListKustomizationChildrenReqJSON {
    context_name?: string;
    kustomization_name?: string;
    kustomization_namespace?: string;
}


export interface ListKustomizationChildrenRes {
    workloads?: Workload[];
}

interface ListKustomizationChildrenResJSON {
    workloads?: WorkloadJSON[];
}


export interface Event {
    type?: string;
    reason?: string;
    message?: string;
    timestamp?: number;
    source?: string;
}

interface EventJSON {
    type?: string;
    reason?: string;
    message?: string;
    timestamp?: number;
    source?: string;
}



const JSONToEvent = (m: Event | EventJSON): Event => {
    if (m === null) {
		return null;
	}
    return {
        type: m.type,
        reason: m.reason,
        message: m.message,
        timestamp: m.timestamp,
        source: m.source,
    };
};


export interface ListEventsReq {
    contextName?: string;
    namespace?: string;
}

interface ListEventsReqJSON {
    context_name?: string;
    namespace?: string;
}



const ListEventsReqToJSON = (m: ListEventsReq): ListEventsReqJSON => {
	if (m === null) {
		return null;
	}
	
    return {
        context_name: m.contextName,
        namespace: m.namespace,
    };
};


export interface ListEventsRes {
    events?: Event[];
}

interface ListEventsResJSON {
    events?: EventJSON[];
}



const JSONToListEventsRes = (m: ListEventsRes | ListEventsResJSON): ListEventsRes => {
    if (m === null) {
		return null;
	}
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
    private headersOverride: HeadersInit;

    constructor(hostname: string, fetch: Fetch, writeCamelCase = false, headersOverride: HeadersInit = {}) {
        this.hostname = hostname;
        this.fetch = fetch;
        this.writeCamelCase = writeCamelCase;
        this.headersOverride = headersOverride;
    }
    listContexts(listContextsReq: ListContextsReq): Promise<ListContextsRes> {
        const url = this.hostname + this.pathPrefix + "ListContexts";
        let body: ListContextsReq | ListContextsReqJSON = listContextsReq;
        if (!this.writeCamelCase) {
            body = ListContextsReqToJSON(listContextsReq);
        }
        return this.fetch(createTwirpRequest(url, body, this.headersOverride)).then((resp) => {
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
        return this.fetch(createTwirpRequest(url, body, this.headersOverride)).then((resp) => {
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
        return this.fetch(createTwirpRequest(url, body, this.headersOverride)).then((resp) => {
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
        return this.fetch(createTwirpRequest(url, body, this.headersOverride)).then((resp) => {
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
        return this.fetch(createTwirpRequest(url, body, this.headersOverride)).then((resp) => {
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
        return this.fetch(createTwirpRequest(url, body, this.headersOverride)).then((resp) => {
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
        return this.fetch(createTwirpRequest(url, body, this.headersOverride)).then((resp) => {
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
        return this.fetch(createTwirpRequest(url, body, this.headersOverride)).then((resp) => {
            if (!resp.ok) {
                return throwTwirpError(resp);
            }

            return resp.json().then(JSONToListEventsRes);
        });
    }
    
}

