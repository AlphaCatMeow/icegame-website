import { defineStore } from "pinia";
export const useGameStore = defineStore("game", {
  state: () => ({
    user: {
      uid: "0",
      username: "",
      nickname: "",
      openid: "",
      point: 0,
      avatar: "",
    },
    game: {
      key: "ice-9900",
    },
  }),
  getters: {},
  actions: {
    setUser(user: any) {
      this.user = user;
    },
  },
});
