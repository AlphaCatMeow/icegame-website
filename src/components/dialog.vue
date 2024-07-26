<template>
  <div class="dialog-bg" @click.top="clickMask" :class="{ show: dialogShow }">
    <div class="dialog-box" :style="{ width: prop.width, marginTop: prop.top }" @click.stop="clickBox">
      <slot name="header"></slot>
      <slot></slot>
      <slot name="footer"></slot>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, watch } from "vue";

const dialogShow = ref(true);
const prop = defineProps({
  width: String,
  show: Boolean,
  top: {type: String, default: "20vh" },
});
const emit = defineEmits(["click-mask"]);
onMounted(() => {
  console.log(prop);
  dialogShow.value = prop.show;
});

watch(
  () => prop.show,
  (newVal) => {
    dialogShow.value = newVal;
  },
  { deep: true }
);
const clickMask = () => {
  emit("click-mask");
};
const clickBox = () => {
  console.log("clickBox");
};
</script>

<style scoped>
.dialog-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
  opacity: 0;
  z-index: -1;
  transition: 0.5s;
}
.dialog-bg.show {
  opacity: 1;
  z-index: 9999;
}
.dialog-box {
  position: relative;
  margin: 20vh auto 0;
  padding: 1rem;
  width: 50%;
  min-height: 20vh;
  background: #fff;
  border: 2px solid #000;
}
.show .dialog-box {
  animation: bounceInDown 0.5s;
}
.dialog-close{
  position: absolute;
  top: 0;
  right: 10px;
  font-size: 30px;
  cursor: pointer;
}
</style>
