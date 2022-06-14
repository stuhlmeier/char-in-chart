<template>
  <CornerComponent></CornerComponent>
  <div id="container">
    <router-view />
  </div>
</template>

<style lang="stylus">
#app
  font-family monospace

  position absolute
  top 0
  left 0
  right 0
  bottom 0
</style>
<script>
import CornerComponent from "@/components/CornerComponent";
export default {
  components: { CornerComponent },
};
</script>
