#!/bin/bash

# ============================================
# BEGLOBAL MEMBER MINIAPP DEPLOYMENT SCRIPT
# ============================================
# Ejecutar en: ssh root@31.220.63.211
# Comando: bash DEPLOY_VPS.sh

set -e

echo "🚀 BEGLOBAL MINIAPP DEPLOY"
echo "============================"

# Step 1: Crear directorio
mkdir -p /var/www/html/app/miniapp
cd /var/www/html/app/miniapp

# Step 2: Clonar/actualizar
echo "📥 Clonando código..."
if [ -d ".git" ]; then
  git pull origin main
else
  git clone https://github.com/softvibeslab/beglobal.git .
fi

# Step 3: Entrar a directorio miniapp
cd beglobal-member-miniapp

# Step 4: Crear .env backend
echo "⚙️  Configurando backend..."
cat > backend/.env << 'EOF'
MEMBER_BOT_TOKEN=8870107307:AAFUEnYgQuVPdVbgyV0yXEorQqIptJ46vlE
DB_PATH=/data/be_global_member.db
REDIS_URL=redis://redis:6379
ENV=production
API_HOST=0.0.0.0
API_PORT=8090
EOF

# Step 5: Crear .env frontend
echo "⚙️  Configurando frontend..."
cat > frontend/.env << 'EOF'
VITE_API_BASE_URL=https://beglobal.rovicrm.com/api
VITE_TELEGRAM_BOT_USERNAME=beglobal_member_bot
EOF

# Step 6: Limpiar
echo "🧹 Limpiando contenedores previos..."
docker-compose down 2>/dev/null || true
docker system prune -y 2>/dev/null || true

# Step 7: Deploy
echo "🔨 Construyendo e iniciando servicios..."
echo "   (esto puede tomar 2-3 minutos, por favor espera...)"
docker-compose up -d --build

# Step 8: Esperar
echo "⏳ Inicializando servicios..."
sleep 30

# Step 9: Status
echo ""
echo "✅ SERVICIOS EN EJECUCIÓN:"
docker-compose ps

echo ""
echo "=================================================="
echo "✅ ¡DEPLOY COMPLETADO EXITOSAMENTE!"
echo "=================================================="
echo ""
echo "🌍 Acceso:"
echo "   Frontend: https://beglobal.rovicrm.com/app/miniapp"
echo "   Backend API: https://beglobal.rovicrm.com/api"
echo "   Health: https://beglobal.rovicrm.com/api/healthz"
echo ""
echo "📝 Para ver logs:"
echo "   cd /var/www/html/app/miniapp/beglobal-member-miniapp"
echo "   docker-compose logs -f"
echo ""
echo "🛑 Para detener:"
echo "   docker-compose down"
echo ""
echo "✅ ¡Listo para usar!"
echo ""
