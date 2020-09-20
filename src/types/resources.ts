export enum ResourcesActionE {
  GET_EXAM_LIST = "get_exam_list", // 获取检查列表
  GET_PDF_LIST = "get_pdf_list", // 获取pdf列表
  GET_IMG_LIST = "get_img_list", // 获取图片列表
}

/* pdf结构 */
export interface PdfI {
  url: string; // 远程地址
  created_at: string; // 创建时间
  desc?: string; // 描述
}

/* pdf结构 */
export interface ImgI {
  url: string; // 远程地址
  created_at: string; // 创建时间
  thumbnail: string; // 缩略图
  desc?: string; // 描述
}
