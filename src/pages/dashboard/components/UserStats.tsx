import React from "react";
import { connect } from "react-redux";

import { UserI } from "_types/account";
import { StoreStateI } from "_types/core";
import ReactEcharts from "echarts-for-react";
import { getUserStats } from "_api/user";

interface MapStateToPropsI {
  user: UserI;
}

interface StatsStateI {
  totalCount: number;
  dailyCount: {
    dt: string; // 年月日
    rc: number; // 注册人次
  }[];
}

class Stats extends React.Component<MapStateToPropsI, StatsStateI> {
  constructor(props: MapStateToPropsI) {
    super(props);
    this.state = {
      totalCount: 0,
      dailyCount: [],
    };
    this.getOption = this.getOption.bind(this); //
  }
  componentDidMount(): void {
    getUserStats({}).then((res: any) => {
      const { data } = res;
      this.setState({ totalCount: data.total_count });
      this.setState({ dailyCount: data.daily_count });
    });
  }

  getOption(): any {
    const { totalCount, dailyCount } = this.state;
    // console.log(dailyCount);
    return {
      title: {
        text: "近14天注册用户统计(总用户： " + totalCount + "）",
        // subtext: "历史累计用户数： " + totalCount,
        left: "50%",
        textAlign: "center",
        textStyle: {
          fontSize: 26,
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
          data: ((): string[] => {
            const xColumns: string[] = [];
            dailyCount.forEach((item) => {
              xColumns.push(item.dt);
            });
            return xColumns;
          })(),
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
          data: ((): number[] => {
            const yValue: number[] = [];
            dailyCount.forEach((item) => {
              yValue.push(item.rc);
            });
            // console.log(yValue);
            return yValue;
          })(),
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
          style={{ width: "100%", height: "400px" }}
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
