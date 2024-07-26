<template>
  <div class="main-box">
    <div class="game-box m1" v-if="!isLogin">
      <div class="game-login-box">
        <div class="tips" style="margin-bottom: 10px">还未登录,请先登录</div>
        <div class="btn" @click="showLoginDialog">登录</div>
      </div>
    </div>
    <div class="game-box m1" v-else>
      <div class="menu-btns">
        <div class="menu-item" :class="{ active: gameIndex == 0 }" @click="changeGame(0)">小冰修仙</div>
        <div class="menu-item" :class="{ active: gameIndex == 1 }" @click="changeGame(1)">午安农场</div>
      </div>
      <div class="game-item">
        <div class="game-item-box" v-show="gameIndex == 0">
          <div class="game-msg-box">
            <div class="game-msg" v-for="(item, index) in messageList" :key="index">
              <div class="logs" :class="'logs-' + item.type">
                <div>[{{ item.name }}]</div>
                <div style="margin-top: 5px" v-html="item.content"></div>
              </div>
            </div>
          </div>
          <div class="game-control">
            <div class="flex m1" style="justify-content: start">
              <input class="input" placeholder="输入指令" type="text" style="margin-right: 10px" v-model="instr" @keyup.enter.prevent="sendMessage" />
              <div class="btn" @click="sendMessage">发送</div>
            </div>
            <div class="control-list m1">
              <div class="btn" @click="sendFastMsg('信息')">信息</div>
              <div class="btn" @click="sendFastMsg('吐纳')">吐纳</div>
              <div class="btn" @click="sendFastMsg('历练')">历练</div>
              <div class="btn" @click="sendFastMsg('探索')">探索</div>
              <div class="btn" @click="showBigMap = true">大地图</div>
              <div class="btn" @click="showSectEvent">门派列表</div>
              <div class="btn" @click="sendFastMsg('一键吐纳')">一键吐纳</div>
              <div class="btn" @click="sendFastMsg('一键历练')">一键历练</div>
            </div>
            <div v-html="userInfo"></div>
          </div>
        </div>
        <div class="game-item-box" v-show="gameIndex == 1">
          <div class="farm-plots m1 flex">
            <div class="plots-item p1" v-for="(item, index) in farmPlots" :key="index">
              <div>{{ item.is_upgraded ? "红土地" : "黑土地" }} : {{ item.plot_status }}</div>
              <div style="margin-top: 10px">
                <div class="btn" v-if="item.plot_status == '未种植'" @click="openFarmBags(item.plot_number)">种植</div>

                <div class="btn" v-if="item.plot_status == '可收获'" @click="farmHarvest(item.plot_number)">收获</div>
                <div style="margin-bottom: 10px" v-if="item.plot_status == '成长中'">
                  作物:{{ item.crop }} <br />
                  剩余成长时间:{{ item.timeleft }}
                </div>
                <div class="btn" v-if="item.plot_status == '成长中'" @click="farmRemove(item.plot_number)">铲除</div>
              </div>
            </div>
          </div>
          <div class="farm-info" style="min-width: 350px">
            <div class="m1 flex space-between">
              <div>
                <div style="margin-bottom: 10px">农场等级:{{ farmInfo.farm_level }} ({{ farmInfo.farm_exp }}/{{ farmInfo.next_level }})</div>
                <div style="margin-bottom: 10px">已扩展土地:{{ farmInfo.expandable_plots }}</div>
                <div style="margin-bottom: 10px">金币: {{ farmInfo.farm_gold }}</div>
              </div>
              <div @click="refreshFarm()">
                <img style="width: 20px; height: 20px; cursor: pointer" src="../assets/icons/refresh.png" alt="" />
              </div>
            </div>
            <div class="control-list m1">
              <div class="btn" @click="openFarmStore">商店</div>
              <div class="btn" @click="openFarmBags(0)">背包</div>
              <div class="btn" @click="showFarmRank = true">排行榜</div>
              <div class="btn disabled">好友</div>
              <div class="btn" @click="openFarmBags(233)">一键种植</div>
              <div class="btn" @click="farmHarvest(233)">一键收获</div>
              <div class="btn" v-if="farmInfo.expandable_plots <= 17" @click="showFarmExpand = true">扩建</div>
            </div>
            <div class="farm-game-msg">
              <div class="farm-log" v-for="(item, index) in farmLogs" :key="index">{{ item }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Login @show-change="closeLoginDialog" :show="showLogin"></Login>
  <!-- 小冰大地图 -->
  <Dialog @click-mask="showBigMap = false" :show="showBigMap" width="620px">
    <template #header>
      <div class="flex space-between m1">
        <div>大地图</div>
        <div class="close" @click="showBigMap = false"></div>
      </div>
    </template>
    <template #default>
      <div class="m1" style="max-height: 50vh; overflow-y: scroll">
        <table border="2" cellspacing="0" cellpadding="0" style="margin: 0 auto">
          <tr>
            <th style="padding: 5px">地图</th>
            <th style="padding: 5px">等级</th>
            <th style="padding: 5px">掉落物品</th>
            <th style="padding: 5px">切换</th>
          </tr>
          <tr v-for="(item, index) in BigMapList" :key="index">
            <th style="padding: 5px">{{ item.name }}</th>
            <th style="padding: 5px">{{ item.detail }}</th>
            <th style="padding: 5px">{{ item.items.join(",") }}</th>
            <th style="padding: 5px">
              <div class="btn" @click="changeBigMap(item.name)">切换</div>
            </th>
          </tr>
        </table>
      </div>
    </template>
  </Dialog>
  <!-- 小冰门派 -->
  <Dialog @click-mask="showSectList = false" :show="showSectList" width="450px">
    <template #header>
      <div class="flex space-between m1">
        <div>门派列表</div>
        <div class="close" @click="showSectList = false"></div>
      </div>
    </template>
    <template #default>
      <div class="m1" style="max-height: 50vh; overflow-y: scroll">
        <table border="2" cellspacing="0" cellpadding="0" style="margin: 0 auto">
          <tr>
            <th style="padding: 5px">门派</th>
            <th style="padding: 5px">优势</th>
            <th style="padding: 5px">切换</th>
          </tr>
          <tr v-for="(item, index) in sectList" :key="index">
            <th style="padding: 5px">{{ item.name }}</th>
            <th style="padding: 5px; width: 220px">{{ item.detail }}</th>
            <th style="padding: 5px">
              <div class="btn" @click="changeSect(item.name)">切换</div>
            </th>
          </tr>
        </table>
      </div>
    </template>
  </Dialog>
  <!-- 农场背包 -->
  <Dialog @click-mask="closeFarmBags" :show="showFarmBags" width="350px">
    <template #header>
      <div class="flex space-between">
        <div>背包</div>
        <div class="close" @click="closeFarmBags"></div>
      </div>
    </template>
    <template #default>
      <div class="farm-bags m1">
        <div class="farm-bags-item flex space-between" v-for="(item, index) in warehouse.seeds" :key="index">
          <div>{{ item.name }}-{{ item.num }}</div>
          <div v-if="showPlantBtn" class="btn" style="margin-left: 10px" @click="farmPlant(item.name)">种植</div>
        </div>
      </div>
    </template>
  </Dialog>
  <!-- 农场商店 -->
  <Dialog @click-mask="closeFarmStore" :show="showFarmStore" width="720px">
    <template #header>
      <div class="flex space-between m1">
        <div>商店</div>
        <div class="close" @click="closeFarmStore"></div>
      </div>
    </template>
    <template #default>
      <div class="m1" style="max-height: 50vh; overflow-y: scroll">
        <table border="2" cellspacing="0" cellpadding="0" style="margin: 0 auto">
          <tr>
            <th style="padding: 5px">商品</th>
            <th style="padding: 5px">成长时间</th>
            <th style="padding: 5px">购买单价</th>
            <th style="padding: 5px">产量</th>
            <th style="padding: 5px">出售单价</th>
            <th style="padding: 5px">经验</th>
            <th style="padding: 5px">需要等级</th>
            <th style="padding: 5px">购买</th>
          </tr>
          <tr v-for="(item, index) in farmStore" :key="index">
            <th style="padding: 5px">{{ item.name }}</th>
            <th style="padding: 5px">{{ item.grow_time }}</th>
            <th style="padding: 5px">{{ item.buy_price }}</th>
            <th style="padding: 5px">{{ item.base_yield }}</th>
            <th style="padding: 5px">{{ item.base_price }}</th>
            <th style="padding: 5px">{{ item.exp }}</th>
            <th style="padding: 5px">{{ item.required_level }}</th>
            <th style="padding: 5px">
              <div class="btn" @click="farmBuyItem(item.name, 1)">1</div>
              <div class="btn" style="margin-left: 5px" @click="farmBuyItem(item.name, 10)">10</div>
              <div class="btn" style="margin-left: 5px" @click="farmBuyItem(item.name, 100)">100</div>
            </th>
          </tr>
        </table>
      </div>
    </template>
  </Dialog>
  <!-- 农场排行 -->
  <Dialog @click-mask="showFarmRank = false" :show="showFarmRank" width="500px">
    <template #header>
      <div class="flex space-between m1">
        <div>排行榜</div>
        <div class="close" @click="showFarmRank = false"></div>
      </div>
    </template>
    <template #default>
      <div class="m1" style="max-height: 50vh; overflow-y: scroll">
        <table border="2" cellspacing="0" cellpadding="0" style="margin: 0 auto">
          <tr>
            <th style="padding: 5px">排行</th>
            <th style="padding: 5px">玩家</th>
            <th style="padding: 5px">等级</th>
            <th style="padding: 5px">经验</th>
            <th style="padding: 5px">金币</th>
            <th style="padding: 5px">扩展土地</th>
          </tr>
          <tr v-for="(item, index) in farmRank" :key="index">
            <th style="padding: 5px">{{ index + 1 }}</th>
            <th style="padding: 5px">{{ item.username }}</th>
            <th style="padding: 5px">{{ item.farm_level }}</th>
            <th style="padding: 5px">{{ item.farm_exp }}</th>
            <th style="padding: 5px">{{ item.farm_gold }}</th>
            <th style="padding: 5px">{{ item.expandable_plots }}</th>
          </tr>
        </table>
      </div>
    </template>
  </Dialog>
  <!-- 农场扩建 -->
  <Dialog @click-mask="showFarmExpand = false" :show="showFarmExpand" width="350px">
    <template #header>
      <div class="flex space-between">
        <div>扩建土地</div>
        <div class="close" @click="showFarmExpand = false"></div>
      </div>
    </template>
    <template #default>
      <div class="m1">
        <div>当前扩建需求:</div>
        <div>等级:{{ expandPlot[farmInfo.expandable_plots].lv }}</div>
        <div>金币:{{ expandPlot[farmInfo.expandable_plots].gold }}</div>
        <div class="btn" style="margin-top: 10px" @click="expandPlotEvent">扩建</div>
      </div>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useGameStore } from "../stores/game";
