import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { Modal, Dropdown, Menu, Button, Input, Form } from "antd";
import { ModalProps } from "antd/lib/modal";
import { createOrder, getOrderTypes } from "_api/order";
import { OrderI, OrderTypesE } from "_types/order";

interface CreateOrderPropsI extends ModalProps {
  ownerId: string;
  onSuccessed?: (order: OrderI) => void;
  onFailed?: () => void;
}

const { Item: FormItem } = Form;
const { Item: MenuItem } = Menu;

const ORDER_TYPE = [
  { key: "orderType1", value: "订单类型1" },
  { key: "orderType2", value: "订单类型2" },
  { key: "orderType3", value: "订单类型3" },
];

const CreateOrder: FunctionComponent<CreateOrderPropsI> = (props) => {
  const { onSuccessed, onFailed, ownerId, ...others } = props;

  const [orderTypes, setOrderTypes] = useState<{ key: OrderTypesE; value: string }[]>([
    { key: OrderTypesE.DATA_STORAGE, value: "存储" },
    { key: OrderTypesE.CD_RECORD, value: "刻录光盘" },
    { key: OrderTypesE.EMR_COPY, value: "病案复印" },
  ]);
  const [select, setSelect] = useState<{ key: OrderTypesE; value: any }>({
    key: OrderTypesE.DATA_STORAGE,
    value: "存储",
  });
  const [comment, setComment] = useState("");
  const [confirmLoading, setConfirmLoading] = useState(false);

  const CreateOrderMenu = (): ReactElement => (
    <Menu
      selectedKeys={[select.key || ""]}
      defaultValue={[select.value]}
      onClick={({ key }): void => {
        const nextSelect = orderTypes.find((item) => item.key === key);
        nextSelect && setSelect(nextSelect);
      }}
    >
      {orderTypes.map((item) => (
        <MenuItem key={item.key}>{item.value}</MenuItem>
      ))}
    </Menu>
  );

  // useEffect(() => {
  //   getOrderTypes().then(
  //     (res) => {
  //       const orderTypes: { key: OrderTypesE; value: string }[] = [];
  //       res.forEach((item) => {
  //         switch (item) {
  //           case OrderTypesE.DATA_STORAGE:
  //             orderTypes.push({ key: item, value: "储存" });
  //             break;
  //           case OrderTypesE.CD_RECORD:
  //             orderTypes.push({ key: item, value: "刻录光盘" });
  //             break;
  //           case OrderTypesE.EMR_COPY:
  //             orderTypes.push({ key: item, value: "病案复印" });
  //             break;
  //           default:
  //             break;
  //         }
  //       });

  //       setOrderTypes(orderTypes);
  //     },
  //     (err) => console.error(err),
  //   );
  // }, []);

  return (
    <Modal
      {...others}
      onOk={(): void => {
        setConfirmLoading(true);
        createOrder({ owner_id: ownerId, order_type: select.key || "", comment })
          .then((res) => {
            onSuccessed && onSuccessed(res);
          })
          .catch((err) => {
            onFailed && onFailed();
            console.error(err);
          })
          .finally((): void => setConfirmLoading(false));
      }}
      confirmLoading={confirmLoading}
    >
      <Form labelCol={{ span: 4 }}>
        <FormItem label="订单类型" name="order_type">
          <Dropdown trigger={["click"]} overlay={CreateOrderMenu}>
            <Button>{select.value}</Button>
          </Dropdown>
        </FormItem>
        <FormItem label="备注" name="comment">
          <Input.TextArea onInput={(e): void => setComment(e.currentTarget.value)}></Input.TextArea>
        </FormItem>
      </Form>
    </Modal>
  );
};

export default CreateOrder;
