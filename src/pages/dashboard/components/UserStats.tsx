import React from "react";
import { connect } from "react-redux";

import { StoreStateI } from "../../../constants/interface";
import ReactEcharts from "echarts-for-react";
import { getUserStats } from "../../../services/user";

interface MapStateToPropsI {}

interface StatsStateI {
  xAxisColumns: string[];
  userStats: {
    dt: string[]; // 年月日
    rc: number[]; // 注册人次
  };
}

class Stats extends React.Component<MapStateToPropsI, StatsStateI> {
  constructor(props: MapStateToPropsI) {
    super(props);
    this.state = {
      xAxisColumns: [],
      userStats: {
        dt: [],
        rc: [],
      },
    };
    this.getOption = this.getOption.bind(this); //
  }
  componentDidMount() {
    getUserStats({}).then((res: any) => {
      let { data, code } = res;
      this.setState({ userStats: data });
    });
  }

  getOption() {
    const { userStats } = this.state;
    return {
      title: {
        text: "用户统计",
        // subtext: '',
        left: "50%",
        textAlign: "center",
        textStyle: {
          fontSize: 16,
          color: "#000",
        },
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
        },
      },
      legend: {
        data: ["注册人数"],
        top: "10%",
      },
      toolbox: {
        show: false,
        feature: {
          dataView: { show: true, readOnly: false },
          magicType: { show: true, type: ["line", "bar"] },
          restore: { show: true },
          saveAsImage: { show: true },
        },
      },
      calculable: true,
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: userStats.dt,
        },
      ],
      yAxis: [
        {
          type: "value",
        },
      ],
      series: [
        {
          name: "当日注册人数",
          type: "bar",
          stack: "",
          label: {
            show: false,
            position: "insideRight",
          },
          data: userStats.rc,
          color: "#0780cf",
        },
      ],
    };
  }

  render() {
    return (
      <div>
        <ReactEcharts
          notMerge={true}
          lazyUpdate={true}
          style={{ width: "300px", height: "200px" }}
          // theme={"dark"}
          // onChartReady={this.onCharReadyCallback}
          // onEvents={EventsDict}
          // opts={}
          option={this.getOption()}
        />
      </div>
    );
  }
}

const mapStateToProps = (state: StoreStateI): MapStateToPropsI => ({
  user: state.user,
});
export default connect(mapStateToProps)(Stats);
