import _ from "lodash";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../components/AppStateProvider";
import {
  ImageRepository,
  UnstructuredObject,
} from "../rpc/clusters";
import { notifyError, notifySuccess } from "../util";
import { formatAPINamespace } from "./app";

type ImageRepositoryList = { [name: string]: ImageRepository };

export type UnstructuredObjectWithParent = UnstructuredObject & {
  parentUid?: string;
};

export function useImageRepositories(
  currentContext: string,
  currentNamespace: string
) {
  const [loading, setLoading] = useState(true);
  const { doAsyncError, clustersClient } = useContext(AppContext);
  const [imageRepositories, setImageRepositories] = useState({} as ImageRepositoryList);

  useEffect(() => {
    if (!currentContext) {
      return;
    }

    setLoading(true);
    setImageRepositories({});

    clustersClient
      .listImageRepositories({
        contextname: currentContext,
        namespace: formatAPINamespace(currentNamespace),
      })
      .then((res) => {
        const r = _.keyBy(res.imageRepositories, "name");
        setImageRepositories(r);
      })
      .catch((err) => {
        doAsyncError(
          "There was an error fetching imageRepositories",
          true,
          err.message
        );
      })
      .finally(() => setLoading(false));
  }, [currentContext, currentNamespace]);

  const syncImageRepository = (ir: ImageRepository) =>
    clustersClient
      .syncImageRepository({
        contextname: currentContext,
        namespace: ir.namespace,
        imagerepositoryname: ir.name,
      })
      .then(() => {
        setImageRepositories({
          ...imageRepositories,
          [ir.name]: ir,
        });
        notifySuccess("Sync successful");
      })
      .catch((err) => notifyError(err.message));

  return {
    imageRepositories,
    syncImageRepository,
    loading,
  };
}
