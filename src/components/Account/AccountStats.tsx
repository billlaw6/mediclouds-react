import React, { FunctionComponent } from "react";
import { RoleE, StatsI } from "mc-api";
import { Row, Col, Card, Statistic } from "antd";

const AccountStats: FunctionComponent<{ role: RoleE; stats: StatsI | null }> = (props) => {
  const { stats, role } = props;

  if (!stats) return null;

  const userCount = (
    <Card>
      <Statistic title="用户数" value={stats.customer} suffix="人"></Statistic>
    </Card>
  );

  const caseCount = (
    <Card>
      <Statistic title="病例数" value={stats.case} suffix="例"></Statistic>
    </Card>
  );

  const orderCount = (
    <Card>
      <Statistic title="订单量" value={stats.order} suffix="个"></Statistic>
    </Card>
  );

  if (role === RoleE.EMPLOYEE) {
    return (
      <Row>
        <Col span={8}>{userCount}</Col>
        <Col span={8}>{caseCount}</Col>
        <Col span={8}>{orderCount}</Col>
      </Row>
    );
  }

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col key="account" span={12}>
          <Card>
            <Statistic title="员工数" value={stats.account} suffix="人"></Statistic>
          </Card>
        </Col>
        <Col key="customer" span={12}>
          {userCount}
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col key="case" span={12}>
          {caseCount}
        </Col>
        <Col key="order" span={12}>
          {orderCount}
        </Col>
      </Row>
      {role === RoleE.BUSINESS ? (
        <Row gutter={[16, 16]}>
          <Col key="custodicom_sizemer" span="8">
            <Card>
              <Statistic
                title="dicom磁盘空间"
                value={stats.dicom_size}
                precision={2}
                suffix="MB"
              ></Statistic>
            </Card>
          </Col>
          <Col key="pdf_size" span="8">
            <Card>
              <Statistic
                title="pdf磁盘空间"
                value={stats.pdf_size}
                precision={2}
                suffix="MB"
              ></Statistic>
            </Card>
          </Col>
          <Col key="image_size" span="8">
            <Card>
              <Statistic
                title="图片磁盘空间"
                value={stats.image_size}
                precision={2}
                suffix="MB"
              ></Statistic>
            </Card>
          </Col>
        </Row>
      ) : null}
    </>
  );
};

export default AccountStats;
