<template>
  <div id="app">
    <div class="mask"></div>
    <router-view  />
  </div>
</template>

<script>
export default {
  data(){
    return {
      
    }
  },
  methods: {
    
  }
};
</script>

<style lang='scss' scoped>
$color: #442727;
#app {
  color: $color;
  text-align: center;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  %mask-common {
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
  }
  .mask {
    @extend %mask-common;
    position: fixed;
    background: url(./static/guilin_view.jpg) no-repeat fixed 0% 50%;
    background-size: cover;
    transition: all 0.5s ease;
    &::after {
      content: "";
      background: inherit;
      @extend %mask-common;
      filter: blur(5px);
    }
  }
}
</style>