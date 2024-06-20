<template>
  <div class="main">
    <n-grid x-gap="12" :cols="12">
      <n-gi span="1"></n-gi>
      <n-gi v-if="!isLogin" span="10">
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
      <n-gi v-else span="10">
        <n-grid cols="5" item-responsive>
          <n-grid-item span="2">
            <div>
              <n-input-group>
                <n-input :style="{ width: '60%' }" v-model:value="instr" placeholder="输入指令" @keydown.enter.prevent="sendMessage" />
                <n-button type="primary" ghost @click="sendMessage"> 发送 </n-button>
              </n-input-group>
              <n-space style="margin-top: 10px">
                <n-button type="primary" secondary @click="sendFastMsg('信息')"> 信息 </n-button>
                <n-button type="primary" secondary @click="sendFastMsg('吐纳')"> 吐纳 </n-button>
                <n-button type="primary" secondary @click="sendFastMsg('历练')"> 历练 </n-button>
                <n-button type="primary" secondary @click="sendFastMsg('一键吐纳')"> 一键吐纳 </n-button>
                <n-button type="primary" secondary @click="sendFastMsg('一键历练')"> 一键历练 </n-button>
                <n-button type="primary" secondary @click="sendFastMsg('大地图')"> 大地图 </n-button>
                <n-button type="primary" secondary @click="sendFastMsg('门派列表')"> 门派列表 </n-button>
              </n-space>
            </div>
            <div v-html="userInfo"></div>
          </n-grid-item>
          <n-grid-item span="3">
            <div v-for="(item, index) in messageList" :key="index">
              <div class="logs" :class="'logs-' + item.type">
                <div>[{{ item.name }}]</div>
                <div v-html="item.content"></div>
              </div>
            </div>
          </n-grid-item>
        </n-grid>
      </n-gi>
      <n-gi span="1"></n-gi>
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
import { ModelType } from "../assets/type";

var token = ref("");
var gameCK = ref("");
var uid = ref("");
var user = ref("");
const message = useMessage();
const model = ref<ModelType>({
  nameOrEmail: null,
  userPassword: null,
  mfaCode: null,
});
const isLogin = ref(false);

const socket = ref(null);

const userInfo = ref("");

const instr = ref("");

const messageList = ref([] as any[]);

onMounted(() => {
  let t = localStorage.getItem("key");
  if (t) {
    token.value = t;
  }
  let u = localStorage.getItem("uid");
  if (u) {
    uid.value = u;
  }
  let g = localStorage.getItem("gameCK");
  if (g) {
    gameCK.value = g;
  }
  let n = localStorage.getItem("user");
  if (n) {
    user.value = n;
  }
  if (t && u && n) {
    isLogin.value = true;
    initSocket();
  }
  console.log(token.value);
  console.log(goods);
});

const initSocket = () => {
  //@ts-ignore
  socket.value = io("wss://game.yuis.cc");

  //@ts-ignore
  socket.value.emit(
    "setUser",
    JSON.stringify({
      uid: uid.value,
      user: user.value,
      ck: gameCK.value,
    })
  );

  //@ts-ignore
  socket.value.on("setCK", function (msg: any) {
    let data = JSON.parse(msg);
    gameCK.value = data.ck;
    localStorage.setItem("gameCK", data.ck);
    console.log(data);
    showMessage(msg, 0);
  });
  //@ts-ignore
  socket.value.on("gameMsg", function (msg: any) {
    showMessage(msg, 1);
  });
  //@ts-ignore
  socket.value.on("serverMsg", function (msg: any) {
    showMessage(msg, 2);
  });
};

const sendMessage = () => {
  let type = "gameMsg";
  if (/登录/g.test(instr.value)) {
    type = "login";
  }
  //@ts-ignore
  socket.value.emit(
    type,
    JSON.stringify({
      ck: gameCK.value,
      msg: instr.value,
      user: user.value,
      uid: uid.value,
    })
  );
  instr.value = "";
};

const sendFastMsg = (msg: string) => {
  //@ts-ignore
  socket.value.emit(
    "gameMsg",
    JSON.stringify({
      ck: gameCK.value,
      msg: msg,
      user: user.value,
      uid: uid.value,
    })
  );
  return;
};

const showMessage = (msg: string, type: number) => {
  let data = JSON.parse(msg);
  if (/出生地/.test(data.msg)) {
    userInfo.value = data.msg;
    return;
  }
  switch (type) {
    case 0:
      messageList.value.unshift({
        name: "小冰网络",
        content: data.msg,
        type: type,
      });
      break;
    case 1:
      messageList.value.unshift({
        name: "游戏信息",
        content: data.msg,
        type: type,
      });
      break;
    case 2:
      messageList.value.unshift({
        name: "系统消息",
        content: data.msg,
        type: type,
      });
      break;

    default:
      break;
  }
};

const login = () => {
  axios({
    url: "https://game.yuis.cc/login",
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
      localStorage.setItem("user", res.data.data.userName);
      user.value = res.data.data.userName;
      uid.value = res.data.data.oId;
      token.value = res.data.key;
      isLogin.value = true;
      initSocket();
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

.logs {
  font-size: 12px;
}

.logs-1 {
  color: green;
}

.logs-0 {
  color: #fc0272;
}
</style>