import Login from "../components/login.vue";
import Dialog from "../components/dialog.vue";
import { User } from "../types/user";
import { openFarm } from "../apis/api";
import { Bags, Plot, StoreItem } from "../types/farm";
import dayjs from "dayjs";

const gameStore = useGameStore();
const showLogin = ref(false);
const isLogin = ref(false);
const gameIndex = ref(0);
const messageList = ref([] as any[]);
const gameCK = ref("");
const uid = ref("");
const user = ref("");
const socket = ref(null);
const userInfo = ref("");
const instr = ref("");
const showBigMap = ref(false);
const showSectList = ref(false);
const showFarmBags = ref(false);
const showPlantBtn = ref(true);
const showFarmStore = ref(false);
const showFarmExpand = ref(false);
const showFarmRank = ref(false);
const farmLogs = ref([] as any[]);
const farmInfo = ref({
  expandable_plots: 0,
  farm_exp: 0,
  farm_gold: 3000,
  farm_level: 1,
  fish_id: "1683360176915",
  next_level: 400,
  userNickname: "平平无奇的鱼油",
  username: "fishpi",
});
const farmPlots = ref([] as Plot[]);
const farmTimer = ref();
const warehouse = ref<Bags>({ seeds: [] });
const farmStore = ref([] as StoreItem[]);
const checkedFarmID = ref(0);
const expandPlot = ref([
  { lv: 5, gold: 10000 },
  { lv: 7, gold: 20000 },
  { lv: 9, gold: 30000 },
  { lv: 11, gold: 50000 },
  { lv: 13, gold: 70000 },
  { lv: 15, gold: 90000 },
  { lv: 17, gold: 120000 },
  { lv: 19, gold: 150000 },
  { lv: 21, gold: 180000 },
  { lv: 23, gold: 230000 },
  { lv: 25, gold: 300000 },
  { lv: 27, gold: 500000 },
  { lv: 29, gold: 850000 },
  { lv: 31, gold: 1100000 },
  { lv: 33, gold: 1300000 },
  { lv: 35, gold: 1500000 },
  { lv: 37, gold: 1700000 },
  { lv: 39, gold: 2000000 },
]);
const BigMapList = ref([
  {
    name: "魔兽山脉",
    detail: "[随机]",
    minLv: 0,
    maxLv: 0,
    items: ["香蚀草", "噬蔓花", "千金藤", "活气果"],
  },
  {
    name: "野狼谷",
    detail: "[1-10]",
    minLv: 1,
    maxLv: 10,
    items: ["香蚀草", "噬蔓花"],
  },
  {
    name: "乱星原",
    detail: "[5-15]",
    minLv: 5,
    maxLv: 15,
    items: ["千金藤", "活气果"],
  },
  {
    name: "紫霞涧",
    detail: "[10-20]",
    minLv: 10,
    maxLv: 20,
    items: ["噬蔓花", "千金藤"],
  },
  {
    name: "云梦泽",
    detail: "[15-25]",
    minLv: 15,
    maxLv: 25,
    items: ["香蚀草", "活气果"],
  },
  {
    name: "胡鸣山",
    detail: "[20-30]",
    minLv: 20,
    maxLv: 30,
    items: ["活气果", "噬蔓花", "千年人参"],
  },
  {
    name: "黑水湖",
    detail: "[25-35]",
    minLv: 25,
    maxLv: 35,
    items: ["活气果", "噬蔓花", "千年人参"],
  },
  {
    name: "幻雾林",
    detail: "[30-40]",
    minLv: 30,
    maxLv: 40,
    items: ["香蚀草", "噬蔓花", "千金藤", "活气果", "千年人参"],
  },
  {
    name: "隐魔渊",
    detail: "[35-45]",
    minLv: 35,
    maxLv: 45,
    items: ["香蚀草", "噬蔓花", "千金藤", "活气果", "千年人参"],
  },
  {
    name: "古剑冢",
    detail: "[40-50]",
    minLv: 40,
    maxLv: 50,
    items: ["香蚀草", "噬蔓花", "千金藤", "活气果", "千年人参"],
  },
  {
    name: "伏魔山",
    detail: "[45-55]",
    minLv: 45,
    maxLv: 55,
    items: ["香蚀草", "噬蔓花", "千金藤", "活气果", "千年人参"],
  },
  {
    name: "阴冥涯",
    detail: "[50-60]",
    minLv: 50,
    maxLv: 60,
    items: ["香蚀草", "噬蔓花", "千金藤", "活气果", "千年人参"],
  },
  {
    name: "巨蜥岛",
    detail: "[55-65]",
    minLv: 55,
    maxLv: 65,
    items: ["香蚀草", "噬蔓花", "千金藤", "活气果", "千年人参"],
  },
  {
    name: "云海平",
    detail: "[60-70]",
    minLv: 60,
    maxLv: 70,
    items: ["香蚀草", "噬蔓花", "千金藤", "活气果", "千年人参"],
  },
  {
    name: "灵渺园",
    detail: "[65-75]",
    minLv: 65,
    maxLv: 75,
    items: ["香蚀草", "活气果", "千年人参"],
  },
  {
    name: "凌霄崖",
    detail: "[70-80]",
    minLv: 70,
    maxLv: 80,
    items: ["香蚀草", "活气果", "千年人参"],
  },
  {
    name: "丹霞谷",
    detail: "[75-85]",
    minLv: 75,
    maxLv: 85,
    items: ["千金藤", "活气果", "千年人参"],
  },
  {
    name: "斩龙窟",
    detail: "[80-90]",
    minLv: 80,
    maxLv: 90,
    items: ["香蚀草", "噬蔓花", "千年人参"],
  },
  {
    name: "隐雾山",
    detail: "[85-95]",
    minLv: 85,
    maxLv: 95,
    items: ["千年人参"],
  },
  {
    name: "九黎门",
    detail: "[90-100]",
    minLv: 90,
    maxLv: 100,
    items: ["香蚀草", "噬蔓花", "千年人参"],
  },
  {
    name: "无想天",
    detail: "[95-105]",
    minLv: 95,
    maxLv: 105,
    items: ["千年人参"],
  },
  {
    name: "冥寒狱",
    detail: "[100-110]",
    minLv: 100,
    maxLv: 110,
    items: ["千金藤", "活气果", "千年人参"],
  },
  {
    name: "寂幽海",
    detail: "[105-115]",
    minLv: 105,
    maxLv: 115,
    items: ["千年人参"],
  },
  {
    name: "弥天幻域",
    detail: "[110-120]",
    minLv: 110,
    maxLv: 120,
    items: ["千年人参"],
  },
]);

