
import http from 'k6/http';
import { sleep } from 'k6';

const BASE_URI = "http://localhost:8080"

export function setup() {
    makeBankAccount(1111)
}

export default function () {
  const params = {
     headers: { 'Content-Type': 'application/json' }
 }
 http.get(BASE_URI + '/account/1111', params);
 sleep(1);
}

export function makeBankAccount(accountNumber) {
     const payload = JSON.stringify({
           currency: "NOK",
           id: accountNumber,
           balance : "0"
       });

      const params = {
       headers: {
         'Content-Type': 'application/json',
       },
      };
      http.post(BASE_URI+'/account', payload, params);
}