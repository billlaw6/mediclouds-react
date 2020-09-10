import React from "react";
import { connect } from "react-redux";

import { StoreStateI } from "_types/core";
import { CustomerI } from "_types/account";
import ReactEcharts from "echarts-for-react";
import { getDicomFileStats } from "_api/dicom";

interface MapStateToPropsI {
  user: CustomerI;
}

interface StatsStateI {
  totalAmount: number;
  dailyAmount: {
    dt: string; // 年月日
    amount: number; // 上传DICOM累计大小
  }[];
}

class Stats extends React.Component<MapStateToPropsI, StatsStateI> {
  constructor(props: MapStateToPropsI) {
    super(props);
    this.state = {
      totalAmount: 0,
      dailyAmount: [],
    };
    this.getOption = this.getOption.bind(this); //
  }
  componentDidMount(): void {
    getDicomFileStats({}).then((res: any) => {
      const { data } = res;
      this.setState({ totalAmount: data.total_amount });
      this.setState({ dailyAmount: data.daily_amount });
    });
  }

  getOption(): any {
    const { totalAmount, dailyAmount } = this.state;
    console.log(dailyAmount);
    return {
      title: {
        text: "近14天上传统计，总计已上传: " + Math.round(totalAmount / (1024 * 1024)) + "Mb",
        // subtext: "历史累计上传DICOM: " + Math.round(totalAmount / (1024 * 1024)) + "Mb",
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
        data: ["上传DICOM文件累计"],
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
            dailyAmount.forEach((item) => {
              xColumns.push(item.dt);
            });
            console.log(xColumns);
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
          name: "当日上传DICOM累计",
          type: "bar",
          stack: "",
          label: {
            show: false,
            position: "insideRight",
          },
          data: ((): number[] => {
            const yValue: number[] = [];
            dailyAmount.forEach((item) => {
              yValue.push(Math.round(item.amount));
            });
            console.log(yValue);
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
