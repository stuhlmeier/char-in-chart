<template>
  <div class="container">
    <ChartComponent :equation="equation" />
    <label>Input <input v-model="equation" /></label>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import ChartComponent from "@/components/ChartComponent.vue"; // @ is an alias to /src

export default defineComponent({
  name: "HomeView",
  components: {
    ChartComponent,
  },
  setup() {
    const equation = ref("r=θ");

    return {
      equation,
    };
  },
});
</script>

<style lang="stylus">
.container
  display flex
  flex-direction column
  align-items center

ChartComponent
  flex-grow 1

label
  flex 0 0 50px
  height 50px
</style>
