import React, { FunctionComponent, ReactElement, useState } from "react";
import { Modal, Dropdown, Menu, Button, Input } from "antd";
import { ModalProps } from "antd/lib/modal";
import { createOrder } from "_api/order";
import { OrderI } from "_types/order";

interface CreateOrderPropsI extends ModalProps {
  customerId: string;
  onSuccessed?: (order: OrderI) => void;
  onFailed?: () => void;
}

const { Item: MenuItem } = Menu;

const ORDER_TYPE = [
  { key: "orderType1", value: "订单类型1" },
  { key: "orderType2", value: "订单类型2" },
  { key: "orderType3", value: "订单类型3" },
];

const CreateOrder: FunctionComponent<CreateOrderPropsI> = (props) => {
  const { onSuccessed, onFailed, customerId, ...others } = props;

  const [selectType, setSelectType] = useState(ORDER_TYPE[0]);
  const [comment, setComment] = useState("");
  const [confirmLoading, setConfirmLoading] = useState(false);

  const CreateOrderMenu = (): ReactElement => (
    <Menu
      selectedKeys={[selectType.key]}
      onClick={({ key }): void => {
        const nextSelectType = ORDER_TYPE.find((item) => item.key === key);
        nextSelectType && setSelectType(nextSelectType);
      }}
    >
      {ORDER_TYPE.map((item) => (
        <MenuItem key={item.key}>{item.value}</MenuItem>
      ))}
    </Menu>
  );

  return (
    <Modal
      {...others}
      onOk={(): void => {
        setConfirmLoading(true);
        createOrder({ customer_id: customerId, order_type: selectType.key, comment })
          .then((res) => {
            console.log("create order successed!", res);
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
      <Dropdown trigger={["click"]} overlay={CreateOrderMenu}>
        <Button>{selectType.value}</Button>
      </Dropdown>
      <Input.TextArea onInput={(e): void => setComment(e.currentTarget.value)}></Input.TextArea>
    </Modal>
  );
};

export default CreateOrder;
