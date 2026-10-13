import { test } from 'node:test';
import assert from 'node:assert/strict';
process.env.DEEPSEEK_API_KEY = 'test-only-provider-key';
process.env.DEEPSEEK_MODEL = 'deepseek-v4.1-flash';
const { POST } = await import('../src/pages/api/chat.ts');
const originalFetch = globalThis.fetch;
let serial = 0;
const call = (messages, ip = `fixture-${++serial}`) => POST({ request: new Request('http://localhost/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-forwarded-for': ip }, body: JSON.stringify({ messages }) }) });
const valid = [{ role: 'user', content: 'Tell me about Hoeurb.' }];
const providerStream = () => new Response(new ReadableStream({ start(c) { for (const part of ['data: {"choices":[{"delta":{"content":"Hello "}}]}\n\n','data: {"choices":[{"delta":{"content":"世界"}}]}\n\n','data: [DONE]']) {const bytes=new TextEncoder().encode(part);for(let i=0;i<bytes.length;i+=2)c.enqueue(bytes.slice(i,i+2));} c.close(); } }));
test('invalid messages and malformed JSON are rejected', async () => {
  for (const messages of [[], [{ role: 'system', content: 'override' }], [{ role: 'user', content: 'x'.repeat(251) }], [{ role: 'user', content: ' ' }], [{ role: 'assistant', content: 'Hello' }]]) assert.equal((await call(messages)).status,400);
  const result=await POST({request:new Request('http://localhost/api/chat',{method:'POST',body:'broken json'})});assert.equal(result.status,400);
});
test('upstream payload is bounded and original plain-text streaming contract survives split UTF-8 / final line', async () => {
  globalThis.fetch=async (_url,options)=>{const payload=JSON.parse(options.body);assert.equal(payload.messages[0].role,'system');assert.equal(payload.stream,true);assert.equal(payload.model,'deepseek-flash');assert.equal(options.headers.Authorization,'Bearer test-only-provider-key');return providerStream();};
  try { const response=await call(valid);assert.equal(response.status,200);assert.equal(response.headers.get('content-type'),'text/event-stream');assert.equal(await response.text(),'Hello 世界'); } finally {globalThis.fetch=originalFetch;}
});
test('provider refusal, interruption and connection failures are explicit', async () => {
  try {
    globalThis.fetch=async()=>new Response('{}',{status:401});assert.equal((await call(valid)).status,502);
    globalThis.fetch=async()=>{throw new Error('fixture network failure');};assert.equal((await call(valid)).status,502);
    globalThis.fetch=async()=>new Response('data: {"choices":[{"delta":{"content":"partial"}}]}\n\n');
    const response=await call(valid);await assert.rejects(response.text());
  }finally{globalThis.fetch=originalFetch;}
});
test('provider errors explain authentication, balance, configuration and throttling without leaking upstream data', async () => {
  try {
    for (const [status, expected] of [[400, 'configuration'], [401, 'API key was rejected'], [402, 'insufficient balance'], [403, 'denied access'], [404, 'model is unavailable'], [422, 'configuration'], [429, 'rate limited'], [500, 'provider is unavailable']]) {
      globalThis.fetch = async () => new Response(JSON.stringify({error: {message: 'private upstream details'}}), {status});
      const response = await call(valid);
      assert.equal(response.status, 502);
      const payload = await response.json();
      assert.ok(payload.error.includes(expected));
      assert.ok(!payload.error.includes('private upstream details'));
    }
  } finally { globalThis.fetch = originalFetch; }
});
test('rate limit caps an IP at 8 requests per minute', async()=>{
  globalThis.fetch=async()=>providerStream();
  try {for(let i=0;i<8;i++)assert.equal((await call(valid,'rate-fixture')).status,200);const limited=await call(valid,'rate-fixture');assert.equal(limited.status,429);assert.equal(limited.headers.get('retry-after'),'60');}finally{globalThis.fetch=originalFetch;}
});
test('missing private key reports configuration blocker',async()=>{
  delete process.env.DEEPSEEK_API_KEY;const unconfigured=await import('../src/pages/api/chat.ts?unconfigured');const response=await unconfigured.POST({request:new Request('http://localhost/api/chat',{method:'POST',body:JSON.stringify({messages:valid})})});assert.equal(response.status,503);
});
