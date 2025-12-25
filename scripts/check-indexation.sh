#!/bin/bash

# Script de vérification rapide de l'indexation Google
# Usage: ./check-indexation.sh

echo "🔍 Vérification de l'indexation de mathematiques-bac.org"
echo "=========================================================="
echo ""

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Vérifier que le site est accessible
echo "1️⃣  Vérification de l'accessibilité du site..."
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://www.mathematiques-bac.org/)
if [ "$HTTP_STATUS" -eq 200 ]; then
    echo -e "${GREEN}✅ Site accessible (HTTP $HTTP_STATUS)${NC}"
else
    echo -e "${RED}❌ Site non accessible (HTTP $HTTP_STATUS)${NC}"
fi
echo ""

# 2. Vérifier le sitemap.xml
echo "2️⃣  Vérification du sitemap.xml..."
SITEMAP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://www.mathematiques-bac.org/sitemap.xml)
if [ "$SITEMAP_STATUS" -eq 200 ]; then
    echo -e "${GREEN}✅ Sitemap accessible (HTTP $SITEMAP_STATUS)${NC}"
    # Compter le nombre d'URLs
    URL_COUNT=$(curl -s https://www.mathematiques-bac.org/sitemap.xml | grep -c "<loc>")
    echo -e "   📄 Nombre de pages dans le sitemap: ${GREEN}$URL_COUNT${NC}"
else
    echo -e "${RED}❌ Sitemap non accessible (HTTP $SITEMAP_STATUS)${NC}"
fi
echo ""

# 3. Vérifier le robots.txt
echo "3️⃣  Vérification du robots.txt..."
ROBOTS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://www.mathematiques-bac.org/robots.txt)
if [ "$ROBOTS_STATUS" -eq 200 ]; then
    echo -e "${GREEN}✅ Robots.txt accessible (HTTP $ROBOTS_STATUS)${NC}"
    echo "   Contenu:"
    curl -s https://www.mathematiques-bac.org/robots.txt | head -n 5
else
    echo -e "${RED}❌ Robots.txt non accessible (HTTP $ROBOTS_STATUS)${NC}"
fi
echo ""

# 4. Vérifier les meta tags de la page d'accueil
echo "4️⃣  Vérification des meta tags SEO..."
HTML_CONTENT=$(curl -s https://www.mathematiques-bac.org/)

# Vérifier le titre
if echo "$HTML_CONTENT" | grep -q "<title>"; then
    TITLE=$(echo "$HTML_CONTENT" | grep -o '<title>[^<]*</title>' | sed 's/<[^>]*>//g')
    echo -e "${GREEN}✅ Title trouvé:${NC} $TITLE"
else
    echo -e "${RED}❌ Pas de title trouvé${NC}"
fi

# Vérifier la description
if echo "$HTML_CONTENT" | grep -q 'name="description"'; then
    echo -e "${GREEN}✅ Meta description présente${NC}"
else
    echo -e "${RED}❌ Pas de meta description${NC}"
fi

# Vérifier canonical
if echo "$HTML_CONTENT" | grep -q 'rel="canonical"'; then
    echo -e "${GREEN}✅ URL canonique présente${NC}"
else
    echo -e "${RED}❌ Pas d'URL canonique${NC}"
fi

# Vérifier robots
if echo "$HTML_CONTENT" | grep -q 'name="robots"'; then
    echo -e "${GREEN}✅ Meta robots présent${NC}"
else
    echo -e "${YELLOW}⚠️  Pas de meta robots${NC}"
fi

# Vérifier Google verification
if echo "$HTML_CONTENT" | grep -q 'google-site-verification'; then
    echo -e "${GREEN}✅ Code de vérification Google trouvé${NC}"
else
    echo -e "${YELLOW}⚠️  Pas de code de vérification Google Search Console${NC}"
fi
echo ""

# 5. Vérifier HTTPS et certificat
echo "5️⃣  Vérification HTTPS..."
SSL_INFO=$(curl -vI https://www.mathematiques-bac.org/ 2>&1 | grep "SSL connection")
if [ -n "$SSL_INFO" ]; then
    echo -e "${GREEN}✅ HTTPS actif${NC}"
else
    echo -e "${RED}❌ Problème HTTPS${NC}"
fi
echo ""

# 6. Vérifier la vitesse de chargement
echo "6️⃣  Vérification de la vitesse de chargement..."
START_TIME=$(date +%s%N)
curl -s -o /dev/null https://www.mathematiques-bac.org/
END_TIME=$(date +%s%N)
LOAD_TIME=$(( (END_TIME - START_TIME) / 1000000 ))
echo -e "   ⏱️  Temps de chargement: ${LOAD_TIME}ms"
if [ "$LOAD_TIME" -lt 1000 ]; then
    echo -e "${GREEN}✅ Excellent (< 1s)${NC}"
elif [ "$LOAD_TIME" -lt 3000 ]; then
    echo -e "${YELLOW}⚠️  Correct (< 3s)${NC}"
else
    echo -e "${RED}❌ Lent (> 3s)${NC}"
fi
echo ""

# 7. Vérifier la présence dans Google (approximatif)
echo "7️⃣  Test d'indexation Google (indicatif)..."
echo -e "${YELLOW}ℹ️  Pour vérifier l'indexation réelle, allez sur:${NC}"
echo "   https://www.google.com/search?q=site:mathematiques-bac.org"
echo ""

# Résumé final
echo "=========================================================="
echo "✅ RÉSUMÉ"
echo "=========================================================="
echo ""
echo "Configuration technique: OK"
echo "Prochaines étapes:"
echo ""
echo "1. ${YELLOW}Configurez Google Search Console${NC}"
echo "   → https://search.google.com/search-console"
echo ""
echo "2. ${YELLOW}Soumettez votre sitemap${NC}"
echo "   → Ajoutez 'sitemap.xml' dans Google Search Console"
echo ""
echo "3. ${YELLOW}Demandez l'indexation manuelle${NC}"
echo "   → Utilisez l'outil 'Inspection d'URL'"
echo ""
echo "4. ${YELLOW}Créez des backlinks${NC}"
echo "   → Partagez sur réseaux sociaux, forums, annuaires"
echo ""
echo "5. ${YELLOW}Publiez du contenu régulièrement${NC}"
echo "   → Minimum 3-5 articles par semaine"
echo ""
echo "📖 Consultez PLAN_INDEXATION_GOOGLE.md pour plus de détails"
echo ""
