import axios from "./api";

export const getExamIndex = async (params: any) => {
  const res = await axios.get(`/dicom/exam-index/`, { params: params });
  return res;
};

export const deleteExamIndex = async (params: string[]) => {
  const res = await axios.post(`/dicom/exam-index/del/`, { params: params });
  return res;
};

export const getExamIndexDetail = async (params: any) => {
  const res = await axios.get(`/dicom/exam-index/${params.id}`, { params: params });
  return res;
};

export const getDicomSeries = async (params: any) => {
  const res = await axios.get(`/dicom/dicom-series/`, { params: params });
  return res;
};

export const getDicomSeriesDetail = async (params: any) => {
  const res = await axios.get(`/dicom/dicom-series/${params.id}`);
  return res;
};

export const getDicomSeriesMprDetail = async (params: { id: string }) => {
  const res = await axios.get(`/dicom/dicom-series/mpr/${params.id}`);
  return res;
};

export const getDicomPicture = async (params: any) => {
  const res = await axios.get(`/dicom/dicom-picture/`, { params: params });
  return res;
};

export const getDicomPictureDetail = async (params: any) => {
  const res = await axios.get(`/dicom/dicom-picture/${params.id}`, { params: params });
  return res;
};

export const searchDicomInfo = async (params: any) => {
  const res = await axios.get(`/dicom/search/`, { params: params });
  return res;
};

export const uploadDicomFile = async (params: any) => {
  const res = await axios.post(`/dicom/upload/`, params);
  return res;
};

export const searchDicomFile = async (params: any) => {
  const res = await axios.get(`/dicom/dicom-file/`, { params: params });
  return res;
};