const sectList = ref([
  {
    name: "云岚宗",
    detail: "在魔兽山脉历练时，攻击增加20%",
  },
  {
    name: "合欢宗",
    detail: "增加10%双修经验",
  },
  {
    name: "炸天帮",
    detail: "增加2%获得经验",
  },
  {
    name: "星陨阁",
    detail: "增加10%成丹率",
  },
]);

const farmRank = ref([] as any[]);

onMounted(() => {
  let g = localStorage.getItem("gameCK");
  if (g) {
    gameCK.value = g;
  }
  let u: User = JSON.parse(localStorage.getItem("user") || "{}");
  gameStore.setUser(u);
  console.log(u);
  if (gameStore.user.uid && gameStore.user.uid != "0") {
    isLogin.value = true;
    uid.value = gameStore.user.uid;
    user.value = gameStore.user.username;
    initSocket();
    initFarm();
  }
});

const showLoginDialog = () => {
  showLogin.value = true;
};
const closeLoginDialog = () => {
  showLogin.value = false;
  if (gameStore.user.uid && gameStore.user.uid != "0") {
    isLogin.value = true;
    uid.value = gameStore.user.uid;
    user.value = gameStore.user.username;
    localStorage.setItem("user", JSON.stringify(gameStore.user));
    initSocket();
    initFarm();
  }
};

