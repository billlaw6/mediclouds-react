import React, { FunctionComponent, ReactNode, useEffect, useState } from "react";
import { Input, Button, Popconfirm, Row, Col, Space, DatePicker, Modal, Select } from "antd";
import { isUndefined } from "util";
import { UserI, RoleE } from "mc-api";
import useAccount from "_hooks/useAccount";
import AccountRole from "_components/AccountRole";

import "./style.less";

interface ListControlBarPropsI {
  searchPlaceholder?: string;
  selectedList?: string[]; // 当前所选
  isDisabledSuperior?: boolean; // 是否禁用更改用户所属
  showSuperior?: boolean; // 是否显示更改用户所属
  currentRole?: RoleE; // 当前列表的用户类型
  showDatePicker?: boolean; // 显示日期选择器
  onSearch?: (val: string) => void; // 搜索回调
  onDateChage?: (dateStrings: string[]) => void; // 日期范围变更回调
  onDel?: (ids: string[]) => void; // 删除回调
  onDelCancel?: Function; // 删除取消回调
  onDisable?: (ids: string[]) => void; // 停用回调
  onDisableCancel?: Function; // 停用取消回调
  onEnable?: (ids: string[]) => void; // 启用回调
  onEnableCancel?: Function; // 启用取消回调
  onChangeSuperior?: (superiorId: string, arr?: string[]) => void; // 更新上级回调
  onChangeSuperiorCancel?: () => void; // 取消更新上级回调
  customerBtns?: ReactNode; // 自定义按钮区域
}

const ListControlBar: FunctionComponent<ListControlBarPropsI> = (props) => {
  const {
    searchPlaceholder = "搜索",
    onSearch,
    onDateChage,
    showDatePicker = false,
    showSuperior = false,
    onDel,
    onDelCancel,
    selectedList,
    onDisable,
    onDisableCancel,
    onEnable,
    onEnableCancel,
    customerBtns,
    isDisabledSuperior,
    onChangeSuperior,
    currentRole,
    onChangeSuperiorCancel,
  } = props;

  const { account } = useAccount();
  const [superiorId, setSuperiorId] = useState("");
  const [showChangePanel, setShowChangePanel] = useState(false);
  const [list, setList] = useState<UserI[]>([]); // 可修改的上级列表

  // useEffect(() => {
  //   if (!showChangePanel || !currentRole) return;
  //   getAffiliatedList(account.id).then((res) =>
  //     setList(
  //       res.results.filter((item) => {
  //         if (account.role === RoleE.SUPER_ADMIN) return item.role !== currentRole;
  //         if (account.role === RoleE.BUSINESS)
  //           return (item.role === RoleE.MANAGER || item.role === RoleE.EMPLOYEE);
  //         if (account.role === RoleE.MANAGER) return item.role === RoleE.EMPLOYEE;
  //       }),
  //     ),
  //   );
  // }, [showChangePanel]);

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
              {showSuperior ? (
                <Button
                  type="primary"
                  disabled={isDisabledSuperior}
                  onClick={(): void => setShowChangePanel(true)}
                >
                  更改所属
                </Button>
              ) : // (
              //   <Popconfirm
              //     title="确定更改？"
              //     onConfirm={(): void =>
              //       onEnable && onChangeSuperior && onChangeSuperior(superiorId, selectedList || [])
              //     }
              //     onCancel={(): void => onChangeSuperiorCancel && onChangeSuperiorCancel()}
              //     disabled={isDisabledSuperior}
              //   >
              //     <Button type="primary" disabled={isDisabledSuperior}>
              //       启用
              //     </Button>
              //   </Popconfirm>
              // )

              null}
            </Space>
          ) : (
            customerBtns
          )}
        </Col>

        <Modal
          visible={showChangePanel}
          onCancel={() => onChangeSuperiorCancel && onChangeSuperiorCancel()}
          onOk={() => onChangeSuperior && onChangeSuperior(superiorId, selectedList)}
        >
          <Select
            defaultValue={list[0] ? list[0].username : ""}
            onChange={(val): void => setSuperiorId(val)}
          >
            {list.map((item) => {
              return (
                <Select.Option key={item.id} value={item.id}>
                  <span>{item.username}</span>
                  <AccountRole role={item.role}></AccountRole>
                </Select.Option>
              );
            })}
          </Select>
        </Modal>
      </Row>
    </div>
  );
};

export default ListControlBar;
