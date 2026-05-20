# ========================================================
# Етап 1: Встановлення залежностей та збірка (Build Stage)
# ========================================================
FROM node:18-alpine AS builder
WORKDIR /usr/src/app

# Копіюємо описи залежностей для ізольованого кешування шарів Docker
COPY package*.json ./

# Встановлюємо ВСІ залежності (включаючи devDependencies, необхідні для збірки/типізації)
RUN npm ci

# Копіюємо весь вихідний код проєкту
COPY . .

# Якщо у проєкті є етап компіляції (наприклад, TypeScript), розкоментуйте рядок нижче:
# RUN npm run build

# ========================================================
# Етап 2: Фінальний образ для продакшену (Production Stage)
# ========================================================
FROM node:18-alpine AS runner
WORKDIR /usr/src/app

# Налаштування безпеки: створення не-root користувача та системної групи
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Встановлення змінних середовища за замовчуванням
ENV NODE_ENV=production
ENV PORT=3000

# Копіюємо файли конфігурації залежностей
COPY package*.json ./

# Встановлюємо ВИКЛЮЧНО production-залежності (пропускаємо devDependencies)
RUN npm ci --only=production

# Копіюємо вихідний код (або зібрані файли з етапу builder, наприклад: COPY --from=builder /usr/src/app/dist ./dist)
COPY . .

# Зміна власника робочої директорії для забезпечення доступу не-root користувачу
RUN chown -R appuser:appgroup /usr/src/app

# Перемикання контексту виконання на безпечного користувача
USER appuser

# Декларуємо порт, який слухає застосунок
EXPOSE 3000

# Інструкція Healthcheck для моніторингу працездатності контейнера контейнеризатором
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Команда запуску застосунку
CMD ["node", "src/index.js"]