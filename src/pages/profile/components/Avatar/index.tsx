import React, { FunctionComponent, useState } from "react";
import { Avatar as AtAvatar, Button, Input, message, Upload, Modal } from "antd";
import { FastBackwardFilled, UploadOutlined } from "@ant-design/icons";
import useAccount from "_hooks/useAccount";

import "./style.less";

interface AvatarPropsI {
  onSuccessed?: Function;
  onFailed?: (err: string) => void;
}

const Avatar: FunctionComponent<AvatarPropsI> = (props) => {
  const { onSuccessed, onFailed } = props;

  const { account, updateAccount } = useAccount();
  const [currentImg, setCurrentImg] = useState(account.avatar);
  const [img, setImg] = useState<File | Blob>();

  const beforeUpload = (file: any) => {
    const isJpgOrPng =
      file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("只能上传 JPG/PNG 的图片!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("图片大小超过2M");
    }
    return isJpgOrPng && isLt2M;
  };

  const update = (): void => {
    if (!img) return;

    updateAccount({ avatar: img as File })
      .then(() => onSuccessed && onSuccessed())
      .catch((err) => onFailed && onFailed(err));
  };

  return (
    <section className="profile-avatar">
      <AtAvatar className="preview" size={120} src={currentImg}></AtAvatar>
      <Upload
        beforeUpload={(file): boolean => {
          const reader = new FileReader();
          reader.addEventListener("load", () => setCurrentImg(reader.result as string));
          reader.readAsDataURL(file);

          setImg(file);

          return false;
        }}
        className="select"
        showUploadList={false}
        onPreview={beforeUpload}
        accept="image/png,image/jpg,image/jepg"
      >
        <Button type="link" icon={<UploadOutlined />}>
          选择头像
        </Button>
      </Upload>
      <Button
        className="update"
        type="primary"
        disabled={!img}
        onClick={(): void => {
          Modal.confirm({
            title: "更新头像",
            centered: true,
            content: "是否更新头像？",
            onOk: update,
          });
        }}
      >
        更新头像
      </Button>
    </section>
  );
};

export default Avatar;
