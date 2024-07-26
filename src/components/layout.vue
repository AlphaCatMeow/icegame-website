<template>
  <div class="m1 main-title">
    <img class="main-logo" src="../assets/logo.png" alt="">
    <span>大冰开放平台</span>
    <span style="font-size: 12px;">website-version:2.0.0</span>
  </div>
  <GamePage></GamePage>
</template>
<script setup lang="ts">
import GamePage from "../pages/game.vue";
</script>

<style scoped>
.main-logo{
  width: 25px;
  height: 25px;
}
.main-title {
  font-size: 30px;
  text-align: center;
}
</style>
