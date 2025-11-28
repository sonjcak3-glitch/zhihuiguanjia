const { Signer } = require('@volcengine/openapi');

const ACCESS_KEY = process.env.VOLC_ACCESSKEY;
const SECRET_KEY = process.env.VOLC_SECRETKEY;
const SESSION_TOKEN = process.env.VOLC_SESSIONTOKEN || '';

module.exports = async (req, res) => {
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Allow', 'GET, POST');
    res.json({ success: false, message: 'Method Not Allowed' });
    return;
  }

  if (!ACCESS_KEY || !SECRET_KEY) {
    res.statusCode = 500;
    res.json({ success: false, message: 'Server configuration error: missing VOLC_ACCESSKEY or VOLC_SECRETKEY' });
    return;
  }

  try {
    const taskId =
      (req.method === 'GET' ? (req.query && req.query.taskId) : (req.body && req.body.taskId)) || '';

    if (!taskId) {
      res.statusCode = 400;
      res.json({ success: false, message: 'Missing taskId' });
      return;
    }

    const payload = {
      req_key: 'jimeng_t2i_v31',
      task_id: taskId,
      req_json: JSON.stringify({
        return_url: true,
        logo_info: { add_logo: false },
      }),
    };

    const requestData = {
      method: 'POST',
      region: 'cn-north-1',
      params: {
        Action: 'CVSync2AsyncGetResult',
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

    if (!response.ok || !data.data) {
      res.statusCode = 200;
      res.json({
        success: false,
        status: data.data && data.data.status ? data.data.status : 'error',
        message: data.message || 'Failed to get result',
        code: data.code,
      });
      return;
    }

    res.statusCode = 200;
    res.json({
      success: data.code === 10000,
      status: data.data.status,
      imageUrls: data.data.image_urls || [],
    });
  } catch (err) {
    console.error(err);
    res.statusCode = 500;
    res.json({ success: false, message: 'Internal server error' });
  }
};
