FROM node:20-slim

WORKDIR /app

# تثبيت أدوات البناء لـ better-sqlite3
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

# نسخ ملفات الحزم وتثبيتها
COPY package*.json ./
RUN npm ci --omit=dev || npm install --omit=dev

# نسخ باقي الملفات
COPY . .

# بناء التطبيق
RUN npm run build

# مجلد البيانات والصور المرفوعة
RUN mkdir -p /app/data /app/public/uploads

EXPOSE 3000

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

CMD ["npm", "start"]
