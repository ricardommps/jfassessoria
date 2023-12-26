import { format } from 'date-fns';
export const formatedMetrics = (chartData, type) => {
  const copycChartData = [...chartData];
  const categories = [];
  const data = [];
  copycChartData.map((item) =>
    categories.push(format(new Date(item.date_published), 'dd/MM/yyyy')),
  );
  copycChartData.map((item) => data.push(type === 1 ? mediaPaces(item.tf_paces) : item.pace));
  const chartItems = {
    categories: [...categories],
    series: [
      {
        data: [
          {
            name: 'Pace',
            data: [...data],
          },
        ],
      },
    ],
  };
  return chartItems;
};

export const formatedPHMetrics = (chartData) => {
  const copycChartData = [...chartData];
  const categories = [];
  const dataPace = [];
  const paceVla = [];
  const paceVlan = [];

  copycChartData.map((item) =>
    categories.push(format(new Date(item.reference_month), 'dd/MM/yyyy')),
  );
  copycChartData.map((item) => dataPace.push(item.pace));
  copycChartData.map((item) => paceVla.push(item.pace_vla));
  copycChartData.map((item) => paceVlan.push(item.pace_vlan));
  const chartItems = {
    categories: [...categories],
    series: [
      {
        data: [
          {
            name: 'Pace',
            data: [...dataPace],
          },
          {
            name: 'Pace Vla',
            data: [...paceVla],
          },
          {
            name: 'Pace Vlan',
            data: [...paceVlan],
          },
        ],
      },
    ],
  };
  return chartItems;
};

export const mediaPaces = (paces) => {
  const soma = paces.reduce((t, n) => Number(n) + Number(t), 0);
  const media = soma / paces.length;
  return Number(media.toFixed(2));
};
