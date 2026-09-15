import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
stages: [
{ duration: '10s', target: 10 },
{ duration: '20s', target: 10 },
{ duration: '10s', target: 0 },
],
thresholds: {
http_req_failed: ['rate<0.05'],
http_req_duration: ['p(95)<1000'],
},
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:4000';

export default function () {
const response = http.get(`${BASE_URL}/users`);

check(response, {
'GET /users returns 200': (res) => res.status === 200,
'response contains data': (res) => {
try {
return Array.isArray(res.json('data'));
} catch (_) {
return false;
}
},
});

sleep(1);
}
