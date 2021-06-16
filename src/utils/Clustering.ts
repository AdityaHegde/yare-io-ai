import {SpiritWrapper} from "../wrappers/SpiritWrapper";

export type ClusterItem = {
  value: number;
  spiritWrapper: SpiritWrapper;
}
export type Cluster = {
  value: number;
  items: Array<ClusterItem>;
}

export function simpleAverageAdder(cluster: Cluster, clusterItem: ClusterItem) {
  cluster.items.push(clusterItem);
  cluster.value = cluster.items.reduce(
    (previousValue, currentValue) => (previousValue + currentValue.value), 0) / cluster.items.length;
}

export function simpleAverageClustering(
  clusterValue: number, cluster: Cluster, clusterThreshold: number,
) {
  return clusterValue >= (cluster.value - clusterThreshold / 2) &&
    clusterValue <= (cluster.value + clusterThreshold / 2);
}

export function clusterSpiritWrappers(
  spiritWrappers: Array<SpiritWrapper>,
  valueGetter: (spiritWrapper: SpiritWrapper) => number,
  clusterThreshold: number,
  clustering: (clusterValue: number, cluster: Cluster, clusterThreshold: number) => boolean = simpleAverageClustering,
  clusterAdder: (cluster: Cluster, clusterItem: ClusterItem) => void = simpleAverageAdder,
): Array<Cluster> {
  const clusters = new Array<Cluster>();

  for (const spiritWrapper of spiritWrappers) {
    const clusterValue = valueGetter(spiritWrapper);

    let added = false;

    for (const cluster of clusters) {
      if (clustering(clusterValue, cluster, clusterThreshold)) {
        clusterAdder(cluster, {
          value: clusterValue, spiritWrapper,
        });
        added = true;
        break;
      }
    }

    if (!added) {
      clusters.push({
        items: [{value: clusterValue, spiritWrapper}],
        value: clusterValue,
      });
    }
  }

  return clusters;
}
