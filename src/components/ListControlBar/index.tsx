import React, { FunctionComponent } from "react";
import { Input, Button, Popconfirm, Row, Col, Space, DatePicker } from "antd";

import "./style.less";

interface ListControlBarPropsI {
  searchPlaceholder?: string;
  selectedList?: string[]; // 当前所选
  showDatePicker?: boolean; // 显示日期选择器
  onSearch?: (val: string) => void; // 搜索回调
  onDel?: (ids: string[]) => void; // 删除回调
  onDelCancel?: Function; // 删除取消回调
  onDisable?: (ids: string[]) => void; // 停用回调
  onDisableCancel?: Function; // 停用取消回调
}

const ListControlBar: FunctionComponent<ListControlBarPropsI> = (props) => {
  const {
    searchPlaceholder = "搜索",
    onSearch,
    showDatePicker = false,
    onDel,
    onDelCancel,
    selectedList,
    onDisable,
    onDisableCancel,
  } = props;

  return (
    <div className="list-control-bar">
      <Row justify="space-between" gutter={12}>
        <Col span="6">
          <Input.Search
            placeholder={searchPlaceholder}
            onSearch={(val): void => onSearch && onSearch(val)}
          ></Input.Search>
        </Col>
        {showDatePicker ? (
          <Col span="12">
            <DatePicker.RangePicker></DatePicker.RangePicker>
          </Col>
        ) : null}
        <Col span="6" className="list-control-bar-btns">
          <Space>
            <Popconfirm
              title="确定删除？"
              onConfirm={(): void => onDel && selectedList && onDel(selectedList)}
              onCancel={(): void => onDelCancel && onDelCancel()}
              okType="danger"
            >
              <Button danger type="primary" disabled={!selectedList || !selectedList.length}>
                删除
              </Button>
            </Popconfirm>
            <Popconfirm
              title="确定停用？"
              onConfirm={(): void => onDisable && selectedList && onDisable(selectedList)}
              onCancel={(): void => onDisableCancel && onDisableCancel()}
            >
              <Button type="ghost" disabled={!selectedList || !selectedList.length}>
                停用
              </Button>
            </Popconfirm>
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default ListControlBar;
