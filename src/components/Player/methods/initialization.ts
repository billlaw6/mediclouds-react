/**
 * 播放器的初始化操作
 *
 */

import { getCollection, setDataToCollection } from "../helpers";
import { CollectionI, CollectionMapT, DataMapT, PlayerExamPropsI } from "../types";
import cacheDicoms from "./cacheDicoms";
import fetchSeriesList from "./fetchSeriesList";

interface InitPropsI {
  cs: any; // cornerstone
  csImgLoader: any; // cornerstone img Loader
  exams: PlayerExamPropsI[];
}

export default async (props: InitPropsI): Promise<CollectionMapT> => {
  const { cs, csImgLoader, exams } = props;
  if (!cs || !exams) throw new Error("must have both of cornerstone and exams.");

  const seriesListRes = await fetchSeriesList(exams);
  const collectionMap: CollectionMapT = new Map();
  const cacheArr: (Promise<any> | undefined)[] = [];

  exams.forEach((exam, examIndex) => {
    const { id, active, defaultSeriesId, defaultFrame = 0 } = exam;
    const currentSeriesList = seriesListRes[examIndex];
    const { children, ...patientInfo } = currentSeriesList;
    const seriesIndex = Math.max(
      0,
      children.findIndex((item) => item.id === defaultSeriesId),
    );
    const dataMap: DataMapT = new Map();

    children.forEach((item, seriesIndex) => {
      dataMap.set(
        seriesIndex,
        Object.assign({}, item, {
          frame: defaultFrame,
          examIndex,
          seriesIndex,
        }),
      );
    });

    const collection: CollectionI = {
      examId: id,
      active,
      dataMap,
      seriesIndex,
      patientInfo,
    };
    collectionMap.set(examIndex, collection);

    if (active) {
      const currentDicomUrls = children[seriesIndex].dicoms;
      cacheArr.push(cacheDicoms(currentDicomUrls, cs, csImgLoader));
    } else {
      cacheArr.push(undefined);
    }
  });

  const cachedArr = await Promise.all(cacheArr);

  exams.forEach((_item, examIndex) => {
    const collection = getCollection(collectionMap, examIndex);
    if (collection && cachedArr[examIndex])
      setDataToCollection(collectionMap, examIndex, collection.seriesIndex, {
        cache: cachedArr[examIndex],
      });
  });

  return collectionMap;
};
