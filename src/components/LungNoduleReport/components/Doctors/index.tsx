import { Avatar, Badge, List } from "antd";
import React, { FunctionComponent, ReactNode } from "react";
import songAvatar from "_images/doctor-song.jpg";
import xiaoying from "_images/xiaoying-wechat-qrcode.png";

const { Item: ListItem } = List;

const doctors = [
  {
    name: "宋贤亮",
    hospital: "安徽省亳州市人民医院",
    section: "影像中心",
    post: "主治医师",
    specialize: "肺内小结节定位，肺结节的影像解读和评估，肺结节的随访前后对比",
    avatar: songAvatar,
    offices: [
      {
        title: "好大夫",
        info: "服务次数：610次 满意度：99%",
      },
      {
        title: "抖音",
        info: "粉丝数：33.7W 点赞数：102.7W",
      },
    ],
  },
];

const Doctors: FunctionComponent = () => {
  return (
    <List
      className="report-doctors"
      header={<h3>快速预约通道</h3>}
      itemLayout="vertical"
      dataSource={doctors}
      renderItem={(item, index): ReactNode => {
        const { name, avatar, hospital, section, post, specialize, offices } = item;

        return (
          <ListItem
            key={`${name}_${index}`}
            className="report-doctors-item"
            // extra={
            //   <div className="report-doctors-item-extra">
            //     <div>快速预约通道：</div>
            //     <img src={xiaoying} style={{ width: "180px" }}></img>
            //   </div>
            // }
            // actions={offices.map((item, index) => {
            //   const { title, info } = item;

            //   return (
            //     <span key={`${item}_${index}`}>
            //       【{title}】 {info}
            //     </span>
            //   );
            // })}
          >
            {/* <ListItem.Meta
              avatar={
                <Avatar
                  size="large"
                  src={avatar}
                  style={{ width: "100px", height: "100px" }}
                ></Avatar>
              }
              title={name}
              description={`${hospital} ${section} ${post}`}
            ></ListItem.Meta>
            <div className="report-doctors-info">
              <span>擅长领域:</span>
              <span>{specialize}</span>
            </div> */}

            <div className="report-doctors-item-extra">
              {/* <div>快速预约通道：</div> */}
              <img src={xiaoying} style={{ width: "180px" }}></img>
            </div>
          </ListItem>
        );
      }}
    ></List>
  );
};

export default Doctors;
