#!/usr/bin/env bash
# ==============================================================================
# Script de Déploiement GCP - Application Clean Blog (ENME Stack)
# Architecture : Google Cloud Run + Firestore (Enterprise / Compatibilité MongoDB)
# Objectif : Déploiement automatisé avec contrôle strict du budget et coût minimal
# ==============================================================================

set -euo pipefail

# Couleurs pour l'affichage console
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# ------------------------------------------------------------------------------
# Configuration des variables (personnalisables via variables d'environnement)
# ------------------------------------------------------------------------------
PROJECT_ID="${PROJECT_ID:-$(gcloud config get-value project 2>/dev/null || true)}"
REGION="${REGION:-europe-west9}"                   # Paris (ou europe-west1, us-central1)
SERVICE_NAME="${SERVICE_NAME:-clean-blog}"         # Nom du service Cloud Run
REPO_NAME="${REPO_NAME:-clean-blog-repo}"          # Dépôt Artifact Registry
DATABASE_ID="${DATABASE_ID:-clean-blog-db}"        # Identifiant Firestore
BUDGET_AMOUNT="${BUDGET_AMOUNT:-10EUR}"            # Plafond mensuel d'alerte (ex: 10EUR ou 10USD)
BILLING_ACCOUNT_ID="${BILLING_ACCOUNT_ID:-}"       # Optionnel : ID du compte de facturation (ex: 012345-6789AB-CDEF01)

echo -e "${CYAN}================================================================${NC}"
echo -e "${CYAN}       DÉPLOIEMENT GCP - CLEAN BLOG (CLOUD RUN + FIRESTORE)     ${NC}"
echo -e "${CYAN}================================================================${NC}"

# ------------------------------------------------------------------------------
# Vérification des prérequis
# ------------------------------------------------------------------------------
if ! command -v gcloud &>/dev/null; then
    echo -e "${RED}[ERREUR] Le CLI Google Cloud (gcloud) n'est pas installé.${NC}"
    echo "Installez-le depuis : https://cloud.google.com/sdk/docs/install"
    exit 1
fi

if [[ -z "${PROJECT_ID}" || "${PROJECT_ID}" == "(unset)" ]]; then
    echo -e "${RED}[ERREUR] Aucun projet GCP n'est configuré.${NC}"
    echo "Définissez votre projet avec : gcloud config set project VOTRE_PROJECT_ID"
    echo "Ou exportez la variable : export PROJECT_ID=\"VOTRE_PROJECT_ID\""
    exit 1
fi

echo -e "${BLUE}Projet GCP ciblé :${NC} ${GREEN}${PROJECT_ID}${NC}"
echo -e "${BLUE}Région :${NC}           ${GREEN}${REGION}${NC}"
echo -e "${BLUE}Service Cloud Run :${NC} ${GREEN}${SERVICE_NAME}${NC}"
echo -e "${BLUE}Base Firestore :${NC}    ${GREEN}${DATABASE_ID}${NC}"
echo -e "${BLUE}Budget mensuel :${NC}    ${GREEN}${BUDGET_AMOUNT}${NC}"
echo "----------------------------------------------------------------"

# ------------------------------------------------------------------------------
# Étape 1 : Activation des APIs requises
# ------------------------------------------------------------------------------
echo -e "\n${YELLOW}==> [1/5] Activation des APIs Google Cloud requises...${NC}"
gcloud services enable \
    run.googleapis.com \
    firestore.googleapis.com \
    cloudbuild.googleapis.com \
    artifactregistry.googleapis.com \
    billingbudgets.googleapis.com \
    secretmanager.googleapis.com \
    --project="${PROJECT_ID}"

echo -e "${GREEN}APIs activées avec succès.${NC}"

# ------------------------------------------------------------------------------
# Étape 2 : Création de la base Firestore Enterprise (Compatibilité MongoDB)
# ------------------------------------------------------------------------------
echo -e "\n${YELLOW}==> [2/5] Configuration de Firestore (Édition Enterprise avec compatibilité MongoDB)...${NC}"

