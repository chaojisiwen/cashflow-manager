# OCR还款计划解析云函数

## 部署步骤

### 1. 安装依赖
```bash
cd cloud-functions/ocr-parser
npm install
```

### 2. 部署到腾讯云云函数

方式一：使用腾讯云CLI
```bash
# 安装腾讯云CLI
npm install -g @tencentcloud/cli

# 登录
 tccli configure

# 部署函数
tccli scf CreateFunction \
  --FunctionName ocr-parser \
  --Runtime nodejs16.13 \
  --Handler index.main_handler \
  --MemorySize 128 \
  --Timeout 30 \
  --Environment "Variables=[{Key=TENCENT_SECRET_ID,Value=你的SecretId},{Key=TENCENT_SECRET_KEY,Value=你的SecretKey}]"
```

方式二：手动部署（控制台）
1. 登录 [腾讯云云函数控制台](https://console.cloud.tencent.com/scf)
2. 点击「新建」→ 选择「从头开始」
3. 配置：
   - 函数名称：`ocr-parser`
   - 运行环境：`Node.js 16.13`
   - 执行方法：`index.main_handler`
   - 内存：128MB
   - 超时时间：30秒
4. 环境变量设置：
   - `TENCENT_SECRET_ID`: 你的SecretId
   - `TENCENT_SECRET_KEY`: 你的SecretKey
5. 触发器配置：
   - 触发方式：API网关
   - 请求方法：POST
   - 启用CORS

### 3. 获取API地址
部署完成后，在「触发管理」中获取API网关的访问地址。

## API使用

### 请求
```http
POST https://your-api-gateway-url
Content-Type: application/json

{
  "imageBase64": "base64编码的图片数据"
}
```

### 响应
```json
{
  "success": true,
  "rawText": "识别的原始文本",
  "schedules": [
    {
      "period": 32,
      "dueDate": "2026-04-25",
      "totalAmount": 262.64,
      "principal": 0,
      "interest": 262.64,
      "remainingPrincipal": 100000,
      "isPaid": false
    }
  ],
  "count": 5
}
```
