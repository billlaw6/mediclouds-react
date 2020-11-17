import React, { FunctionComponent, useState } from "react";
import { Avatar as AtAvatar, Button, Input, message, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import useAccount from "_hooks/useAccount";

import "./style.less";

interface AvatarPropsI {
  onSuccessed?: Function;
  onFailed?: (err: string) => void;
}

const Avatar: FunctionComponent<AvatarPropsI> = (props) => {
  const { account } = useAccount();

  const [img, setImg] = useState<File>();

  const beforeUpload = (file: any) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("只能上传 JPG/PNG 的图片!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("图片大小超过2M");
    }
    return isJpgOrPng && isLt2M;
  };

  return (
    <section className="profile-avatar">
      <AtAvatar className="preview" size={120} src={account.avatar}></AtAvatar>
      {/* <Upload className="select" showUploadList={false} onPreview={beforeUpload}>
        <Button type="link" icon={<UploadOutlined />}>
          选择头像
        </Button>
      </Upload>
      <Button className="update" type="primary">
        保存头像
      </Button> */}
    </section>
  );
};

export default Avatar;