# Vérifier si la base Firestore existe déjà
if gcloud firestore databases describe --database="${DATABASE_ID}" --project="${PROJECT_ID}" &>/dev/null; then
    echo -e "${BLUE}La base Firestore '${DATABASE_ID}' existe déjà. Étape ignorée.${NC}"
else
    echo -e "${BLUE}Création de la base Firestore '${DATABASE_ID}' (Édition Enterprise)...${NC}"
    gcloud firestore databases create \
        --database="${DATABASE_ID}" \
        --location="${REGION}" \
        --edition=enterprise \
        --enable-mongodb-compatible-data-access \
        --project="${PROJECT_ID}"
    echo -e "${GREEN}Base Firestore avec compatibilité MongoDB créée.${NC}"
fi

echo -e "${CYAN}[ASTUCE] Pour connecter Mongoose, récupérez votre chaîne MONGODB_URI dans :${NC}"
echo -e "         Console GCP > Firestore > Bases de données > ${DATABASE_ID} > 'Se connecter via MongoDB'"

# ------------------------------------------------------------------------------
# Étape 3 : Création du dépôt Artifact Registry et Build de l'image
# ------------------------------------------------------------------------------
echo -e "\n${YELLOW}==> [3/5] Préparation d'Artifact Registry et construction du conteneur...${NC}"

if ! gcloud artifacts repositories describe "${REPO_NAME}" --location="${REGION}" --project="${PROJECT_ID}" &>/dev/null; then
    echo -e "${BLUE}Création du dépôt Docker Artifact Registry '${REPO_NAME}'...${NC}"
    gcloud artifacts repositories create "${REPO_NAME}" \
        --repository-format=docker \
        --location="${REGION}" \
        --description="Dépôt Docker pour Clean Blog" \
        --project="${PROJECT_ID}"
else
    echo -e "${BLUE}Le dépôt Artifact Registry '${REPO_NAME}' existe déjà.${NC}"
fi

IMAGE_TAG="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO_NAME}/${SERVICE_NAME}:latest"

echo -e "${BLUE}Construction et envoi de l'image Docker via Cloud Build...${NC}"
gcloud builds submit \
    --tag="${IMAGE_TAG}" \
    --project="${PROJECT_ID}" \
    .

echo -e "${GREEN}Image Docker compilée et publiée : ${IMAGE_TAG}${NC}"

# ------------------------------------------------------------------------------
# Étape 4 : Déploiement sur Cloud Run avec contrôle strict du budget
# ------------------------------------------------------------------------------
echo -e "\n${YELLOW}==> [4/5] Déploiement sur Cloud Run avec limites strictes de coûts...${NC}"

# Vérifier si MONGODB_URI est fourni dans l'environnement courant
# Note: PORT est défini automatiquement par Cloud Run via --port=8080 (variable réservée)
ENV_VARS="NODE_ENV=production"
if [[ -n "${MONGODB_URI:-}" ]]; then
    ENV_VARS="${ENV_VARS},MONGODB_URI=${MONGODB_URI}"
    echo -e "${BLUE}Variable MONGODB_URI détectée et injectée dans le service.${NC}"
else
    echo -e "${BLUE}Conservation des variables d'environnement existantes du service Cloud Run (MONGODB_URI, SESSION_SECRET...).${NC}"
fi

# Déploiement Cloud Run optimisé :
# - max-instances=2 : Bloque l'auto-scaling excessif
# - min-instances=1 : Maintient au moins une instance active (élimine les cold starts néfastes pour le SEO)
# - cpu=1 & memory=1Gi : Empreinte ressource adaptée pour Node.js/Mongoose et rendu EJS
# - cpu-throttling : Facturation active uniquement pendant le traitement des requêtes HTTP
# - cpu-boost : Accélère le démarrage du conteneur
MIN_INSTANCES="${MIN_INSTANCES:-1}"
MEMORY_LIMIT="${MEMORY_LIMIT:-1Gi}"

