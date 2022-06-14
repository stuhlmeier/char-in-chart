<template>
  <div id="invisible" ref="invisible">.</div>

  <pre id="chart" ref="chart">
    {{ chartText }}
  </pre>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  inject,
  PropType,
  ref,
  toRefs,
  watch,
} from "vue";
import math, { parse, simplify } from "mathjs";
import { SET_ERROR_MESSAGE } from "@/injectionKeys";
import { GraphType } from "@/types";

const width = 151,
  height = 151;

const hw = Math.floor(width / 2),
  hh = Math.floor(height / 2);

const scale = {
  cartesian: 5,
  polar: 20,
};

interface ChartState {
  grid: string[][];
  touched: boolean[][];
}

function plotAt(
  chartState: ChartState,
  x: number,
  y: number,
  char = "@"
): boolean {
  const row = Math.round(hh - y);
  const col = Math.round(hw + x);

  if (row < 0 || row >= height || col < 0 || col >= width) return false;
  if (chartState.touched[row][col]) return false;

  chartState.grid[row][col] = char[0];
  chartState.touched[row][col] = true;
  return true;
}

function newChart(): ChartState {
  const grid = [...new Array(height)].map(() =>
    [...new Array(width)].map(() => ".")
  );
  const touched = [...new Array(height)].map(() =>
    [...new Array(width)].map(() => false)
  );

  const state: ChartState = { grid, touched };

  for (let i = -hw; i <= hw; i++) state.grid[hh][hw + i] = "-";
  for (let i = -hh; i <= hh; i++) state.grid[hh + i][hw] = "|";
  state.grid[hh][hw] = "+";

  return state;
}

export default defineComponent({
  name: "ChartComponent",
  props: {
    equation: {
      type: String,
      required: true,
    },
    graphType: {
      type: String as PropType<GraphType>,
      required: true,
    },
  },

  setup(props) {
    const { equation, graphType } = toRefs(props);
    const setErrorMessage = inject(SET_ERROR_MESSAGE, () => void 0);

    const chart = ref<HTMLElement>(undefined as unknown as HTMLElement);
    const invisible = ref<HTMLElement>(undefined as unknown as HTMLElement);

    const chartData = ref<ChartState>(newChart());
    const chartText = computed(() => {
      return chartData.value.grid
        .map((row: string[]) => row.join(""))
        .join("\n")
        .trim();
    });
    const expression = computed(() => {
      if (equation.value.trim().length === 0) return null;
      else {
        try {
          return parse(equation.value);
        } catch (e) {
          setErrorMessage("error parsing expression");
          return null;
        }
      }
    });

    function computeGraph(
      graphType: GraphType | null,
      expression: math.MathNode | null
    ) {
      if (!graphType || !expression) {
        chartData.value = newChart();
        return;
      }

      try {
        const simplified = simplify(expression, {}, { exactFractions: false });
        const func = simplified.compile();
        const equationText = simplified.toString().replaceAll(/\s+/g, "");
        const newData = newChart();

        if (graphType === "polar") {
          let index = 0;
          for (let theta = 0; theta <= 2 * 2 * Math.PI; theta += 0.0001) {
            const r = scale.polar * func.evaluate({ θ: theta });

            const x = r * Math.cos(theta);
            const y = r * Math.sin(theta);

            if (isNaN(x) || isNaN(y)) continue;

            const currentChar = equationText[index];
            if (plotAt(newData, x, y, currentChar)) {
              index = (index + 1) % equationText.length;
            }
          }
        } else {
          let index = 0;
          for (let x = -hw; x <= hw; x += 0.01) {
            const y =
              scale.cartesian * func.evaluate({ x: x / scale.cartesian });

            if (isNaN(x) || isNaN(y)) continue;

            const currentChar = equationText[index];
            if (plotAt(newData, x, y, currentChar)) {
              index = (index + 1) % equationText.length;
            }
          }
        }

        chartData.value = newData;
      } catch (e) {
        setErrorMessage(`error evaluating expression: ${e}`);
      }
    }

    watch(expression, (value) => computeGraph(graphType.value, value));
    watch(graphType, (value) => computeGraph(value, expression.value));

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
  overflow scroll

  font-size 8px
  font-weight bolder
  letter-spacing 0.5em
  line-height 1
</style>
