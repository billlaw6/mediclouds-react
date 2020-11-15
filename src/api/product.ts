import { publicReq } from "_axios";
import { ProdCreateDataI, ProdI } from "_types/product";

/** 获取商品列表 */
export const getProducts = async (): Promise<ProdI[]> =>
  await publicReq({
    method: "GET",
    url: "/product/",
  });

/** 新建商品 */
export const createProduct = async (data: ProdCreateDataI): Promise<ProdI> =>
  await publicReq({
    method: "POST",
    url: "/product/create/",
    data,
  });

/** 删除商品 */
export const delProducts = async (id: number[]): Promise<number[]> =>
  await publicReq({
    method: "POST",
    url: "/product/del/",
    data: {
      id,
    },
  });

/** 更新某商品 */
export const updateProducts = async (data: ProdI): Promise<ProdI> =>
  await publicReq({
    method: "POST",
    url: "/product/update/",
    data,
  });
