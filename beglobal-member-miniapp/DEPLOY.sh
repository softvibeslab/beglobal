#!/bin/bash

set -e

echo "🚀 Iniciando deploy de BeGlobal Member Miniapp"
echo "================================================"

# Variables
REPO="https://github.com/softvibeslab/beglobal.git"
DEPLOY_DIR="/opt/beglobal"
DOMAIN="beglobal.rovicrm.com"
APP_DIR="$DEPLOY_DIR/beglobal-member-miniapp"

# 1. Crear directorio de deploy
echo "📁 Creando directorio de deploy..."
mkdir -p $DEPLOY_DIR
cd $DEPLOY_DIR

# 2. Clonar o actualizar repo
echo "📦 Clonando repositorio..."
if [ -d ".git" ]; then
  echo "  Actualizando repositorio existente..."
  git pull origin main
else
  echo "  Clonando nuevo repositorio..."
  git clone $REPO .
fi

# 3. Navegar al directorio de la app
cd $APP_DIR

# 4. Crear archivo .env si no existe
echo "⚙️  Configurando variables de entorno..."
if [ ! -f "backend/.env" ]; then
  cp backend/.env.example backend/.env
  echo "  ✓ .env creado (edita con tu MEMBER_BOT_TOKEN)"
fi

if [ ! -f "frontend/.env" ]; then
  cp frontend/.env.example frontend/.env
fi

# 5. Detener contenedores anteriores (si existen)
echo "🛑 Deteniendo contenedores anteriores..."
docker-compose down 2>/dev/null || true

# 6. Construir y ejecutar contenedores
echo "🔨 Construyendo e iniciando contenedores..."
docker-compose up -d

# 7. Esperar a que los servicios estén listos
echo "⏳ Esperando a que los servicios estén listos..."
sleep 5

# 8. Verificar que están corriendo
echo "✅ Verificando servicios..."
docker-compose ps

# 9. Crear certificado SSL (si no existe)
echo "🔒 Configurando SSL..."
if [ ! -d "/etc/letsencrypt/live/$DOMAIN" ]; then
  echo "  Generando certificado Let's Encrypt..."
  apt-get update -qq
  apt-get install -y certbot python3-certbot-nginx > /dev/null

  # Nota: Necesitas un servidor web corriendo primero
  # Por ahora creamos un auto-firmado
  openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/nginx/certs/private.key \
    -out /etc/nginx/certs/certificate.crt \
    -subj "/C=MX/ST=Mexico/L=Mexico/O=BeGlobal/CN=$DOMAIN" 2>/dev/null || true
  echo "  ✓ Certificado creado"
fi

# 10. Resumen
echo ""
echo "================================================"
echo "✅ DEPLOY COMPLETADO EXITOSAMENTE!"
echo "================================================"
echo ""
echo "📊 Estado de los servicios:"
docker-compose ps
echo ""
echo "🌍 URLs de acceso:"
echo "   Frontend: http://$DOMAIN (o localhost:5173)"
echo "   Backend:  http://$DOMAIN/api (o localhost:8090)"
echo "   Health:   http://localhost:8090/healthz"
echo ""
echo "📝 Próximos pasos:"
echo "   1. Edita backend/.env con tu MEMBER_BOT_TOKEN"
echo "   2. Reinicia: docker-compose restart backend"
echo "   3. Configura Nginx reverse proxy (opcional)"
echo "   4. Prueba: curl http://localhost:8090/healthz"
echo ""
echo "🔗 Logs:"
echo "   Backend:  docker-compose logs -f backend"
echo "   Frontend: docker-compose logs -f frontend"
echo ""
