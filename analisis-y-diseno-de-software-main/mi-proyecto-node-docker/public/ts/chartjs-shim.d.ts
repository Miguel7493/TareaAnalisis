declare module "chart.js/auto" {
  class Chart {
    constructor(ctx: any, config: any);
    destroy(): void;
  }

  export default Chart;
}
