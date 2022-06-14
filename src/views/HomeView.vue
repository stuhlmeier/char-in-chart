<template>
  <div class="container">
    <header>
      <h1>char-in-chart</h1>
    </header>
    <ChartComponent :equation="equation" :graph-type="graphType" />
    <footer>
      <div>
        <label for="equation">Input: </label>
        <select v-model="graphType">
          <option value="polar">r=</option>
          <option value="cartesian">y=</option>
        </select>
        <input id="equation" v-model="equation" ref="equationInput" />
        <button v-if="graphType === 'polar'" @click="appendTheta()">θ</button>
        <button @click="randomSample()">sample</button>
      </div>
      <div id="error">{{ errorMessage }}</div>
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, provide, ref, watch } from "vue";
import ChartComponent from "@/components/ChartComponent.vue";
import { SET_ERROR_MESSAGE } from "@/injectionKeys";
import { GraphType } from "@/types";
import { sample } from "lodash";

const samplePolarGraphs = [
  "3 sin(5θ)",
  "1",
  "1/4 θ",
  "sqrt(9 cos(2θ))",
  "1/(sin(θ) + cos(θ))",
  "4 + 2 csc(θ)",
  "1.5(sin(θ) + sin(5θ/2))",
  "1 / θ",
  "2 cos(5θ)^2 + 2 sin(3θ)",
  "tan(4 θ) + cot(10 θ)",
];

const sampleCartesianGraphs = [
  "sin(x)",
  "tan(x)",
  "csc(x)",
  "sin(x)^2 + cos(x)^2",
  "sinh(x)",
  "4 sin(2 sin(2 sin(2 sin(x))))",
  "1 / x",
  "2 sin(2x) - sin(x)",
  "(2x^2 + 5)/(x^2 - 25)",
  "e^(-x - 4) + sin(x)",
  "1 / x^2",
];

export default defineComponent({
  name: "HomeView",
  components: {
    ChartComponent,
  },
  setup() {
    const equation = ref("");
    const graphType = ref<GraphType>("polar");
    const errorMessage = ref("");

    const equationInput = ref<HTMLElement>(undefined as unknown as HTMLElement);

    provide(
      SET_ERROR_MESSAGE,
      (message: string) => (errorMessage.value = message)
    );

    onMounted(() => {
      graphType.value = "polar";
      equation.value = sample(samplePolarGraphs) ?? "";
    });

    const randomSample = () => {
      switch (graphType.value) {
        case "polar":
          equation.value = sample(samplePolarGraphs) ?? "";
          break;
        case "cartesian":
          equation.value = sample(sampleCartesianGraphs) ?? "";
          break;
      }
    };

    watch(graphType, () => {
      errorMessage.value = "";
      randomSample();
    });

    return {
      equation,
      graphType,
      errorMessage,
      equationInput,

      appendTheta: () => {
        equation.value += "θ";
        equationInput.value.focus();
      },

      randomSample,
    };
  },
});
</script>

<style lang="stylus" scoped>
header
  position fixed
  top 0
  background-color white
  width 100%

  display flex
  flex-direction row
  justify-content center

footer
  position fixed
  bottom 0
  background-color white
  width 100%

  min-height 80px
  padding 20px
  box-sizing border-box

  display flex
  flex-direction column
  align-items center

#error
  color red
  font-weight bold
  text-decoration underline
</style>
