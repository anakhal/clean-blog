#!/usr/bin/env bash
# ==============================================================================
# Script de migration des données : MongoDB Atlas -> GCP Firestore (API MongoDB)
# Utilise les outils officiels mongodump / mongorestore
# ==============================================================================

set -euo pipefail

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}================================================================${NC}"
echo -e "${YELLOW}   MIGRATION BASE DE DONNÉES : ATLAS -> GCP FIRESTORE           ${NC}"
echo -e "${YELLOW}================================================================${NC}"

# Variables de connexion (à renseigner ou exporter dans votre shell)
SOURCE_ATLAS_URI="${SOURCE_ATLAS_URI:-${MONGODB_URI:-}}"
TARGET_FIRESTORE_URI="${TARGET_FIRESTORE_URI:-}"
DUMP_FILE="atlas_migration_backup.archive"

if [[ -z "${SOURCE_ATLAS_URI}" ]]; then
    echo -e "${RED}[ERREUR] SOURCE_ATLAS_URI n'est pas définie.${NC}"
    echo "Usage : export SOURCE_ATLAS_URI=\"mongodb+srv://user:pass@atlas-cluster...\""
    exit 1
fi

if [[ -z "${TARGET_FIRESTORE_URI}" ]]; then
    echo -e "${RED}[ERREUR] TARGET_FIRESTORE_URI n'est pas définie.${NC}"
    echo "Usage : export TARGET_FIRESTORE_URI=\"mongodb://user:pass@firestore-host:27017/clean-blog-db?ssl=true&authSource=admin\""
    exit 1
fi

# Vérification des outils
if ! command -v mongodump &>/dev/null || ! command -v mongorestore &>/dev/null; then
    echo -e "${RED}[ERREUR] Les outils 'mongodump' ou 'mongorestore' ne sont pas installés.${NC}"
    echo "Sur Ubuntu/Debian : sudo apt-get install -y mongodb-database-tools"
    echo "Sur macOS : brew tap mongodb/brew && brew install mongodb-database-tools"
    exit 1
fi

# Étape 1 : Export des données depuis MongoDB Atlas
echo -e "\n${GREEN}==> 1. Export des données depuis MongoDB Atlas...${NC}"
mongodump \
    --uri="${SOURCE_ATLAS_URI}" \
    --archive="${DUMP_FILE}" \
    --gzip

echo -e "${GREEN}Sauvegarde Atlas créée : ${DUMP_FILE}${NC}"

# Étape 2 : Import des données dans Firestore (Édition Enterprise)
echo -e "\n${GREEN}==> 2. Import et restauration dans GCP Firestore (compatibilité MongoDB)...${NC}"
mongorestore \
    --uri="${TARGET_FIRESTORE_URI}" \
    --archive="${DUMP_FILE}" \
    --gzip \
    --nsInclude="clean-blog-database.*" \
    --drop

echo -e "\n${GREEN}==> 3. Nettoyage de l'archive temporaire...${NC}"
rm -f "${DUMP_FILE}"

echo -e "\n${GREEN}Migration de la base de données terminée avec succès !${NC}"
