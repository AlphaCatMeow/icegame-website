import request from "./http";

export function login(data: any) {
  return request({
    url: "/api/login",
    method: "post",
    data,
  });
}
export function iceLogin(data: any) {
  return request({
    url: "/api/iceLogin",
    method: "post",
    data,
  });
}

export function openFarm(data:any){
  return request({
    url: "/api/openFarm",
    method: "post",
    data,
  });
}