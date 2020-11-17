import React, { FunctionComponent, useState } from "react";
import { Modal, Input, Form } from "antd";
import { ModalProps } from "antd/lib/modal";
import { createOrder } from "_api/order";
import { OrderI } from "_types/order";

interface CreateOrderPropsI extends ModalProps {
  ownerId: string;
  onSuccessed?: (order: OrderI) => void;
  onFailed?: () => void;
}

const { Item: FormItem } = Form;

const CreateOrder: FunctionComponent<CreateOrderPropsI> = (props) => {
  const { onSuccessed, onFailed, ownerId, ...others } = props;

  const [comment, setComment] = useState("");
  const [confirmLoading, setConfirmLoading] = useState(false);

  return (
    <Modal
      {...others}
      title="创建订单"
      onOk={(): void => {
        setConfirmLoading(true);
        createOrder({
          owner_id: ownerId,
          comment,
          products: [
            { id: 1, amount: 1 },
            { id: 2, amount: 1 },
          ],
        })
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
        <FormItem label="备注" name="comment">
          <Input.TextArea onInput={(e): void => setComment(e.currentTarget.value)}></Input.TextArea>
        </FormItem>
      </Form>
    </Modal>
  );
};

export default CreateOrder;
