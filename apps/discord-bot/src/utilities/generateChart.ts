import { ChartConfiguration } from 'chart.js'
import * as ChartJsImage from 'chartjs-to-image'

export const lineChart = async (
  labels: string[],
  dataLabel: string,
  data: number[],
  chartTitle = 'Chart Title',
  xLabel = 'X Axis Label',
  yLabel = 'Y Axis Label'
): Promise<Buffer> => {
  const chart = new ChartJsImage()
  const chartConfig: ChartConfiguration = {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: dataLabel,
          data: data,
        },
      ],
    },
    options: {
      title: {
        display: true,
        text: chartTitle,
      },
      scales: {
        xAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: xLabel,
            },
          },
        ],
        yAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: yLabel,
            },
          },
        ],
      },
    },
  }

  chart.setConfig(chartConfig)
  return await chart.toBinary()
}
