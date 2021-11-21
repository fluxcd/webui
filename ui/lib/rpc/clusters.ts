import { createTwirpRequest, throwTwirpError, Fetch } from "./twirp";

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

export interface ListContextsReq {}

interface ListContextsReqJSON {}

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

const JSONToListContextsRes = (
  m: ListContextsRes | ListContextsResJSON
): ListContextsRes => {
  if (m === null) {
    return null;
  }
  return {
    currentcontext: (m as ListContextsRes).currentcontext
      ? (m as ListContextsRes).currentcontext
      : (m as ListContextsResJSON).currentContext,
    contexts: (m.contexts as (Context | ContextJSON)[]).map(JSONToContext),
  };
};

export interface ListNamespacesForContextReq {
  contextname?: string;
}

interface ListNamespacesForContextReqJSON {
  contextName?: string;
}

const ListNamespacesForContextReqToJSON = (
  m: ListNamespacesForContextReq
): ListNamespacesForContextReqJSON => {
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

const JSONToListNamespacesForContextRes = (
  m: ListNamespacesForContextRes | ListNamespacesForContextResJSON
): ListNamespacesForContextRes => {
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

const JSONToGroupVersionKind = (
  m: GroupVersionKind | GroupVersionKindJSON
): GroupVersionKind => {
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

const JSONToSnapshotEntry = (
  m: SnapshotEntry | SnapshotEntryJSON
): SnapshotEntry => {
  if (m === null) {
    return null;
  }
  return {
    namespace: m.namespace,
    kinds: (m.kinds as (GroupVersionKind | GroupVersionKindJSON)[]).map(
      JSONToGroupVersionKind
    ),
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
  sourcerefkind?: string;
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
  sourceRefKind?: string;
  snapshots?: SnapshotEntryJSON[];
  lastAppliedRevision?: string;
  lastAttemptedRevision?: string;
}

const JSONToKustomization = (
  m: Kustomization | KustomizationJSON
): Kustomization => {
  if (m === null) {
    return null;
  }
  return {
    name: m.name,
    namespace: m.namespace,
    targetnamespace: (m as Kustomization).targetnamespace
      ? (m as Kustomization).targetnamespace
      : (m as KustomizationJSON).targetNamespace,
    path: m.path,
    sourceref: (m as Kustomization).sourceref
      ? (m as Kustomization).sourceref
      : (m as KustomizationJSON).sourceRef,
    conditions: (m.conditions as (Condition | ConditionJSON)[]).map(
      JSONToCondition
    ),
    interval: m.interval,
    prune: m.prune,
    reconcilerequestat: (m as Kustomization).reconcilerequestat
      ? (m as Kustomization).reconcilerequestat
      : (m as KustomizationJSON).reconcileRequestAt,
    reconcileat: (m as Kustomization).reconcileat
      ? (m as Kustomization).reconcileat
      : (m as KustomizationJSON).reconcileAt,
    sourcerefkind: (m as Kustomization).sourcerefkind
      ? (m as Kustomization).sourcerefkind
      : (m as KustomizationJSON).sourceRefKind,
    snapshots: (m.snapshots as (SnapshotEntry | SnapshotEntryJSON)[]).map(
      JSONToSnapshotEntry
    ),
    lastappliedrevision: (m as Kustomization).lastappliedrevision
      ? (m as Kustomization).lastappliedrevision
      : (m as KustomizationJSON).lastAppliedRevision,
    lastattemptedrevision: (m as Kustomization).lastattemptedrevision
      ? (m as Kustomization).lastattemptedrevision
      : (m as KustomizationJSON).lastAttemptedRevision,
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

const ListKustomizationsReqToJSON = (
  m: ListKustomizationsReq
): ListKustomizationsReqJSON => {
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

const JSONToListKustomizationsRes = (
  m: ListKustomizationsRes | ListKustomizationsResJSON
): ListKustomizationsRes => {
  if (m === null) {
    return null;
  }
  return {
    kustomizations: (
      m.kustomizations as (Kustomization | KustomizationJSON)[]
    ).map(JSONToKustomization),
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

const JSONToGitRepositoryRef = (
  m: GitRepositoryRef | GitRepositoryRefJSON
): GitRepositoryRef => {
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
  type?: string;
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
  type?: string;
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
    secretrefname: (m as Source).secretrefname
      ? (m as Source).secretrefname
      : (m as SourceJSON).secretRefName,
    conditions: (m.conditions as (Condition | ConditionJSON)[]).map(
      JSONToCondition
    ),
    artifact: JSONToArtifact(m.artifact),
  };
};

export interface ListSourcesReq {
  contextname?: string;
  namespace?: string;
  sourcetype?: string;
}

interface ListSourcesReqJSON {
  contextName?: string;
  namespace?: string;
  sourceType?: string;
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

const JSONToListSourcesRes = (
  m: ListSourcesRes | ListSourcesResJSON
): ListSourcesRes => {
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
  sourcetype?: string;
}

interface SyncSourceReqJSON {
  contextName?: string;
  namespace?: string;
  sourceName?: string;
  sourceType?: string;
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

const JSONToSyncSourceRes = (
  m: SyncSourceRes | SyncSourceResJSON
): SyncSourceRes => {
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

const SyncKustomizationReqToJSON = (
  m: SyncKustomizationReq
): SyncKustomizationReqJSON => {
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

const JSONToSyncKustomizationRes = (
  m: SyncKustomizationRes | SyncKustomizationResJSON
): SyncKustomizationRes => {
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
    chartname: (m as HelmRelease).chartname
      ? (m as HelmRelease).chartname
      : (m as HelmReleaseJSON).chartName,
    version: m.version,
    sourcekind: (m as HelmRelease).sourcekind
      ? (m as HelmRelease).sourcekind
      : (m as HelmReleaseJSON).sourceKind,
    sourcename: (m as HelmRelease).sourcename
      ? (m as HelmRelease).sourcename
      : (m as HelmReleaseJSON).sourceName,
    sourcenamespace: (m as HelmRelease).sourcenamespace
      ? (m as HelmRelease).sourcenamespace
      : (m as HelmReleaseJSON).sourceNamespace,
    conditions: (m.conditions as (Condition | ConditionJSON)[]).map(
      JSONToCondition
    ),
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

const ListHelmReleasesReqToJSON = (
  m: ListHelmReleasesReq
): ListHelmReleasesReqJSON => {
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

const JSONToListHelmReleasesRes = (
  m: ListHelmReleasesRes | ListHelmReleasesResJSON
): ListHelmReleasesRes => {
  if (m === null) {
    return null;
  }
  return {
    helmReleases: (
      ((m as ListHelmReleasesRes).helmReleases
        ? (m as ListHelmReleasesRes).helmReleases
        : (m as ListHelmReleasesResJSON).helm_releases) as (
        | HelmRelease
        | HelmReleaseJSON
      )[]
    ).map(JSONToHelmRelease),
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

const SyncHelmReleaseReqToJSON = (
  m: SyncHelmReleaseReq
): SyncHelmReleaseReqJSON => {
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

const JSONToSyncHelmReleaseRes = (
  m: SyncHelmReleaseRes | SyncHelmReleaseResJSON
): SyncHelmReleaseRes => {
  if (m === null) {
    return null;
  }
  return {
    helmrelease: JSONToHelmRelease(m.helmrelease),
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

const JSONToListEventsRes = (
  m: ListEventsRes | ListEventsResJSON
): ListEventsRes => {
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

const GetReconciledObjectsReqToJSON = (
  m: GetReconciledObjectsReq
): GetReconciledObjectsReqJSON => {
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

const JSONToUnstructuredObject = (
  m: UnstructuredObject | UnstructuredObjectJSON
): UnstructuredObject => {
  if (m === null) {
    return null;
  }
  return {
    groupversionkind: JSONToGroupVersionKind(
      (m as UnstructuredObject).groupversionkind
        ? (m as UnstructuredObject).groupversionkind
        : (m as UnstructuredObjectJSON).groupVersionKind
    ),
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

const JSONToGetReconciledObjectsRes = (
  m: GetReconciledObjectsRes | GetReconciledObjectsResJSON
): GetReconciledObjectsRes => {
  if (m === null) {
    return null;
  }
  return {
    objects: (m.objects as (UnstructuredObject | UnstructuredObjectJSON)[]).map(
      JSONToUnstructuredObject
    ),
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

const GetChildObjectsReqToJSON = (
  m: GetChildObjectsReq
): GetChildObjectsReqJSON => {
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

const JSONToGetChildObjectsRes = (
  m: GetChildObjectsRes | GetChildObjectsResJSON
): GetChildObjectsRes => {
  if (m === null) {
    return null;
  }
  return {
    objects: (m.objects as (UnstructuredObject | UnstructuredObjectJSON)[]).map(
      JSONToUnstructuredObject
    ),
  };
};

export interface Clusters {
  listContexts: (listContextsReq: ListContextsReq) => Promise<ListContextsRes>;

  listNamespacesForContext: (
    listNamespacesForContextReq: ListNamespacesForContextReq
  ) => Promise<ListNamespacesForContextRes>;

  listKustomizations: (
    listKustomizationsReq: ListKustomizationsReq
  ) => Promise<ListKustomizationsRes>;

  listSources: (listSourcesReq: ListSourcesReq) => Promise<ListSourcesRes>;

  syncKustomization: (
    syncKustomizationReq: SyncKustomizationReq
  ) => Promise<SyncKustomizationRes>;

  listHelmReleases: (
    listHelmReleasesReq: ListHelmReleasesReq
  ) => Promise<ListHelmReleasesRes>;

  listEvents: (listEventsReq: ListEventsReq) => Promise<ListEventsRes>;

  syncSource: (syncSourceReq: SyncSourceReq) => Promise<SyncSourceRes>;

  syncHelmRelease: (
    syncHelmReleaseReq: SyncHelmReleaseReq
  ) => Promise<SyncHelmReleaseRes>;

  getReconciledObjects: (
    getReconciledObjectsReq: GetReconciledObjectsReq
  ) => Promise<GetReconciledObjectsRes>;

  getChildObjects: (
    getChildObjectsReq: GetChildObjectsReq
  ) => Promise<GetChildObjectsRes>;
}

export class DefaultClusters implements Clusters {
  private hostname: string;
  private fetch: Fetch;
  private writeCamelCase: boolean;
  private pathPrefix = "/twirp/clusters.Clusters/";
  private headersOverride: HeadersInit;

  constructor(
    hostname: string,
    fetch: Fetch,
    writeCamelCase = false,
    headersOverride: HeadersInit = {}
  ) {
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
    return this.fetch(createTwirpRequest(url, body, this.headersOverride)).then(
      (resp) => {
        if (!resp.ok) {
          return throwTwirpError(resp);
        }

        return resp.json().then(JSONToListContextsRes);
      }
    );
  }

  listNamespacesForContext(
    listNamespacesForContextReq: ListNamespacesForContextReq
  ): Promise<ListNamespacesForContextRes> {
    const url = this.hostname + this.pathPrefix + "ListNamespacesForContext";
    let body: ListNamespacesForContextReq | ListNamespacesForContextReqJSON =
      listNamespacesForContextReq;
    if (!this.writeCamelCase) {
      body = ListNamespacesForContextReqToJSON(listNamespacesForContextReq);
    }
    return this.fetch(createTwirpRequest(url, body, this.headersOverride)).then(
      (resp) => {
        if (!resp.ok) {
          return throwTwirpError(resp);
        }

        return resp.json().then(JSONToListNamespacesForContextRes);
      }
    );
  }

  listKustomizations(
    listKustomizationsReq: ListKustomizationsReq
  ): Promise<ListKustomizationsRes> {
    const url = this.hostname + this.pathPrefix + "ListKustomizations";
    let body: ListKustomizationsReq | ListKustomizationsReqJSON =
      listKustomizationsReq;
    if (!this.writeCamelCase) {
      body = ListKustomizationsReqToJSON(listKustomizationsReq);
    }
    return this.fetch(createTwirpRequest(url, body, this.headersOverride)).then(
      (resp) => {
        if (!resp.ok) {
          return throwTwirpError(resp);
        }

        return resp.json().then(JSONToListKustomizationsRes);
      }
    );
  }

  listSources(listSourcesReq: ListSourcesReq): Promise<ListSourcesRes> {
    const url = this.hostname + this.pathPrefix + "ListSources";
    let body: ListSourcesReq | ListSourcesReqJSON = listSourcesReq;
    if (!this.writeCamelCase) {
      body = ListSourcesReqToJSON(listSourcesReq);
    }
    return this.fetch(createTwirpRequest(url, body, this.headersOverride)).then(
      (resp) => {
        if (!resp.ok) {
          return throwTwirpError(resp);
        }

        return resp.json().then(JSONToListSourcesRes);
      }
    );
  }

  syncKustomization(
    syncKustomizationReq: SyncKustomizationReq
  ): Promise<SyncKustomizationRes> {
    const url = this.hostname + this.pathPrefix + "SyncKustomization";
    let body: SyncKustomizationReq | SyncKustomizationReqJSON =
      syncKustomizationReq;
    if (!this.writeCamelCase) {
      body = SyncKustomizationReqToJSON(syncKustomizationReq);
    }
    return this.fetch(createTwirpRequest(url, body, this.headersOverride)).then(
      (resp) => {
        if (!resp.ok) {
          return throwTwirpError(resp);
        }

        return resp.json().then(JSONToSyncKustomizationRes);
      }
    );
  }

  listHelmReleases(
    listHelmReleasesReq: ListHelmReleasesReq
  ): Promise<ListHelmReleasesRes> {
    const url = this.hostname + this.pathPrefix + "ListHelmReleases";
    let body: ListHelmReleasesReq | ListHelmReleasesReqJSON =
      listHelmReleasesReq;
    if (!this.writeCamelCase) {
      body = ListHelmReleasesReqToJSON(listHelmReleasesReq);
    }
    return this.fetch(createTwirpRequest(url, body, this.headersOverride)).then(
      (resp) => {
        if (!resp.ok) {
          return throwTwirpError(resp);
        }

        return resp.json().then(JSONToListHelmReleasesRes);
      }
    );
  }

  listEvents(listEventsReq: ListEventsReq): Promise<ListEventsRes> {
    const url = this.hostname + this.pathPrefix + "ListEvents";
    let body: ListEventsReq | ListEventsReqJSON = listEventsReq;
    if (!this.writeCamelCase) {
      body = ListEventsReqToJSON(listEventsReq);
    }
    return this.fetch(createTwirpRequest(url, body, this.headersOverride)).then(
      (resp) => {
        if (!resp.ok) {
          return throwTwirpError(resp);
        }

        return resp.json().then(JSONToListEventsRes);
      }
    );
  }

  syncSource(syncSourceReq: SyncSourceReq): Promise<SyncSourceRes> {
    const url = this.hostname + this.pathPrefix + "SyncSource";
    let body: SyncSourceReq | SyncSourceReqJSON = syncSourceReq;
    if (!this.writeCamelCase) {
      body = SyncSourceReqToJSON(syncSourceReq);
    }
    return this.fetch(createTwirpRequest(url, body, this.headersOverride)).then(
      (resp) => {
        if (!resp.ok) {
          return throwTwirpError(resp);
        }

        return resp.json().then(JSONToSyncSourceRes);
      }
    );
  }

  syncHelmRelease(
    syncHelmReleaseReq: SyncHelmReleaseReq
  ): Promise<SyncHelmReleaseRes> {
    const url = this.hostname + this.pathPrefix + "SyncHelmRelease";
    let body: SyncHelmReleaseReq | SyncHelmReleaseReqJSON = syncHelmReleaseReq;
    if (!this.writeCamelCase) {
      body = SyncHelmReleaseReqToJSON(syncHelmReleaseReq);
    }
    return this.fetch(createTwirpRequest(url, body, this.headersOverride)).then(
      (resp) => {
        if (!resp.ok) {
          return throwTwirpError(resp);
        }

        return resp.json().then(JSONToSyncHelmReleaseRes);
      }
    );
  }

  getReconciledObjects(
    getReconciledObjectsReq: GetReconciledObjectsReq
  ): Promise<GetReconciledObjectsRes> {
    const url = this.hostname + this.pathPrefix + "GetReconciledObjects";
    let body: GetReconciledObjectsReq | GetReconciledObjectsReqJSON =
      getReconciledObjectsReq;
    if (!this.writeCamelCase) {
      body = GetReconciledObjectsReqToJSON(getReconciledObjectsReq);
    }
    return this.fetch(createTwirpRequest(url, body, this.headersOverride)).then(
      (resp) => {
        if (!resp.ok) {
          return throwTwirpError(resp);
        }

        return resp.json().then(JSONToGetReconciledObjectsRes);
      }
    );
  }

  getChildObjects(
    getChildObjectsReq: GetChildObjectsReq
  ): Promise<GetChildObjectsRes> {
    const url = this.hostname + this.pathPrefix + "GetChildObjects";
    let body: GetChildObjectsReq | GetChildObjectsReqJSON = getChildObjectsReq;
    if (!this.writeCamelCase) {
      body = GetChildObjectsReqToJSON(getChildObjectsReq);
    }
    return this.fetch(createTwirpRequest(url, body, this.headersOverride)).then(
      (resp) => {
        if (!resp.ok) {
          return throwTwirpError(resp);
        }

        return resp.json().then(JSONToGetChildObjectsRes);
      }
    );
  }
}