const changeGame = (index: number) => {
  gameIndex.value = index;
};
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

const changeBigMap = (map: string) => {
  sendFastMsg(`切换地图 ${map}`);
  sendFastMsg(`信息`);
  showBigMap.value = false;
};

const showSectEvent = () => {
  sendFastMsg(`信息`);
  showSectList.value = true;
};
const changeSect = (sect: string) => {
  const reg = /(宗门)/g;
  if (userInfo.value.match(reg)) {
    sendFastMsg(`退出门派`);
  }
  sendFastMsg(`加入门派 ${sect}`);
  sendFastMsg(`信息`);
  showSectList.value = false;
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
  messageList.value.length > 20 && messageList.value.pop();
};

const initFarm = async () => {
  addFarmLog(`Hi,${user.value},欢迎回到午安农场～`);
  let res = await openFarm({
    url: "/login",
    openid: gameStore.user.openid,
    method: "POST",
  });
  if (res.code == 200) {
    farmInfo.value = res.data.farm_data;
    getFarmInfo();
    farmShop();
    getFarmRank();
  }
  console.log(res);
};

const getFarmInfo = async (username?: string) => {
  let res = await openFarm({
    url: "/farms/view_farm",
    openid: gameStore.user.openid,
    method: "GET",
    params: {
      username: username,
    },
  });
  if (res.code == 200) {
    farmInfo.value.farm_exp = res.data.farm_exp;
    farmInfo.value.farm_gold = res.data.farm_gold;
    farmInfo.value.farm_level = res.data.farm_level;
    farmInfo.value.next_level = res.data.next_level;
    farmInfo.value.expandable_plots = res.data.expandable_plots;
    farmPlots.value = res.data.plots;
    warehouse.value = res.data.warehouse;
    farmPlots.value.forEach((item: Plot) => {
      if (item.plot_status == "成长中") {
        item.timeleft = parseFloat((item.timeleft - Math.random() * 10 + 0.01).toFixed(2));
      }
    });
    getPulateTime();
  } else {
    addFarmLog(res.msg);
  }
};

