
import {createTwirpRequest, throwTwirpError, Fetch} from './twirp';


export enum Type {
    Git = 0,
    Bucket = 1,
    Helm = 2,
    Chart = 3,
}

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
    currentcontext?: string;
    contexts?: Context[];
}

interface ListContextsResJSON {
    currentContext?: string;
    contexts?: ContextJSON[];
}



const JSONToListContextsRes = (m: ListContextsRes | ListContextsResJSON): ListContextsRes => {
    if (m === null) {
		return null;
	}
    return {
        currentcontext: (((m as ListContextsRes).currentcontext) ? (m as ListContextsRes).currentcontext : (m as ListContextsResJSON).currentContext),
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


export interface CrossNamespaceObjectReference {
    apiversion?: string;
    kind?: string;
    name?: string;
    namespace?: string;
}

interface CrossNamespaceObjectReferenceJSON {
    apiVersion?: string;
    kind?: string;
    name?: string;
    namespace?: string;
}



const JSONToCrossNamespaceObjectReference = (m: CrossNamespaceObjectReference | CrossNamespaceObjectReferenceJSON): CrossNamespaceObjectReference => {
    if (m === null) {
		return null;
	}
    return {
        apiversion: (((m as CrossNamespaceObjectReference).apiversion) ? (m as CrossNamespaceObjectReference).apiversion : (m as CrossNamespaceObjectReferenceJSON).apiVersion),
        kind: m.kind,
        name: m.name,
        namespace: m.namespace,
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


export interface GroupVersionKind {
    group?: string;
    kind?: string;
    version?: string;
}

interface GroupVersionKindJSON {
    group?: string;
    kind?: string;
    version?: string;
}



const GroupVersionKindToJSON = (m: GroupVersionKind): GroupVersionKindJSON => {
	if (m === null) {
		return null;
	}
	
    return {
        group: m.group,
        kind: m.kind,
        version: m.version,
    };
};



const JSONToGroupVersionKind = (m: GroupVersionKind | GroupVersionKindJSON): GroupVersionKind => {
    if (m === null) {
		return null;
	}
    return {
        group: m.group,
        kind: m.kind,
        version: m.version,
    };
};


export interface SnapshotEntry {
    namespace?: string;
    kinds?: GroupVersionKind[];
}

interface SnapshotEntryJSON {
    namespace?: string;
    kinds?: GroupVersionKindJSON[];
}



const JSONToSnapshotEntry = (m: SnapshotEntry | SnapshotEntryJSON): SnapshotEntry => {
    if (m === null) {
		return null;
	}
    return {
        namespace: m.namespace,
        kinds: (m.kinds as (GroupVersionKind | GroupVersionKindJSON)[]).map(JSONToGroupVersionKind),
    };
};


export interface Kustomization {
    name?: string;
    namespace?: string;
    targetnamespace?: string;
    path?: string;
    sourceref?: string;
    conditions?: Condition[];
    interval?: string;
    prune?: boolean;
    reconcilerequestat?: string;
    reconcileat?: string;
    sourcerefkind?: Type;
    snapshots?: SnapshotEntry[];
    lastappliedrevision?: string;
    lastattemptedrevision?: string;
}

interface KustomizationJSON {
    name?: string;
    namespace?: string;
    targetNamespace?: string;
    path?: string;
    sourceRef?: string;
    conditions?: ConditionJSON[];
    interval?: string;
    prune?: boolean;
    reconcileRequestAt?: string;
    reconcileAt?: string;
    sourceRefKind?: Type;
    snapshots?: SnapshotEntryJSON[];
    lastAppliedRevision?: string;
    lastAttemptedRevision?: string;
}



const JSONToKustomization = (m: Kustomization | KustomizationJSON): Kustomization => {
    if (m === null) {
		return null;
	}
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
        snapshots: (m.snapshots as (SnapshotEntry | SnapshotEntryJSON)[]).map(JSONToSnapshotEntry),
        lastappliedrevision: (((m as Kustomization).lastappliedrevision) ? (m as Kustomization).lastappliedrevision : (m as KustomizationJSON).lastAppliedRevision),
        lastattemptedrevision: (((m as Kustomization).lastattemptedrevision) ? (m as Kustomization).lastattemptedrevision : (m as KustomizationJSON).lastAttemptedRevision),
    };
};


export interface ListKustomizationsReq {
    contextname?: string;
    namespace?: string;
}

interface ListKustomizationsReqJSON {
    contextName?: string;
    namespace?: string;
}



const ListKustomizationsReqToJSON = (m: ListKustomizationsReq): ListKustomizationsReqJSON => {
	if (m === null) {
		return null;
	}
	
    return {
        contextName: m.contextname,
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
    lastupdateat?: number;
    path?: string;
    revision?: string;
    url?: string;
}

interface ArtifactJSON {
    checksum?: string;
    lastupdateat?: number;
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
        lastupdateat: m.lastupdateat,
        path: m.path,
        revision: m.revision,
        url: m.url,
    };
};


export interface Source {
    name?: string;
    url?: string;
    reference?: GitRepositoryRef;
    type?: Type;
    provider?: string;
    bucketname?: string;
    region?: string;
    namespace?: string;
    gitimplementation?: string;
    timeout?: string;
    secretrefname?: string;
    conditions?: Condition[];
    artifact?: Artifact;
}

interface SourceJSON {
    name?: string;
    url?: string;
    reference?: GitRepositoryRefJSON;
    type?: Type;
    provider?: string;
    bucketname?: string;
    region?: string;
    namespace?: string;
    gitimplementation?: string;
    timeout?: string;
    secretRefName?: string;
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
    contextname?: string;
    namespace?: string;
    sourcetype?: Type;
}

interface ListSourcesReqJSON {
    contextName?: string;
    namespace?: string;
    sourceType?: Type;
}



const ListSourcesReqToJSON = (m: ListSourcesReq): ListSourcesReqJSON => {
	if (m === null) {
		return null;
	}
	
    return {
        contextName: m.contextname,
        namespace: m.namespace,
        sourceType: m.sourcetype,
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


export interface SyncSourceReq {
    contextname?: string;
    namespace?: string;
    sourcename?: string;
    sourcetype?: Type;
}

interface SyncSourceReqJSON {
    contextName?: string;
    namespace?: string;
    sourceName?: string;
    sourceType?: Type;
}



const SyncSourceReqToJSON = (m: SyncSourceReq): SyncSourceReqJSON => {
	if (m === null) {
		return null;
	}
	
    return {
        contextName: m.contextname,
        namespace: m.namespace,
        sourceName: m.sourcename,
        sourceType: m.sourcetype,
    };
};


export interface SyncSourceRes {
    source?: Source;
}

interface SyncSourceResJSON {
    source?: SourceJSON;
}



const JSONToSyncSourceRes = (m: SyncSourceRes | SyncSourceResJSON): SyncSourceRes => {
    if (m === null) {
		return null;
	}
    return {
        source: JSONToSource(m.source),
    };
};


export interface SyncKustomizationReq {
    contextname?: string;
    namespace?: string;
    kustomizationname?: string;
    withsource?: boolean;
}

interface SyncKustomizationReqJSON {
    contextName?: string;
    namespace?: string;
    kustomizationName?: string;
    withSource?: boolean;
}



const SyncKustomizationReqToJSON = (m: SyncKustomizationReq): SyncKustomizationReqJSON => {
	if (m === null) {
		return null;
	}
	
    return {
        contextName: m.contextname,
        namespace: m.namespace,
        kustomizationName: m.kustomizationname,
        withSource: m.withsource,
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
    chartname?: string;
    version?: string;
    sourcekind?: string;
    sourcename?: string;
    sourcenamespace?: string;
    conditions?: Condition[];
}

interface HelmReleaseJSON {
    name?: string;
    namespace?: string;
    interval?: string;
    chartName?: string;
    version?: string;
    sourceKind?: string;
    sourceName?: string;
    sourceNamespace?: string;
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
        chartname: (((m as HelmRelease).chartname) ? (m as HelmRelease).chartname : (m as HelmReleaseJSON).chartName),
        version: m.version,
        sourcekind: (((m as HelmRelease).sourcekind) ? (m as HelmRelease).sourcekind : (m as HelmReleaseJSON).sourceKind),
        sourcename: (((m as HelmRelease).sourcename) ? (m as HelmRelease).sourcename : (m as HelmReleaseJSON).sourceName),
        sourcenamespace: (((m as HelmRelease).sourcenamespace) ? (m as HelmRelease).sourcenamespace : (m as HelmReleaseJSON).sourceNamespace),
        conditions: (m.conditions as (Condition | ConditionJSON)[]).map(JSONToCondition),
    };
};


export interface ListHelmReleasesReq {
    contextname?: string;
    namespace?: string;
}

interface ListHelmReleasesReqJSON {
    contextName?: string;
    namespace?: string;
}



const ListHelmReleasesReqToJSON = (m: ListHelmReleasesReq): ListHelmReleasesReqJSON => {
	if (m === null) {
		return null;
	}
	
    return {
        contextName: m.contextname,
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


export interface SyncHelmReleaseReq {
    contextname?: string;
    namespace?: string;
    helmreleasename?: string;
}

interface SyncHelmReleaseReqJSON {
    contextName?: string;
    namespace?: string;
    helmReleaseName?: string;
}



const SyncHelmReleaseReqToJSON = (m: SyncHelmReleaseReq): SyncHelmReleaseReqJSON => {
	if (m === null) {
		return null;
	}
	
    return {
        contextName: m.contextname,
        namespace: m.namespace,
        helmReleaseName: m.helmreleasename,
    };
};


export interface SyncHelmReleaseRes {
    helmrelease?: HelmRelease;
}

interface SyncHelmReleaseResJSON {
    helmrelease?: HelmReleaseJSON;
}



const JSONToSyncHelmReleaseRes = (m: SyncHelmReleaseRes | SyncHelmReleaseResJSON): SyncHelmReleaseRes => {
    if (m === null) {
		return null;
	}
    return {
        helmrelease: JSONToHelmRelease(m.helmrelease),
    };
};


export interface ImagePolicy {
    name?: string;
    namespace?: string;
    imagerepositoryref?: string;
    policykind?: string;
    policy?: string;
    filtertagspattern?: string;
    filtertagsextract?: string;
    latestimage?: string;
    conditions?: Condition[];
}

interface ImagePolicyJSON {
    name?: string;
    namespace?: string;
    imageRepositoryRef?: string;
    policyKind?: string;
    policy?: string;
    filterTagsPattern?: string;
    filterTagsExtract?: string;
    latestImage?: string;
    conditions?: ConditionJSON[];
}



const JSONToImagePolicy = (m: ImagePolicy | ImagePolicyJSON): ImagePolicy => {
    if (m === null) {
		return null;
	}
    return {
        name: m.name,
        namespace: m.namespace,
        imagerepositoryref: (((m as ImagePolicy).imagerepositoryref) ? (m as ImagePolicy).imagerepositoryref : (m as ImagePolicyJSON).imageRepositoryRef),
        policykind: (((m as ImagePolicy).policykind) ? (m as ImagePolicy).policykind : (m as ImagePolicyJSON).policyKind),
        policy: m.policy,
        filtertagspattern: (((m as ImagePolicy).filtertagspattern) ? (m as ImagePolicy).filtertagspattern : (m as ImagePolicyJSON).filterTagsPattern),
        filtertagsextract: (((m as ImagePolicy).filtertagsextract) ? (m as ImagePolicy).filtertagsextract : (m as ImagePolicyJSON).filterTagsExtract),
        latestimage: (((m as ImagePolicy).latestimage) ? (m as ImagePolicy).latestimage : (m as ImagePolicyJSON).latestImage),
        conditions: (m.conditions as (Condition | ConditionJSON)[]).map(JSONToCondition),
    };
};


export interface ListImagePoliciesReq {
    contextname?: string;
    namespace?: string;
}

interface ListImagePoliciesReqJSON {
    contextName?: string;
    namespace?: string;
}



const ListImagePoliciesReqToJSON = (m: ListImagePoliciesReq): ListImagePoliciesReqJSON => {
	if (m === null) {
		return null;
	}
	
    return {
        contextName: m.contextname,
        namespace: m.namespace,
    };
};


export interface ListImagePoliciesRes {
    imagePolicies?: ImagePolicy[];
}

interface ListImagePoliciesResJSON {
    image_policies?: ImagePolicyJSON[];
}



const JSONToListImagePoliciesRes = (m: ListImagePoliciesRes | ListImagePoliciesResJSON): ListImagePoliciesRes => {
    if (m === null) {
		return null;
	}
    return {
        imagePolicies: ((((m as ListImagePoliciesRes).imagePolicies) ? (m as ListImagePoliciesRes).imagePolicies : (m as ListImagePoliciesResJSON).image_policies) as (ImagePolicy | ImagePolicyJSON)[]).map(JSONToImagePolicy),
    };
};


export interface ImageRepository {
    name?: string;
    namespace?: string;
    image?: string;
    secretref?: string;
    conditions?: Condition[];
    interval?: string;
    timeout?: string;
    certsecretref?: string;
    suspend?: boolean;
    reconcilerequestat?: string;
    reconcileat?: string;
    lastscanresulttagcount?: number;
    lastscanresultscantime?: number;
}

interface ImageRepositoryJSON {
    name?: string;
    namespace?: string;
    image?: string;
    secretRef?: string;
    conditions?: ConditionJSON[];
    interval?: string;
    timeout?: string;
    certSecretRef?: string;
    suspend?: boolean;
    reconcileRequestAt?: string;
    reconcileAt?: string;
    lastScanResultTagCount?: number;
    lastScanResultScanTime?: number;
}



const JSONToImageRepository = (m: ImageRepository | ImageRepositoryJSON): ImageRepository => {
    if (m === null) {
		return null;
	}
    return {
        name: m.name,
        namespace: m.namespace,
        image: m.image,
        secretref: (((m as ImageRepository).secretref) ? (m as ImageRepository).secretref : (m as ImageRepositoryJSON).secretRef),
        conditions: (m.conditions as (Condition | ConditionJSON)[]).map(JSONToCondition),
        interval: m.interval,
        timeout: m.timeout,
        certsecretref: (((m as ImageRepository).certsecretref) ? (m as ImageRepository).certsecretref : (m as ImageRepositoryJSON).certSecretRef),
        suspend: m.suspend,
        reconcilerequestat: (((m as ImageRepository).reconcilerequestat) ? (m as ImageRepository).reconcilerequestat : (m as ImageRepositoryJSON).reconcileRequestAt),
        reconcileat: (((m as ImageRepository).reconcileat) ? (m as ImageRepository).reconcileat : (m as ImageRepositoryJSON).reconcileAt),
        lastscanresulttagcount: (((m as ImageRepository).lastscanresulttagcount) ? (m as ImageRepository).lastscanresulttagcount : (m as ImageRepositoryJSON).lastScanResultTagCount),
        lastscanresultscantime: (((m as ImageRepository).lastscanresultscantime) ? (m as ImageRepository).lastscanresultscantime : (m as ImageRepositoryJSON).lastScanResultScanTime),
    };
};


export interface ListImageRepositoriesReq {
    contextname?: string;
    namespace?: string;
}

interface ListImageRepositoriesReqJSON {
    contextName?: string;
    namespace?: string;
}



const ListImageRepositoriesReqToJSON = (m: ListImageRepositoriesReq): ListImageRepositoriesReqJSON => {
	if (m === null) {
		return null;
	}
	
    return {
        contextName: m.contextname,
        namespace: m.namespace,
    };
};


export interface ListImageRepositoriesRes {
    imageRepositories?: ImageRepository[];
}

interface ListImageRepositoriesResJSON {
    image_repositories?: ImageRepositoryJSON[];
}



const JSONToListImageRepositoriesRes = (m: ListImageRepositoriesRes | ListImageRepositoriesResJSON): ListImageRepositoriesRes => {
    if (m === null) {
		return null;
	}
    return {
        imageRepositories: ((((m as ListImageRepositoriesRes).imageRepositories) ? (m as ListImageRepositoriesRes).imageRepositories : (m as ListImageRepositoriesResJSON).image_repositories) as (ImageRepository | ImageRepositoryJSON)[]).map(JSONToImageRepository),
    };
};


export interface SyncImageRepositoryReq {
    contextname?: string;
    namespace?: string;
    imagerepositoryname?: string;
}

interface SyncImageRepositoryReqJSON {
    contextName?: string;
    namespace?: string;
    imageRepositoryName?: string;
}



const SyncImageRepositoryReqToJSON = (m: SyncImageRepositoryReq): SyncImageRepositoryReqJSON => {
	if (m === null) {
		return null;
	}
	
    return {
        contextName: m.contextname,
        namespace: m.namespace,
        imageRepositoryName: m.imagerepositoryname,
    };
};


export interface SyncImageRepositoryRes {
    imagerepository?: ImageRepository;
}

interface SyncImageRepositoryResJSON {
    imagerepository?: ImageRepositoryJSON;
}



const JSONToSyncImageRepositoryRes = (m: SyncImageRepositoryRes | SyncImageRepositoryResJSON): SyncImageRepositoryRes => {
    if (m === null) {
		return null;
	}
    return {
        imagerepository: JSONToImageRepository(m.imagerepository),
    };
};


export interface ImageUpdateAutomation {
    name?: string;
    namespace?: string;
    sourceref?: string;
    conditions?: Condition[];
    interval?: string;
    updatepath?: string;
    updatestrategy?: string;
    suspend?: boolean;
    reconcilerequestat?: string;
    reconcileat?: string;
    sourcerefkind?: Type;
    lastautomationruntime?: number;
    lastpushcommit?: string;
    lastpushtime?: number;
}

interface ImageUpdateAutomationJSON {
    name?: string;
    namespace?: string;
    sourceRef?: string;
    conditions?: ConditionJSON[];
    interval?: string;
    updatePath?: string;
    updateStrategy?: string;
    suspend?: boolean;
    reconcileRequestAt?: string;
    reconcileAt?: string;
    sourceRefKind?: Type;
    lastAutomationRunTime?: number;
    lastPushCommit?: string;
    lastPushTime?: number;
}



const JSONToImageUpdateAutomation = (m: ImageUpdateAutomation | ImageUpdateAutomationJSON): ImageUpdateAutomation => {
    if (m === null) {
		return null;
	}
    return {
        name: m.name,
        namespace: m.namespace,
        sourceref: (((m as ImageUpdateAutomation).sourceref) ? (m as ImageUpdateAutomation).sourceref : (m as ImageUpdateAutomationJSON).sourceRef),
        conditions: (m.conditions as (Condition | ConditionJSON)[]).map(JSONToCondition),
        interval: m.interval,
        updatepath: (((m as ImageUpdateAutomation).updatepath) ? (m as ImageUpdateAutomation).updatepath : (m as ImageUpdateAutomationJSON).updatePath),
        updatestrategy: (((m as ImageUpdateAutomation).updatestrategy) ? (m as ImageUpdateAutomation).updatestrategy : (m as ImageUpdateAutomationJSON).updateStrategy),
        suspend: m.suspend,
        reconcilerequestat: (((m as ImageUpdateAutomation).reconcilerequestat) ? (m as ImageUpdateAutomation).reconcilerequestat : (m as ImageUpdateAutomationJSON).reconcileRequestAt),
        reconcileat: (((m as ImageUpdateAutomation).reconcileat) ? (m as ImageUpdateAutomation).reconcileat : (m as ImageUpdateAutomationJSON).reconcileAt),
        sourcerefkind: (((m as ImageUpdateAutomation).sourcerefkind) ? (m as ImageUpdateAutomation).sourcerefkind : (m as ImageUpdateAutomationJSON).sourceRefKind),
        lastautomationruntime: (((m as ImageUpdateAutomation).lastautomationruntime) ? (m as ImageUpdateAutomation).lastautomationruntime : (m as ImageUpdateAutomationJSON).lastAutomationRunTime),
        lastpushcommit: (((m as ImageUpdateAutomation).lastpushcommit) ? (m as ImageUpdateAutomation).lastpushcommit : (m as ImageUpdateAutomationJSON).lastPushCommit),
        lastpushtime: (((m as ImageUpdateAutomation).lastpushtime) ? (m as ImageUpdateAutomation).lastpushtime : (m as ImageUpdateAutomationJSON).lastPushTime),
    };
};


export interface ListImageUpdateAutomationsReq {
    contextname?: string;
    namespace?: string;
}

interface ListImageUpdateAutomationsReqJSON {
    contextName?: string;
    namespace?: string;
}



const ListImageUpdateAutomationsReqToJSON = (m: ListImageUpdateAutomationsReq): ListImageUpdateAutomationsReqJSON => {
	if (m === null) {
		return null;
	}
	
    return {
        contextName: m.contextname,
        namespace: m.namespace,
    };
};


export interface ListImageUpdateAutomationsRes {
    imageUpdateAutomations?: ImageUpdateAutomation[];
}

interface ListImageUpdateAutomationsResJSON {
    image_update_automations?: ImageUpdateAutomationJSON[];
}



const JSONToListImageUpdateAutomationsRes = (m: ListImageUpdateAutomationsRes | ListImageUpdateAutomationsResJSON): ListImageUpdateAutomationsRes => {
    if (m === null) {
		return null;
	}
    return {
        imageUpdateAutomations: ((((m as ListImageUpdateAutomationsRes).imageUpdateAutomations) ? (m as ListImageUpdateAutomationsRes).imageUpdateAutomations : (m as ListImageUpdateAutomationsResJSON).image_update_automations) as (ImageUpdateAutomation | ImageUpdateAutomationJSON)[]).map(JSONToImageUpdateAutomation),
    };
};


export interface SyncImageUpdateAutomationReq {
    contextname?: string;
    namespace?: string;
    imageupdateautomationname?: string;
}

interface SyncImageUpdateAutomationReqJSON {
    contextName?: string;
    namespace?: string;
    imageUpdateAutomationName?: string;
}



const SyncImageUpdateAutomationReqToJSON = (m: SyncImageUpdateAutomationReq): SyncImageUpdateAutomationReqJSON => {
	if (m === null) {
		return null;
	}
	
    return {
        contextName: m.contextname,
        namespace: m.namespace,
        imageUpdateAutomationName: m.imageupdateautomationname,
    };
};


export interface SyncImageUpdateAutomationRes {
    imageupdateautomation?: ImageUpdateAutomation;
}

interface SyncImageUpdateAutomationResJSON {
    imageupdateautomation?: ImageUpdateAutomationJSON;
}



const JSONToSyncImageUpdateAutomationRes = (m: SyncImageUpdateAutomationRes | SyncImageUpdateAutomationResJSON): SyncImageUpdateAutomationRes => {
    if (m === null) {
		return null;
	}
    return {
        imageupdateautomation: JSONToImageUpdateAutomation(m.imageupdateautomation),
    };
};


export interface Alert {
    name?: string;
    namespace?: string;
    providerref?: string;
    eventseverity?: string;
    eventsources?: CrossNamespaceObjectReference[];
    exclusionlist?: string[];
    summary?: string;
    suspend?: boolean;
    conditions?: Condition[];
}

interface AlertJSON {
    name?: string;
    namespace?: string;
    providerRef?: string;
    eventSeverity?: string;
    eventSources?: CrossNamespaceObjectReferenceJSON[];
    exclusionList?: string[];
    summary?: string;
    suspend?: boolean;
    conditions?: ConditionJSON[];
}



const JSONToAlert = (m: Alert | AlertJSON): Alert => {
    if (m === null) {
		return null;
	}
    return {
        name: m.name,
        namespace: m.namespace,
        providerref: (((m as Alert).providerref) ? (m as Alert).providerref : (m as AlertJSON).providerRef),
        eventseverity: (((m as Alert).eventseverity) ? (m as Alert).eventseverity : (m as AlertJSON).eventSeverity),
        eventsources: ((((m as Alert).eventsources) ? (m as Alert).eventsources : (m as AlertJSON).eventSources) as (CrossNamespaceObjectReference | CrossNamespaceObjectReferenceJSON)[]).map(JSONToCrossNamespaceObjectReference),
        exclusionlist: (((m as Alert).exclusionlist) ? (m as Alert).exclusionlist : (m as AlertJSON).exclusionList),
        summary: m.summary,
        suspend: m.suspend,
        conditions: (m.conditions as (Condition | ConditionJSON)[]).map(JSONToCondition),
    };
};


export interface ListAlertsReq {
    contextname?: string;
    namespace?: string;
}

interface ListAlertsReqJSON {
    contextName?: string;
    namespace?: string;
}



const ListAlertsReqToJSON = (m: ListAlertsReq): ListAlertsReqJSON => {
	if (m === null) {
		return null;
	}
	
    return {
        contextName: m.contextname,
        namespace: m.namespace,
    };
};


export interface ListAlertsRes {
    alerts?: Alert[];
}

interface ListAlertsResJSON {
    alerts?: AlertJSON[];
}



const JSONToListAlertsRes = (m: ListAlertsRes | ListAlertsResJSON): ListAlertsRes => {
    if (m === null) {
		return null;
	}
    return {
        alerts: (m.alerts as (Alert | AlertJSON)[]).map(JSONToAlert),
    };
};


export interface Provider {
    name?: string;
    namespace?: string;
    type?: string;
    channel?: string;
    username?: string;
    address?: string;
    proxy?: string;
    secretref?: string;
    certsecretref?: string;
    conditions?: Condition[];
}

interface ProviderJSON {
    name?: string;
    namespace?: string;
    type?: string;
    channel?: string;
    username?: string;
    address?: string;
    proxy?: string;
    secretRef?: string;
    certSecretRef?: string;
    conditions?: ConditionJSON[];
}



const JSONToProvider = (m: Provider | ProviderJSON): Provider => {
    if (m === null) {
		return null;
	}
    return {
        name: m.name,
        namespace: m.namespace,
        type: m.type,
        channel: m.channel,
        username: m.username,
        address: m.address,
        proxy: m.proxy,
        secretref: (((m as Provider).secretref) ? (m as Provider).secretref : (m as ProviderJSON).secretRef),
        certsecretref: (((m as Provider).certsecretref) ? (m as Provider).certsecretref : (m as ProviderJSON).certSecretRef),
        conditions: (m.conditions as (Condition | ConditionJSON)[]).map(JSONToCondition),
    };
};


export interface ListProvidersReq {
    contextname?: string;
    namespace?: string;
}

interface ListProvidersReqJSON {
    contextName?: string;
    namespace?: string;
}



const ListProvidersReqToJSON = (m: ListProvidersReq): ListProvidersReqJSON => {
	if (m === null) {
		return null;
	}
	
    return {
        contextName: m.contextname,
        namespace: m.namespace,
    };
};


export interface ListProvidersRes {
    providers?: Provider[];
}

interface ListProvidersResJSON {
    providers?: ProviderJSON[];
}



const JSONToListProvidersRes = (m: ListProvidersRes | ListProvidersResJSON): ListProvidersRes => {
    if (m === null) {
		return null;
	}
    return {
        providers: (m.providers as (Provider | ProviderJSON)[]).map(JSONToProvider),
    };
};


export interface Receiver {
    name?: string;
    namespace?: string;
    type?: string;
    events?: string[];
    resources?: CrossNamespaceObjectReference[];
    secretref?: string;
    suspend?: boolean;
    url?: string;
    conditions?: Condition[];
}

interface ReceiverJSON {
    name?: string;
    namespace?: string;
    type?: string;
    events?: string[];
    resources?: CrossNamespaceObjectReferenceJSON[];
    secretRef?: string;
    suspend?: boolean;
    url?: string;
    conditions?: ConditionJSON[];
}



const JSONToReceiver = (m: Receiver | ReceiverJSON): Receiver => {
    if (m === null) {
		return null;
	}
    return {
        name: m.name,
        namespace: m.namespace,
        type: m.type,
        events: m.events,
        resources: (m.resources as (CrossNamespaceObjectReference | CrossNamespaceObjectReferenceJSON)[]).map(JSONToCrossNamespaceObjectReference),
        secretref: (((m as Receiver).secretref) ? (m as Receiver).secretref : (m as ReceiverJSON).secretRef),
        suspend: m.suspend,
        url: m.url,
        conditions: (m.conditions as (Condition | ConditionJSON)[]).map(JSONToCondition),
    };
};


export interface ListReceiversReq {
    contextname?: string;
    namespace?: string;
}

interface ListReceiversReqJSON {
    contextName?: string;
    namespace?: string;
}



const ListReceiversReqToJSON = (m: ListReceiversReq): ListReceiversReqJSON => {
	if (m === null) {
		return null;
	}
	
    return {
        contextName: m.contextname,
        namespace: m.namespace,
    };
};


export interface ListReceiversRes {
    receivers?: Receiver[];
}

interface ListReceiversResJSON {
    receivers?: ReceiverJSON[];
}



const JSONToListReceiversRes = (m: ListReceiversRes | ListReceiversResJSON): ListReceiversRes => {
    if (m === null) {
		return null;
	}
    return {
        receivers: (m.receivers as (Receiver | ReceiverJSON)[]).map(JSONToReceiver),
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


export interface PodTemplate {
    containers?: Container[];
}

interface PodTemplateJSON {
    containers?: ContainerJSON[];
}


export interface Workload {
    name?: string;
    namespace?: string;
    kustomizationrefname?: string;
    kustomizationrefnamespace?: string;
    podtemplate?: PodTemplate;
}

interface WorkloadJSON {
    name?: string;
    namespace?: string;
    kustomizationRefName?: string;
    kustomizationRefNamespace?: string;
    podTemplate?: PodTemplateJSON;
}


export interface ListWorkloadsReq {
    contextname?: string;
    namespace?: string;
}

interface ListWorkloadsReqJSON {
    contextName?: string;
    namespace?: string;
}


export interface ListWorkloadsRes {
    workloads?: Workload[];
}

interface ListWorkloadsResJSON {
    workloads?: WorkloadJSON[];
}


export interface ListKustomizationChildrenReq {
    contextname?: string;
    kustomizationname?: string;
    kustomizationnamespace?: string;
}

interface ListKustomizationChildrenReqJSON {
    contextName?: string;
    kustomizationName?: string;
    KustomizationNamespace?: string;
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
    contextname?: string;
    namespace?: string;
}

interface ListEventsReqJSON {
    contextName?: string;
    namespace?: string;
}



const ListEventsReqToJSON = (m: ListEventsReq): ListEventsReqJSON => {
	if (m === null) {
		return null;
	}
	
    return {
        contextName: m.contextname,
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


export interface GetReconciledObjectsReq {
    contextname?: string;
    kustomizationname?: string;
    kustomizationnamespace?: string;
    kinds?: GroupVersionKind[];
}

interface GetReconciledObjectsReqJSON {
    contextName?: string;
    kustomizationName?: string;
    kustomizationNamespace?: string;
    kinds?: GroupVersionKindJSON[];
}



const GetReconciledObjectsReqToJSON = (m: GetReconciledObjectsReq): GetReconciledObjectsReqJSON => {
	if (m === null) {
		return null;
	}
	
    return {
        contextName: m.contextname,
        kustomizationName: m.kustomizationname,
        kustomizationNamespace: m.kustomizationnamespace,
        kinds: m.kinds.map(GroupVersionKindToJSON),
    };
};


export interface UnstructuredObject {
    groupversionkind?: GroupVersionKind;
    name?: string;
    namespace?: string;
    uid?: string;
    status?: string;
}

interface UnstructuredObjectJSON {
    groupVersionKind?: GroupVersionKindJSON;
    name?: string;
    namespace?: string;
    uid?: string;
    status?: string;
}



const JSONToUnstructuredObject = (m: UnstructuredObject | UnstructuredObjectJSON): UnstructuredObject => {
    if (m === null) {
		return null;
	}
    return {
        groupversionkind: JSONToGroupVersionKind((((m as UnstructuredObject).groupversionkind) ? (m as UnstructuredObject).groupversionkind : (m as UnstructuredObjectJSON).groupVersionKind)),
        name: m.name,
        namespace: m.namespace,
        uid: m.uid,
        status: m.status,
    };
};


export interface GetReconciledObjectsRes {
    objects?: UnstructuredObject[];
}

interface GetReconciledObjectsResJSON {
    objects?: UnstructuredObjectJSON[];
}



const JSONToGetReconciledObjectsRes = (m: GetReconciledObjectsRes | GetReconciledObjectsResJSON): GetReconciledObjectsRes => {
    if (m === null) {
		return null;
	}
    return {
        objects: (m.objects as (UnstructuredObject | UnstructuredObjectJSON)[]).map(JSONToUnstructuredObject),
    };
};


export interface GetChildObjectsReq {
    contextname?: string;
    groupversionkind?: GroupVersionKind;
    parentuid?: string;
}

interface GetChildObjectsReqJSON {
    contextName?: string;
    groupVersionKind?: GroupVersionKindJSON;
    parentUid?: string;
}



const GetChildObjectsReqToJSON = (m: GetChildObjectsReq): GetChildObjectsReqJSON => {
	if (m === null) {
		return null;
	}
	
    return {
        contextName: m.contextname,
        groupVersionKind: GroupVersionKindToJSON(m.groupversionkind),
        parentUid: m.parentuid,
    };
};


export interface GetChildObjectsRes {
    objects?: UnstructuredObject[];
}

interface GetChildObjectsResJSON {
    objects?: UnstructuredObjectJSON[];
}



const JSONToGetChildObjectsRes = (m: GetChildObjectsRes | GetChildObjectsResJSON): GetChildObjectsRes => {
    if (m === null) {
		return null;
	}
    return {
        objects: (m.objects as (UnstructuredObject | UnstructuredObjectJSON)[]).map(JSONToUnstructuredObject),
    };
};


export interface Clusters {
    listContexts: (listContextsReq: ListContextsReq) => Promise<ListContextsRes>;
    
    listNamespacesForContext: (listNamespacesForContextReq: ListNamespacesForContextReq) => Promise<ListNamespacesForContextRes>;
    
    listKustomizations: (listKustomizationsReq: ListKustomizationsReq) => Promise<ListKustomizationsRes>;
    
    listSources: (listSourcesReq: ListSourcesReq) => Promise<ListSourcesRes>;
    
    syncKustomization: (syncKustomizationReq: SyncKustomizationReq) => Promise<SyncKustomizationRes>;
    
    listHelmReleases: (listHelmReleasesReq: ListHelmReleasesReq) => Promise<ListHelmReleasesRes>;
    
    listEvents: (listEventsReq: ListEventsReq) => Promise<ListEventsRes>;
    
    syncSource: (syncSourceReq: SyncSourceReq) => Promise<SyncSourceRes>;
    
    syncHelmRelease: (syncHelmReleaseReq: SyncHelmReleaseReq) => Promise<SyncHelmReleaseRes>;
    
    listAlerts: (listAlertsReq: ListAlertsReq) => Promise<ListAlertsRes>;
    
    listImagePolicies: (listImagePoliciesReq: ListImagePoliciesReq) => Promise<ListImagePoliciesRes>;
    
    listImageRepositories: (listImageRepositoriesReq: ListImageRepositoriesReq) => Promise<ListImageRepositoriesRes>;
    
    listImageUpdateAutomations: (listImageUpdateAutomationsReq: ListImageUpdateAutomationsReq) => Promise<ListImageUpdateAutomationsRes>;
    
    listProviders: (listProvidersReq: ListProvidersReq) => Promise<ListProvidersRes>;
    
    listReceivers: (listReceiversReq: ListReceiversReq) => Promise<ListReceiversRes>;
    
    syncImageRepository: (syncImageRepositoryReq: SyncImageRepositoryReq) => Promise<SyncImageRepositoryRes>;
    
    syncImageUpdateAutomation: (syncImageUpdateAutomationReq: SyncImageUpdateAutomationReq) => Promise<SyncImageUpdateAutomationRes>;
    
    getReconciledObjects: (getReconciledObjectsReq: GetReconciledObjectsReq) => Promise<GetReconciledObjectsRes>;
    
    getChildObjects: (getChildObjectsReq: GetChildObjectsReq) => Promise<GetChildObjectsRes>;
    
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
    
    syncSource(syncSourceReq: SyncSourceReq): Promise<SyncSourceRes> {
        const url = this.hostname + this.pathPrefix + "SyncSource";
        let body: SyncSourceReq | SyncSourceReqJSON = syncSourceReq;
        if (!this.writeCamelCase) {
            body = SyncSourceReqToJSON(syncSourceReq);
        }
        return this.fetch(createTwirpRequest(url, body, this.headersOverride)).then((resp) => {
            if (!resp.ok) {
                return throwTwirpError(resp);
            }

            return resp.json().then(JSONToSyncSourceRes);
        });
    }
    
    syncHelmRelease(syncHelmReleaseReq: SyncHelmReleaseReq): Promise<SyncHelmReleaseRes> {
        const url = this.hostname + this.pathPrefix + "SyncHelmRelease";
        let body: SyncHelmReleaseReq | SyncHelmReleaseReqJSON = syncHelmReleaseReq;
        if (!this.writeCamelCase) {
            body = SyncHelmReleaseReqToJSON(syncHelmReleaseReq);
        }
        return this.fetch(createTwirpRequest(url, body, this.headersOverride)).then((resp) => {
            if (!resp.ok) {
                return throwTwirpError(resp);
            }

            return resp.json().then(JSONToSyncHelmReleaseRes);
        });
    }
    
    listAlerts(listAlertsReq: ListAlertsReq): Promise<ListAlertsRes> {
        const url = this.hostname + this.pathPrefix + "ListAlerts";
        let body: ListAlertsReq | ListAlertsReqJSON = listAlertsReq;
        if (!this.writeCamelCase) {
            body = ListAlertsReqToJSON(listAlertsReq);
        }
        return this.fetch(createTwirpRequest(url, body, this.headersOverride)).then((resp) => {
            if (!resp.ok) {
                return throwTwirpError(resp);
            }

            return resp.json().then(JSONToListAlertsRes);
        });
    }
    
    listImagePolicies(listImagePoliciesReq: ListImagePoliciesReq): Promise<ListImagePoliciesRes> {
        const url = this.hostname + this.pathPrefix + "ListImagePolicies";
        let body: ListImagePoliciesReq | ListImagePoliciesReqJSON = listImagePoliciesReq;
        if (!this.writeCamelCase) {
            body = ListImagePoliciesReqToJSON(listImagePoliciesReq);
        }
        return this.fetch(createTwirpRequest(url, body, this.headersOverride)).then((resp) => {
            if (!resp.ok) {
                return throwTwirpError(resp);
            }

            return resp.json().then(JSONToListImagePoliciesRes);
        });
    }
    
    listImageRepositories(listImageRepositoriesReq: ListImageRepositoriesReq): Promise<ListImageRepositoriesRes> {
        const url = this.hostname + this.pathPrefix + "ListImageRepositories";
        let body: ListImageRepositoriesReq | ListImageRepositoriesReqJSON = listImageRepositoriesReq;
        if (!this.writeCamelCase) {
            body = ListImageRepositoriesReqToJSON(listImageRepositoriesReq);
        }
        return this.fetch(createTwirpRequest(url, body, this.headersOverride)).then((resp) => {
            if (!resp.ok) {
                return throwTwirpError(resp);
            }

            return resp.json().then(JSONToListImageRepositoriesRes);
        });
    }
    
    listImageUpdateAutomations(listImageUpdateAutomationsReq: ListImageUpdateAutomationsReq): Promise<ListImageUpdateAutomationsRes> {
        const url = this.hostname + this.pathPrefix + "ListImageUpdateAutomations";
        let body: ListImageUpdateAutomationsReq | ListImageUpdateAutomationsReqJSON = listImageUpdateAutomationsReq;
        if (!this.writeCamelCase) {
            body = ListImageUpdateAutomationsReqToJSON(listImageUpdateAutomationsReq);
        }
        return this.fetch(createTwirpRequest(url, body, this.headersOverride)).then((resp) => {
            if (!resp.ok) {
                return throwTwirpError(resp);
            }

            return resp.json().then(JSONToListImageUpdateAutomationsRes);
        });
    }
    
    listProviders(listProvidersReq: ListProvidersReq): Promise<ListProvidersRes> {
        const url = this.hostname + this.pathPrefix + "ListProviders";
        let body: ListProvidersReq | ListProvidersReqJSON = listProvidersReq;
        if (!this.writeCamelCase) {
            body = ListProvidersReqToJSON(listProvidersReq);
        }
        return this.fetch(createTwirpRequest(url, body, this.headersOverride)).then((resp) => {
            if (!resp.ok) {
                return throwTwirpError(resp);
            }

            return resp.json().then(JSONToListProvidersRes);
        });
    }
    
    listReceivers(listReceiversReq: ListReceiversReq): Promise<ListReceiversRes> {
        const url = this.hostname + this.pathPrefix + "ListReceivers";
        let body: ListReceiversReq | ListReceiversReqJSON = listReceiversReq;
        if (!this.writeCamelCase) {
            body = ListReceiversReqToJSON(listReceiversReq);
        }
        return this.fetch(createTwirpRequest(url, body, this.headersOverride)).then((resp) => {
            if (!resp.ok) {
                return throwTwirpError(resp);
            }

            return resp.json().then(JSONToListReceiversRes);
        });
    }
    
    syncImageRepository(syncImageRepositoryReq: SyncImageRepositoryReq): Promise<SyncImageRepositoryRes> {
        const url = this.hostname + this.pathPrefix + "SyncImageRepository";
        let body: SyncImageRepositoryReq | SyncImageRepositoryReqJSON = syncImageRepositoryReq;
        if (!this.writeCamelCase) {
            body = SyncImageRepositoryReqToJSON(syncImageRepositoryReq);
        }
        return this.fetch(createTwirpRequest(url, body, this.headersOverride)).then((resp) => {
            if (!resp.ok) {
                return throwTwirpError(resp);
            }

            return resp.json().then(JSONToSyncImageRepositoryRes);
        });
    }
    
    syncImageUpdateAutomation(syncImageUpdateAutomationReq: SyncImageUpdateAutomationReq): Promise<SyncImageUpdateAutomationRes> {
        const url = this.hostname + this.pathPrefix + "SyncImageUpdateAutomation";
        let body: SyncImageUpdateAutomationReq | SyncImageUpdateAutomationReqJSON = syncImageUpdateAutomationReq;
        if (!this.writeCamelCase) {
            body = SyncImageUpdateAutomationReqToJSON(syncImageUpdateAutomationReq);
        }
        return this.fetch(createTwirpRequest(url, body, this.headersOverride)).then((resp) => {
            if (!resp.ok) {
                return throwTwirpError(resp);
            }

            return resp.json().then(JSONToSyncImageUpdateAutomationRes);
        });
    }
    
    getReconciledObjects(getReconciledObjectsReq: GetReconciledObjectsReq): Promise<GetReconciledObjectsRes> {
        const url = this.hostname + this.pathPrefix + "GetReconciledObjects";
        let body: GetReconciledObjectsReq | GetReconciledObjectsReqJSON = getReconciledObjectsReq;
        if (!this.writeCamelCase) {
            body = GetReconciledObjectsReqToJSON(getReconciledObjectsReq);
        }
        return this.fetch(createTwirpRequest(url, body, this.headersOverride)).then((resp) => {
            if (!resp.ok) {
                return throwTwirpError(resp);
            }

            return resp.json().then(JSONToGetReconciledObjectsRes);
        });
    }
    
    getChildObjects(getChildObjectsReq: GetChildObjectsReq): Promise<GetChildObjectsRes> {
        const url = this.hostname + this.pathPrefix + "GetChildObjects";
        let body: GetChildObjectsReq | GetChildObjectsReqJSON = getChildObjectsReq;
        if (!this.writeCamelCase) {
            body = GetChildObjectsReqToJSON(getChildObjectsReq);
        }
        return this.fetch(createTwirpRequest(url, body, this.headersOverride)).then((resp) => {
            if (!resp.ok) {
                return throwTwirpError(resp);
            }

            return resp.json().then(JSONToGetChildObjectsRes);
        });
    }
    
}

