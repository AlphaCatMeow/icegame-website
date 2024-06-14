<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-message-provider>
      <Game />
    </n-message-provider>
  </n-config-provider>
</template>
<script setup lang="ts">
import Game from "./components/game.vue";
import { NConfigProvider } from "naive-ui";
const themeOverrides = {
  common: {
    primaryColor: "#fc0272FF",
    primaryColorHover: "#FC0259FF",
    primaryColorPressed: "#fc0272FF",
    primaryColorSuppl: "#fc0272FF",
  },
};
</script>

<style scoped></style>
