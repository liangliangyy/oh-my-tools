# 构建阶段
FROM node:20-alpine AS builder

# 启用 pnpm
RUN corepack enable

WORKDIR /app

# 复制依赖文件
COPY package.json pnpm-lock.yaml ./

# 安装依赖
RUN pnpm install --frozen-lockfile

# 复制源代码
COPY . .

# 构建应用 (由于 next.config.mjs 中配置了 output: 'export'，构建结果在 out 目录)
RUN pnpm build

# 生产运行阶段
FROM nginx:alpine AS runner

# 复制 nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 从构建阶段复制静态文件到 nginx 目录
COPY --from=builder /app/out /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