gcloud run deploy "${SERVICE_NAME}" \
    --image="${IMAGE_TAG}" \
    --region="${REGION}" \
    --platform=managed \
    --allow-unauthenticated \
    --port=8080 \
    --max-instances=2 \
    --min-instances="${MIN_INSTANCES}" \
    --cpu=1 \
    --memory="${MEMORY_LIMIT}" \
    --cpu-throttling \
    --cpu-boost \
    --concurrency=80 \
    --timeout=30s \
    --update-env-vars="${ENV_VARS}" \
    --project="${PROJECT_ID}"

SERVICE_URL=$(gcloud run services describe "${SERVICE_NAME}" --platform=managed --region="${REGION}" --project="${PROJECT_ID}" --format="value(status.url)")
echo -e "${GREEN}Application déployée avec succès sur Cloud Run !${NC}"
echo -e "${GREEN}URL : ${SERVICE_URL}${NC}"

# ------------------------------------------------------------------------------
# Étape 5 : Création du Budget Mensuel GCP avec Alertes
# ------------------------------------------------------------------------------
echo -e "\n${YELLOW}==> [5/5] Configuration du Budget Mensuel et des Alertes...${NC}"

# Recherche automatique du compte de facturation lié au projet
if [[ -z "${BILLING_ACCOUNT_ID}" ]]; then
    BILLING_ACCOUNT_ID=$(gcloud beta billing projects describe "${PROJECT_ID}" --format="value(billingAccountName)" 2>/dev/null | sed 's/billingAccounts\///' || true)
fi

if [[ -n "${BILLING_ACCOUNT_ID}" ]]; then
    echo -e "${BLUE}Compte de facturation détecté : ${BILLING_ACCOUNT_ID}${NC}"
    
    # Création du budget avec règles à 50%, 80%, 100% et 100% prévisionnel
    if gcloud billing budgets create \
        --billing-account="${BILLING_ACCOUNT_ID}" \
        --display-name="Budget Clean Blog - Plafond ${BUDGET_AMOUNT} (${PROJECT_ID})" \
        --budget-amount="${BUDGET_AMOUNT}" \
        --filter-projects="projects/${PROJECT_ID}" \
        --threshold-rule="percent=0.5" \
        --threshold-rule="percent=0.8" \
        --threshold-rule="percent=1.0" \
        --threshold-rule="percent=1.0,basis=forecasted-spend" 2>/dev/null; then
        echo -e "${GREEN}Budget mensuel de ${BUDGET_AMOUNT} configuré avec alertes (50%, 80%, 100%, 100% prévisionnel).${NC}"
    else
        echo -e "${YELLOW}[NOTE] Impossible de créer automatiquement le budget via le CLI.${NC}"
        echo -e "       (Cela arrive si votre compte IAM n'a pas le rôle 'Billing Account Costs Manager')."
        echo -e "       Vous pouvez le créer manuellement dans la Console GCP > Facturation > Budgets et alertes :"
        echo -e "       Plafond : ${BUDGET_AMOUNT} | Seuils : 50%, 80%, 100%"
    fi
else
    echo -e "${YELLOW}[NOTE] Aucun compte de facturation rattaché automatiquement trouvé pour ce projet.${NC}"
    echo -e "       Créez votre budget manuellement dans la Console GCP > Facturation > Budgets et alertes."
fi

# ------------------------------------------------------------------------------
# Résumé Final
# ------------------------------------------------------------------------------
echo -e "\n${CYAN}================================================================${NC}"
echo -e "${GREEN}                MIGRATION VERS GCP TERMINÉE AVEC SUCCÈS         ${NC}"
echo -e "${CYAN}================================================================${NC}"
echo -e "1. Service Cloud Run  : ${SERVICE_URL}"
echo -e "2. Base Firestore     : ${DATABASE_ID} (Mode Enterprise MongoDB)"
echo -e "3. Contraintes Coûts  : max 2 instances, min 0, cpu-throttling activé"
echo -e "4. Endpoint Santé     : ${SERVICE_URL}/health"
echo -e "${CYAN}================================================================${NC}"
