<template>
  <div class="main">
    <n-grid x-gap="12" :cols="3">
      <n-gi></n-gi>
      <n-gi v-if="!isLogin">
        <n-form :model="model">
          <n-form-item path="nameOrEmail" label="用户名or邮箱">
            <n-input v-model:value="model.nameOrEmail" @keydown.enter.prevent placeholder="FishPi账号" />
          </n-form-item>
          <n-form-item path="userPassword" label="密码">
            <n-input v-model:value="model.userPassword" @keydown.enter.prevent placeholder="FishPi密码" />
          </n-form-item>
          <n-form-item path="mfaCode" label="二步验证">
            <n-input v-model:value="model.mfaCode" @keydown.enter.prevent placeholder="没有就空着" />
          </n-form-item>
          <n-row :gutter="[0, 24]">
            <n-col :span="12">
              <div>
                <n-button text @click="toResign">
                  <template #icon>
                    <n-icon>
                      <Accessibility20Filled />
                    </n-icon>
                  </template>
                  没有账号?去注册
                </n-button>
              </div>
            </n-col>
            <n-col :span="12">
              <div style="display: flex; justify-content: flex-end">
                <n-button round type="primary" @click="login"> 登录 </n-button>
              </div>
            </n-col>
          </n-row>
        </n-form>
      </n-gi>
      <n-gi v-else>
        <n-grid cols="4" item-responsive>
          <n-grid-item span="3">1</n-grid-item>
          <n-grid-item span="1">2</n-grid-item>
        </n-grid>
      </n-gi>
      <n-gi></n-gi>
    </n-grid>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { goods } from "../assets/goods";
import { md5 } from "js-md5";
import { Accessibility20Filled } from "@vicons/fluent";
import axios from "axios";
import { useMessage } from "naive-ui";

interface ModelType {
  nameOrEmail: string | null;
  userPassword: string | null;
  mfaCode: string | null;
}

var token = ref("");
const message = useMessage();
const model = ref<ModelType>({
  nameOrEmail: null,
  userPassword: null,
  mfaCode: null,
});
const isLogin = ref(false);

onMounted(() => {
  let t = localStorage.getItem("key");
  if (t) {
    token.value = t;
    isLogin.value = true;
  }
  console.log(token.value);
  console.log(goods);
});

const login = () => {
  axios({
    url: "http://localhost:3004/login",
    method: "get",
    params: {
      nameOrEmail: model.value.nameOrEmail,
      userPassword: md5(`${model.value.userPassword}`),
      mfaCode: model.value.mfaCode,
    },
  }).then((res) => {
    if (res.data.code == 0) {
      message.success("登录成功");
      localStorage.setItem("uid", res.data.data.oId);
      localStorage.setItem("key", res.data.key);
      isLogin.value = true;
    } else {
      message.error("登录失败");
    }
  });
};

const toResign = () => {
  window.open("https://fishpi.cn/register?r=Yui");
};
</script>
<style scoped>
.main {
  width: 100%;
  margin-top: 20vh;
}
</style>
