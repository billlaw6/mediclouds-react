import React, { FunctionComponent, useState } from "react";
import { Modal, Form, Input, Upload, Button } from "antd";
import { HomeResI } from "../type";
import { UploadOutlined } from "@ant-design/icons";
import { updateHomeResList, createHomeResList } from "_services/manager";

interface EditPanelPropsI {
  status: {
    show: boolean;
    type: "edit" | "create";
  };
  onCancel: Function;
  onOk: Function;
  data: HomeResI | undefined;
}

const EditPanel: FunctionComponent<EditPanelPropsI> = (props) => {
  const { status, onCancel, onOk, data } = props;
  const { show, type } = status;
  const [preData, setPreData] = useState<HomeResI>({});

  console.log("data", data);
  const isEdit = type === "edit";

  const getVal = (key: string): any => {
    return preData[key] || (data ? data[key] : undefined);
  };
  const setVal = (key: string, val: any): void => {
    setPreData(Object.assign({}, preData, { [key]: val }));
  };

  /**
   * 上传
   *
   */
  const update = async () => {
    const formData = new FormData();

    for (const key of Object.keys(preData)) {
      formData.append(key, preData[key]);
    }

    /* update function */
    let res: any;

    try {
      if (isEdit && data) {
        res = await updateHomeResList(data.id || "", formData);
      } else {
        res = await createHomeResList(formData);
      }

      setPreData({});
      return res;
    } catch (error) {
      throw new Error(error);
    }
  };

  return (
    <Modal
      title={isEdit ? "编辑" : "创建"}
      className="home-res-edit"
      visible={show}
      onOk={(): void => {
        update()
          .then((res) => {
            onOk && onOk(type, res);
          })
          .catch((err) => console.error("update err", err));
      }}
      onCancel={(): void => onCancel && onCancel()}
    >
      {data ? (
        <Form>
          <Form.Item label="跳转地址">
            <Input
              title="跳转地址"
              value={getVal("link_url")}
              onChange={(e) => setVal("link_url", e.target.value)}
            ></Input>
          </Form.Item>

          <Form.Item label={isEdit ? "替换图片" : "上传图片"}>
            <Upload
              multiple={false}
              accept="image/*"
              beforeUpload={(file, fileList): boolean => {
                setVal("file", file);
                return false;
              }}
            >
              <Button>
                <UploadOutlined /> 点击选择
              </Button>
            </Upload>
            {isEdit ? (
              <img src={data.img_url} style={{ width: "200px", height: "200px" }}></img>
            ) : null}
          </Form.Item>
          <Form.Item label="排序">
            <Input
              value={getVal("order")}
              onChange={(e) => setVal("order", parseInt(e.target.value, 10) || 0)}
            ></Input>
          </Form.Item>
        </Form>
      ) : null}
    </Modal>
  );
};

export default EditPanel;
