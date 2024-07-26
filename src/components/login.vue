<template>
  <Dialog width="350px" @click-mask="closeEvent" :show="loginShow">
    <template #header>
      <div class="flex space-between">
        <div class="flex">
          <img class="logo" src="../assets/logo.png" alt="" />
          <span>大冰开放平台-登录</span>
        </div>
        <div class="close" @click.top="closeEvent"></div>
      </div>
    </template>
    <template #default>
      <div class="m1 flex">
        <div class="login-text" :class="{ active: loginType == 1 }" @click="changeLoginType(1)">大冰登录</div>
        <div class="login-text" :class="{ active: loginType == 0 }" @click="changeLoginType(0)">摸鱼排登录</div>
      </div>
      <div class="m1 flex space-between">
        <label>账号</label>
        <input class="input" type="text" v-model="nameOrEmail" />
      </div>
      <div class="m1 flex space-between">
        <label>密码</label>
        <input class="input" type="password" v-model="userPassword" />
      </div>
      <div class="m1 flex space-between" v-if="loginType == 0">
        <label>二步验证</label>
        <input class="input" type="text" v-model="mfaCode" />
      </div>
      <div class="login-tip m1">{{ loginTips }}</div>
      <div class="m1 flex space-between">
        <div class="btn" @click="toRegin">注册</div>
        <div class="btn" :class="{ disabled: isLoading }" @click="toLogin">登录</div>
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import Dialog from "./dialog.vue";
import { ref, onMounted, watch } from "vue";
import { useGameStore } from "../stores/game";
import { iceLogin, login } from "../apis/api";

const loginType = ref(1);
const loginShow = ref(false);
const isLoading = ref(false);
const prop = defineProps({
  show: Boolean,
});
const emit = defineEmits(["show-change"]);
const nameOrEmail = ref("");
const userPassword = ref("");
const mfaCode = ref("");
const gameStore = useGameStore();
const loginTips = ref("");
onMounted(() => {
  loginShow.value = prop.show;
});
watch(
  () => prop.show,
  (newVal) => {
    loginShow.value = newVal;
  },
  { deep: true }
);
const changeLoginType = (type: number) => {
  loginType.value = type;
};

const closeEvent = () => {
  emit("show-change", false);
};

const toRegin = () => {
  window.open("https://fishpi.cn/register?r=Yui");
};

const toLogin = async () => {
  if(isLoading.value) return;
  isLoading.value = true;
  console.log(nameOrEmail.value, userPassword.value, mfaCode.value);
  if (nameOrEmail.value == "") {
    loginTips.value = "请输入账号";
    return;
  }
  if (userPassword.value == "") {
    loginTips.value = "请输入密码";
    return;
  }
  let res;
  if (loginType.value == 0) {
    res = await login({
      username: nameOrEmail.value,
      password: userPassword.value,
      mfaCode: mfaCode.value,
    });
  } else {
    res = await iceLogin({
      username: nameOrEmail.value,
      password: userPassword.value,
    });
  }
  isLoading.value = false;
  if (res.code != 200) {
    loginTips.value = res.msg;
    return;
  }
  console.log(res);
  gameStore.setUser(res.data);
  emit("show-change", false);
};
</script>

<style scoped>
.logo {
  width: 20px;
  height: 20px;
}
.login-text {
  margin: 0 10px;
  padding: 2px;
  cursor: pointer;
  opacity: 0.3;
  border-bottom: 2px solid transparent;
  transition: 0.2s;
}
.login-text.active {
  opacity: 1;
  border-bottom: 2px solid #000;
}
.login-tip {
  color: red;
  text-align: center;
}
</style>
