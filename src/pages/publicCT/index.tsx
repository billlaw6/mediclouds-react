import { Alert, Cascader, List, Space, Table } from "antd";
import React, { FunctionComponent, useState } from "react";
import data from "_assets/json/cts.json";
import { IS_MOBILE } from "_constants";

interface ColI {
  index: number;
  province: string;
  city: string;
  area: string;
  address: string;
  hospital: string;
  type: string;
  office: string;
  cloudDicom: string;
  uploadedDate: string;
  changedDate: string;
  uploader: string;
}

interface AddressI {
  value: string;
  label: string;
  children?: AddressI[];
}

const handleData = (data: any[]): ColI[] => {
  const res: ColI[] = [];
  let count = 0;

  data.forEach((item) => {
    if (item["医院名称"]) {
      res.push({
        index: count,
        province: item["省"],
        city: item["市"],
        area: item["区/县"],
        address: item["详细地址"],
        hospital: item["医院名称"],
        type: item["支持获取文件的方式"],
        office: item["获取地点"],
        cloudDicom: item["是否有提供云影像链接"],
        uploadedDate: item["提交时间"],
        changedDate: item["修改时间"],
        uploader: item["提交人"],
      });
      count++;
    }
  });

  return res;
};

const findItem = (key: string, arr?: any[]) => {
  if (!arr) return;
  return arr.find((item) => item.value === key);
};

const push = (key: string, arr: any[]) => {
  const item = findItem(key, arr);
  if (!item) arr.push({ label: key, value: key, children: [] });
};

const handleAddress = (data: ColI[]): AddressI[] => {
  const res: AddressI[] = [];

  data.forEach((item) => {
    const { province, city, area } = item;
    push(province, res);
    const _province = findItem(province, res);
    push(city, _province.children);
    const _city = findItem(city, _province.children);
    push(area, _city.children);
  });

  return res;
};

const PublicCT: FunctionComponent = () => {
  const dataSource = handleData(data);
  const selectOptions = handleAddress(dataSource);
  const [selected, setSelected] = useState<[string, string, string]>(["", "", ""]);

  const columns = [
    { title: "序号", dataIndex: "index", key: "index" },
    { title: "省", dataIndex: "province", key: "province" },
    { title: "市", dataIndex: "city", key: "city" },
    { title: "区/县", dataIndex: "area", key: "area" },
    { title: "医院名称", dataIndex: "hospital", key: "hospital" },
    { title: "支持获取文件的方式", dataIndex: "type", key: "type" },
    { title: "获取地点", dataIndex: "office", key: "office" },
    { title: "是否有提供云影像链接", dataIndex: "cloudDicom", key: "cloudDicom" },
  ];

  const [_province, _city, _area] = selected;

  const renderSource =
    _province || _city || _area
      ? dataSource.filter((item) => {
          const { province, city, area } = item;
          if (province === _province && _city === city && _area === area) return item;
        })
      : dataSource;

  return (
    <section style={{ marginTop: "20px" }}>
      <Space direction="vertical">
        <header>
          <h1>支持CT检查结果刻光盘或用U盘拷贝的医院目录</h1>
          <Alert
            type="info"
            message={
              <div>
                ★★公益活动-举手之劳★★ 医院信息采集:请大家各自贡献一份力量，方便后续患者使用！
                <a href="https://jinshuju.net/f/VV2Cal">https://jinshuju.net/f/VV2Cal</a>
              </div>
            }
          ></Alert>
        </header>
        <label>
          <span>搜索：</span>
          <Cascader
            size={IS_MOBILE ? "large" : "middle"}
            options={selectOptions}
            onChange={(value): void => {
              const [province = "", city = "", area = ""] = value;
              setSelected([province as string, city as string, area as string]);
            }}
            showSearch={{
              matchInputWidth: false,
              filter: (inputValue, path) => {
                return path.some(
                  (option) => option.value!.toString().indexOf(inputValue.toString()) > -1,
                );
              },
            }}
            placeholder="请选择省/市/区"
          ></Cascader>
        </label>
        {IS_MOBILE ? (
          <List
            bordered
            size="small"
            itemLayout="vertical"
            dataSource={renderSource}
            split={false}
            style={{
              marginBottom: "24px",
            }}
            renderItem={(item, index) => {
              const { city, area, province, type, office, hospital, cloudDicom } = item;

              return (
                <List.Item
                  style={{
                    background: index % 2 ? "#f1f1f1" : "#fff",
                  }}
                  actions={[
                    <span style={{ fontSize: "12px" }} key="type">
                      方式:{type}
                    </span>,
                    <span style={{ fontSize: "12px" }} key="office">
                      地点:{office}
                    </span>,
                    <span style={{ fontSize: "12px" }} key="cloudDicom">
                      云影像:{cloudDicom}
                    </span>,
                  ]}
                  key={`item_${index}`}
                >
                  <List.Item.Meta title={hospital} />
                  {`${province} ${city} ${area}`}
                </List.Item>
              );
            }}
            pagination={{
              total: renderSource.length,
              pageSize: 10,
              responsive: true,
              hideOnSinglePage: true,
            }}
          ></List>
        ) : (
          <Table rowKey="index" dataSource={renderSource} columns={columns}></Table>
        )}
      </Space>
    </section>
  );
};

export default PublicCT;
