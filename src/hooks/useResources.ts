import { getExamIndex } from "_api/dicom";
import { getDicomList } from "_api/resources";

export default () => {
  const _getDicomList = async () => {
    const res = await getExamIndex();
  };

  return {
    getDicomList: _getDicomList,
  };
};
