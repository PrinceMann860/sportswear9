import http from "k6/http";
import { sleep } from "k6";

export let options = {
  vus: 50, // number of virtual users
  duration: "30s", // test length
};

export default function () {
  http.get("http://127.0.0.1:8000/api/products/PRD-UU99R55FB7TC/");
  sleep(0.1);
}