//计算成熟时间
const getPulateTime = () => {
  clearInterval(farmTimer.value);
  farmTimer.value = setInterval(() => {
    farmPlots.value.forEach((item: Plot) => {
      if (item.plot_status == "成长中") {
        item.timeleft = parseFloat((item.timeleft - 0.1).toFixed(2));
        if (item.timeleft <= 0) {
          clearInterval(farmTimer.value);
          getFarmInfo();
        }
      }
    });
  }, 100);
};

const addFarmLog = (msg: string) => {
  let nowTime = dayjs().format("YYYY/MM/DD HH:mm:ss");
  farmLogs.value.unshift(`${nowTime} ${msg}`);
  farmLogs.value.length > 20 && farmLogs.value.pop();
};
const closeFarmBags = () => {
  showFarmBags.value = false;
  checkedFarmID.value = 0;
};
const openFarmBags = (id: number) => {
  showPlantBtn.value = id != 0;
  showFarmBags.value = true;
  checkedFarmID.value = id;
};

const closeFarmStore = () => {
  showFarmStore.value = false;
};

const openFarmStore = () => {
  showFarmStore.value = true;
};
// 种植作物
const farmPlant = async (name: string) => {
  console.log(`${checkedFarmID.value} ${name}`);
  if (checkedFarmID.value == 233) {
    farmPlots.value.forEach((item: Plot) => {
      if (item.plot_status == "未种植") {
        setTimeout(() => {
          toPlant(name, item.plot_number);
        }, 50 * item.plot_number);
      }
    });
  } else {
    toPlant(name, checkedFarmID.value);
  }
};

