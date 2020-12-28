import React, { FunctionComponent, useState } from "react";
import { UserI } from "mc-api";
import { Store } from "antd/lib/form/interface";
import { Space, Upload, Button } from "antd";
import { ImageFileToBase64 } from "_helper";

import "./avatar.less";

interface AvatarPropI {
  account: UserI;
  onFinish: (vals: Store) => void;
}

const Avatar: FunctionComponent<AvatarPropI> = (props) => {
  const { account, onFinish } = props;
  const { avatar } = account;

  const [preAvatar, setPreAvatar] = useState<{ file?: File; img?: string }>({});

  return (
    <div className="account-avatar">
      <div
        className="account-avatar-preview"
        style={{ backgroundImage: `url(${preAvatar.img || avatar})` }}
      ></div>
      <Space>
        <Upload
          action="/upload-avatar"
          showUploadList={false}
          beforeUpload={(file): boolean => {
            ImageFileToBase64(file)
              .then((res) => setPreAvatar({ file, img: res }))
              .catch((err) => console.error(err));
            return false;
          }}
          accept="image/*"
        >
          <Button>选择头像</Button>
        </Upload>
        <Button
          type="primary"
          onClick={(): void => {
            const { file } = preAvatar;
            if (!file) return;

            onFinish({ avatar: file });
          }}
        >
          上传
        </Button>
      </Space>
    </div>
  );
};

export default Avatar;
