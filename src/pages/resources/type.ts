import { ImgI, PdfI, ExamSortKeyE } from "_types/resources";

export interface ResourcesStateI {
  sortType: ExamSortKeyE; // 排序规则
  isSelectable: boolean; // 是否是可选择的
  page: number; // 当前在第几页 从1开始
  selections: string[]; //当前已选择的dicom id 集
  redirectUpload: boolean; // 是否重定向到upload页
  parsing: number; // 剩余解析量
  showNotify: boolean; // 是否显示提示
  poll: boolean; // 是否开启轮询
  pageSize: number; // 每页展示的数量
  pdfList: PdfI[]; // pdf列表
  imgList: ImgI[]; // pdf列表
}