const toPlant = async (name: string, plot: number) => {
  let res = await openFarm({
    url: "/farms/plant_crop",
    openid: gameStore.user.openid,
    method: "POST",
    data: {
      plot_id: plot,
      crop_id: name,
    },
  });
  if (res.code == 200) {
    getFarmInfo();
    closeFarmBags();
    addFarmLog(res.data.detail ?? "种植成功");
  } else {
    addFarmLog(res.msg);
  }
};
// 收获作物
const farmHarvest = async (id: number) => {
  if (id == 233) {
    farmPlots.value.forEach((item: Plot) => {
      if (item.plot_status == "可收获") {
        setTimeout(() => {
          toHarvest(item.plot_number);
        }, 50 * item.plot_number);
      }
    });
  } else {
    toHarvest(id);
  }
};

const toHarvest = async (id: number) => {
  let res = await openFarm({
    url: "/farms/harvest_crop",
    openid: gameStore.user.openid,
    method: "POST",
    data: {
      plot_id: id,
    },
  });
  if (res.code == 200) {
    getFarmInfo();
    addFarmLog(res.data.detail ?? "收获成功");
  } else {
    addFarmLog(res.msg);
  }
};
// 铲除作物
const farmRemove = async (id: number) => {
  let res = await openFarm({
    url: "/farms/digs",
    openid: gameStore.user.openid,
    method: "POST",
    data: {
      plot_number: id,
    },
  });
  if (res.code == 200) {
    getFarmInfo();
    addFarmLog(res.data.detail ?? "铲除成功");
  } else {
    addFarmLog(res.msg);
  }
};
// 查询商店
const farmShop = async () => {
  let res = await openFarm({
    url: "/store",
    openid: gameStore.user.openid,
    method: "GET",
  });
  if (res.code == 200) {
    farmStore.value = res.data;
  }
};
//购买作物
const farmBuyItem = async (name: string, num: number) => {
  let res = await openFarm({
    url: "/store",
    openid: gameStore.user.openid,
    method: "POST",
    data: {
      name: name,
      num: num,
    },
  });
  if (res.code == 200) {
    getFarmInfo();
    closeFarmStore();
    addFarmLog(res.data.detail ?? "购买成功");
  } else {
    addFarmLog(res.msg);
  }
};
// 扩建土地
const expandPlotEvent = async () => {
  let res = await openFarm({
    url: "/farms/expand_plot",
    openid: gameStore.user.openid,
    method: "GET",
  });
  if (res.code == 200) {
    getFarmInfo();
    addFarmLog(res.data.detail ?? "扩建成功");
    farmInfo.value.expandable_plots += 1;
  } else {
    addFarmLog("不满足扩建条件");
  }
  showFarmExpand.value = false;
};

