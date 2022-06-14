<template>
  <div id="invisible" ref="invisible">.</div>

  <pre id="chart" ref="chart">
    {{ chartText }}
  </pre>
</template>

<script lang="ts">
import { computed, defineComponent, ref, toRefs } from "vue";
import { parse } from "mathjs";

export default defineComponent({
  name: "ChartComponent",
  props: {
    equation: {
      type: String,
      required: true,
    },
  },

  setup(props) {
    const { equation } = toRefs(props);

    const chart = ref<HTMLElement>(undefined as unknown as HTMLElement);
    const invisible = ref<HTMLElement>(undefined as unknown as HTMLElement);

    const width = 151,
      height = 151;

    const hw = Math.floor(width / 2);
    const hh = Math.floor(height / 2);

    const chartData = ref<string[][]>(
      [...new Array(height)].map(() => [...new Array(width)].map(() => "."))
    );
    const chartText = computed(() => {
      return chartData.value
        .map((row: string[]) => row.join(""))
        .join("\n")
        .trim();
    });

    function plotAt(x: number, y: number, char = "@"): void {
      chartData.value[hw + y][hh + x] = char;
    }

    for (let i = -hw; i <= hw; i++) {
      plotAt(i, 0, "-");
    }
    for (let i = -hh; i <= hh; i++) {
      plotAt(0, i, "|");
    }
    plotAt(0, 0, "+");

    const expression = computed(() => parse(equation.value));

    return {
      chart,
      invisible,

      chartText,
    };
  },
});
</script>

<style lang="stylus">
#invisible
  position fixed
  display none
  bottom 0

#chart
  margin auto
  padding 0
  white-space pre-line

  font-size 8px
  font-weight bolder
  letter-spacing 0.5em
  line-height 1
</style>
