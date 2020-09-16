import React, { FunctionComponent, ReactNode } from "react";
import { Input, Button, Popconfirm, Row, Col, Space, DatePicker } from "antd";
import { isUndefined } from "util";

import "./style.less";

interface ListControlBarPropsI {
  searchPlaceholder?: string;
  selectedList?: string[]; // 当前所选
  showDatePicker?: boolean; // 显示日期选择器
  onSearch?: (val: string) => void; // 搜索回调
  onDateChage?: (dateStrings: string[]) => void; // 日期范围变更回调
  onDel?: (ids: string[]) => void; // 删除回调
  onDelCancel?: Function; // 删除取消回调
  onDisable?: (ids: string[]) => void; // 停用回调
  onDisableCancel?: Function; // 停用取消回调
  onEnable?: (ids: string[]) => void; // 启用回调
  onEnableCancel?: Function; // 启用取消回调
  customerBtns?: ReactNode; // 自定义按钮区域
}

const ListControlBar: FunctionComponent<ListControlBarPropsI> = (props) => {
  const {
    searchPlaceholder = "搜索",
    onSearch,
    onDateChage,
    showDatePicker = false,
    onDel,
    onDelCancel,
    selectedList,
    onDisable,
    onDisableCancel,
    onEnable,
    onEnableCancel,
    customerBtns,
  } = props;

  const disabled = !selectedList || !selectedList.length;

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
            <DatePicker.RangePicker
              onChange={(dates, dateStrings) => {
                onDateChage && onDateChage(dateStrings);
              }}
            ></DatePicker.RangePicker>
          </Col>
        ) : null}
        <Col span="6" className="list-control-bar-btns">
          {isUndefined(customerBtns) ? (
            <Space>
              <Popconfirm
                title="确定删除？"
                onConfirm={(): void => onDel && selectedList && onDel(selectedList)}
                onCancel={(): void => onDelCancel && onDelCancel()}
                okType="danger"
                disabled={disabled}
              >
                <Button danger type="primary" disabled={disabled}>
                  删除
                </Button>
              </Popconfirm>
              <Popconfirm
                title="确定停用？"
                onConfirm={(): void => onDisable && selectedList && onDisable(selectedList)}
                onCancel={(): void => onDisableCancel && onDisableCancel()}
                disabled={disabled}
              >
                <Button type="ghost" disabled={disabled}>
                  停用
                </Button>
              </Popconfirm>
              <Popconfirm
                title="确定启用？"
                onConfirm={(): void => onEnable && selectedList && onEnable(selectedList)}
                onCancel={(): void => onEnableCancel && onEnableCancel()}
                disabled={disabled}
              >
                <Button type="primary" disabled={disabled}>
                  启用
                </Button>
              </Popconfirm>
            </Space>
          ) : (
            customerBtns
          )}
        </Col>
      </Row>
    </div>
  );
};

export default ListControlBar;
