/**
 * 腾讯云云函数 - OCR还款计划解析
 * 调用腾讯云文字识别服务解析银行还款计划截图
 */

const tencentcloud = require('tencentcloud-sdk-nodejs');
const OcrClient = tencentcloud.ocr.v20181119.Client;

// 客户端配置
const clientConfig = {
  credential: {
    secretId: process.env.TENCENT_SECRET_ID,
    secretKey: process.env.TENCENT_SECRET_KEY,
  },
  region: 'ap-guangzhou',
  profile: {
    signMethod: 'TC3-HMAC-SHA256',
    httpProfile: {
      reqMethod: 'POST',
      reqTimeout: 30,
    },
  },
};

/**
 * 解析还款计划文本
 * 从OCR结果中提取期数、日期、月供、本金、利息
 */
function parseRepaymentSchedule(text) {
  const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
  const schedules = [];
  
  // 匹配模式：期数 + 日期 + 金额
  // 例如："32期 2026/04/25 ¥262.64 本金¥0.00 利息¥262.64"
  const periodPattern = /(\d+)期/;
  const datePattern = /(\d{4}[\/\-\.]\d{1,2}[\/\-\.]\d{1,2})/;
  const amountPattern = /[¥￥]\s*([\d,]+\.?\d*)/g;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // 尝试匹配期数
    const periodMatch = line.match(periodPattern);
    if (!periodMatch) continue;
    
    const period = parseInt(periodMatch[1]);
    
    // 提取日期
    const dateMatch = line.match(datePattern);
    const dueDate = dateMatch ? dateMatch[1].replace(/\./g, '-') : '';
    
    // 提取所有金额
    const amounts = [];
    let amountMatch;
    while ((amountMatch = amountPattern.exec(line)) !== null) {
      amounts.push(parseFloat(amountMatch[1].replace(/,/g, '')));
    }
    
    // 根据金额数量判断各字段
    let totalAmount = 0;
    let principal = 0;
    let interest = 0;
    
    if (amounts.length >= 3) {
      // 格式：月供、本金、利息
      totalAmount = amounts[0];
      principal = amounts[1];
      interest = amounts[2];
    } else if (amounts.length === 2) {
      // 可能只有月供和利息（先息后本）
      totalAmount = amounts[0];
      interest = amounts[1];
    } else if (amounts.length === 1) {
      totalAmount = amounts[0];
    }
    
    // 如果本金+利息不等于月供，重新计算
    if (principal + interest > 0 && Math.abs(principal + interest - totalAmount) > 0.01) {
      // 可能顺序不对，尝试调整
      if (amounts.length >= 2) {
        principal = amounts[amounts.length - 2];
        interest = amounts[amounts.length - 1];
      }
    }
    
    schedules.push({
      period,
      dueDate,
      totalAmount,
      principal,
      interest,
      remainingPrincipal: 0, // 需要后续计算
      isPaid: false,
    });
  }
  
  // 按期数排序
  schedules.sort((a, b) => a.period - b.period);
  
  // 计算剩余本金（倒推）
  let remaining = schedules.reduce((sum, s) => sum + s.principal, 0);
  for (const schedule of schedules) {
    remaining -= schedule.principal;
    schedule.remainingPrincipal = Math.max(0, remaining);
  }
  
  return schedules;
}

/**
 * 主入口函数
 */
exports.main_handler = async (event, context) => {
  // 设置CORS响应头
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };
  
  // 处理OPTIONS预检请求
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ message: 'OK' }),
    };
  }
  
  try {
    // 解析请求体
    let body = event.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        // 可能是base64编码的
      }
    }
    
    const { imageBase64, imageUrl } = body || {};
    
    if (!imageBase64 && !imageUrl) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: '请提供图片base64或图片URL' }),
      };
    }
    
    // 创建OCR客户端
    const client = new OcrClient(clientConfig);
    
    // 调用腾讯云OCR通用印刷体识别
    const params = {
      ImageBase64: imageBase64,
      ImageUrl: imageUrl,
    };
    
    // 移除未定义的参数
    if (!params.ImageBase64) delete params.ImageBase64;
    if (!params.ImageUrl) delete params.ImageUrl;
    
    const result = await client.GeneralBasicOCR(params);
    
    if (!result.TextDetections || result.TextDetections.length === 0) {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          success: true,
          rawText: '',
          schedules: [],
          message: '未识别到文字内容',
        }),
      };
    }
    
    // 合并所有识别到的文本
    const fullText = result.TextDetections
      .map(item => item.DetectedText)
      .join('\n');
    
    // 解析还款计划
    const schedules = parseRepaymentSchedule(fullText);
    
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        rawText: fullText,
        schedules,
        count: schedules.length,
      }),
    };
    
  } catch (error) {
    console.error('OCR处理错误:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: 'OCR识别失败',
        message: error.message,
      }),
    };
  }
};
