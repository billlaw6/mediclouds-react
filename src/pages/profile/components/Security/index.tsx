import { Button, Form, Input, Modal, Space } from "antd";
import React, { FunctionComponent, useState } from "react";

interface SecurityPropsI {
  value: string;
}

type SecurityT = "cellPhone" | "email";

interface PreupdateI {
  type: SecurityT;
  title: string;
  subTitle: string;
  visible: boolean;
}

const Security: FunctionComponent<SecurityPropsI> = (props) => {
  const { value } = props;

  const [preupdate, setPreupdate] = useState<PreupdateI>({
    type: "cellPhone",
    title: "更新手机号",
    subTitle: "发送短信验证码更新手机号",
    visible: false,
  });

  return (
    <section className="profile-security">
      <article>
        <header>手机号</header>
        <Space>
          <span>{value.split("").fill("*", 3, 8).join("")}</span>
          <Button
            size="small"
            type="primary"
            onClick={(): void => {
              setPreupdate({
                type: "cellPhone",
                title: "更新手机号",
                subTitle: "发送短信验证码更新手机号",
                visible: true,
              });
            }}
          >
            更新手机号
          </Button>
        </Space>
      </article>

      <Modal
        visible={preupdate.visible}
        title={preupdate.title}
        centered
        destroyOnClose
        maskClosable={false}
        footer={null}
        onCancel={(): void => {
          setPreupdate(
            Object.assign({}, preupdate, {
              visible: false,
            }),
          );
        }}
      >
        {preupdate.type === "cellPhone" ? (
          <div>
            <h3>{preupdate.subTitle}</h3>
            <Form>
              <Form.Item label="新手机号" name="cell_phone">
                <Input></Input>
              </Form.Item>
            </Form>
          </div>
        ) : null}
      </Modal>
    </section>
  );
};

export default Security;
