import http from 'k6/http';
import { check } from 'k6';

export const options = {
  vus: 5,              // 5 usuários simultâneos
  duration: '5m',      // durante 5 minutos
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% das requisições devem responder em < 500ms
    http_req_failed: ['rate<0.01'],   // taxa de erro < 1%
  },
};

export default function () {
  const res = http.get('https://serverest.dev/usuarios');

  check(res, {
    'status é 200': (r) => r.status === 200,
    'tempo de resposta < 500ms': (r) => r.timings.duration < 500,
  });
}
