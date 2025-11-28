const { Signer } = require('@volcengine/openapi');

const ACCESS_KEY = process.env.VOLC_ACCESSKEY;
const SECRET_KEY = process.env.VOLC_SECRETKEY;
const SESSION_TOKEN = process.env.VOLC_SESSIONTOKEN || '';

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Allow', 'POST');
    res.json({ success: false, message: 'Method Not Allowed' });
    return;
  }

  if (!ACCESS_KEY || !SECRET_KEY) {
    res.statusCode = 500;
    res.json({ success: false, message: 'Server configuration error: missing VOLC_ACCESSKEY or VOLC_SECRETKEY' });
    return;
  }

  try {
    const { prompt, width, height, use_pre_llm, seed } = req.body || {};

    if (!prompt || typeof prompt !== 'string') {
      res.statusCode = 400;
      res.json({ success: false, message: 'Missing prompt' });
      return;
    }

    const w = parseInt(width, 10) || 1024;
    const h = parseInt(height, 10) || 1024;

    const payload = {
      req_key: 'jimeng_t2i_v31',
      prompt,
      width: w,
      height: h,
      seed: typeof seed === 'number' ? seed : -1,
    };

    if (typeof use_pre_llm === 'boolean') {
      payload.use_pre_llm = use_pre_llm;
    }

    const requestData = {
      method: 'POST',
      region: 'cn-north-1',
      params: {
        Action: 'CVSync2AsyncSubmitTask',
        Version: '2022-08-31',
      },
      headers: {
        Host: 'visual.volcengineapi.com',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    const signer = new Signer(requestData, 'cv');
    signer.addAuthorization({
      accessKeyId: ACCESS_KEY,
      secretKey: SECRET_KEY,
      sessionToken: SESSION_TOKEN,
    });

    const queryString = new URLSearchParams(requestData.params).toString();
    const url = `https://visual.volcengineapi.com/?${queryString}`;

    const response = await fetch(url, {
      method: requestData.method,
      headers: requestData.headers,
      body: requestData.body,
    });

    const data = await response.json();

    if (!response.ok || data.code !== 10000 || !data.data || !data.data.task_id) {
      res.statusCode = 500;
      res.json({
        success: false,
        message: data.message || 'Failed to submit task',
        code: data.code,
      });
      return;
    }

    res.statusCode = 200;
    res.json({
      success: true,
      taskId: data.data.task_id,
    });
  } catch (err) {
    console.error(err);
    res.statusCode = 500;
    res.json({ success: false, message: 'Internal server error' });
  }
};
