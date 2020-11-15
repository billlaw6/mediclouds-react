/**
 * Product 商品
 *
 */

/** 商品action */
export enum ProdActionE {
  CREATE = "create_prod",
  UPDATE = "update_prod",
  DEL = "del_prod",
  GET_LIST = "get_list_prod",
}

export type ProdStateT = ProdI[];

/** 创建商品Data结构 */
export interface ProdCreateDataI {
  name: string;
  code: string;
  price: number;
  special_price?: number;
  comment?: string;
  flag?: 0 | 1;
}

/** 商品结构 */
export interface ProdI extends ProdCreateDataI {
  id: number;
}