const getFarmRank = async () => {
  let res = await openFarm({
    url: "/farms",
    openid: gameStore.user.openid,
    method: "GET",
  });
  if (res.code == 200) {
    farmRank.value = res.data;
  }
};
const refreshFarm = () => {
  getFarmInfo();
  getFarmRank();
  farmShop();
  addFarmLog("刷新成功");
};
</script>

<style scoped>
.game-login-box {
  width: 300px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 1rem auto;
  border: 2px solid #000;
}
.tips {
  color: red;
}
.menu-btns {
  display: flex;
}
.menu-item {
  cursor: pointer;
  padding-bottom: 5px;
  margin: 0 10px;
  border-bottom: 2px solid #fff;
}

.menu-item.active {
  border-bottom: 2px solid #000;
}
.game-box {
  margin: 0 auto;
  max-width: 1280px;
}
.game-item {
  margin-top: 10px;
}
.game-item-box {
  display: flex;
  border: 2px solid #000;
  padding: 1rem;
}
.game-control {
  width: 30%;
  min-width: 350px;
}
.game-msg-box {
  flex: 1;
  position: relative;
  min-height: 40vh;
  max-height: 60vh;
  overflow: hidden;
}
.game-msg-box::after {
  position: absolute;
  content: "";
  bottom: 0;
  left: 0;
  width: 100%;
  height: 20vh;
  background: linear-gradient(0deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 100%);
}
.logs {
  font-size: 12px;
  margin: 5px 0;
}

.logs-1 {
  color: green;
}

.logs-0 {
  color: #fc0272;
}
.control-list {
  display: flex;
  flex-wrap: wrap;
}
.control-list div {
  margin-right: 5px;
  margin-bottom: 5px;
}
.farm-plots {
  flex-wrap: wrap;
  justify-content: start;
  align-items: start;
}
.plots-item {
  margin: 0.5rem;
  border: 2px solid #000;
  min-height: 100px;
  min-width: 188px;
}
.farm-game-msg {
  max-height: 30vh;
  overflow: hidden;
}
.farm-log {
  font-size: 12px;
}
.farm-bags-item {
  padding: 0.5rem;
}
</style>
