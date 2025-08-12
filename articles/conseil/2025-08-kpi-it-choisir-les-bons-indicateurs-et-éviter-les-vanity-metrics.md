---
title: "KPI IT : choisir les bons indicateurs (et éviter les vanity metrics)"
summary: "Mesurer moins, décider mieux : comment définir des KPI IT pertinents,
  éviter les pièges et transformer les chiffres en résultats."
date: 2025-08-06T12:20:00.000+02:00
image: /images/articles/kpi-illustration.webp
category: Conseil IT
---
# Comprendre, sélectionner et transformer des indicateurs en leviers d’action

> **« Lorsqu’une mesure devient un objectif, elle cesse d’être une bonne mesure. »**  
> — Marilyn Strathern (1997), formulation de la [loi de Goodhart](https://fr.wikipedia.org/wiki/Loi_de_Goodhart)

On mesure beaucoup… mais pas toujours ce qui aide à décider. Un **KPI** (Key Performance Indicator) n’est pas une métrique de plus : c’est un **indicateur clé, lié à un objectif**, qui déclenche une **décision** ou une **action**. Bien choisis, quelques KPI suffisent à aligner sponsors, IT, sécurité et métiers — et à démontrer l’impact réel des projets.

Pour une définition générale, voir **[KPI — Wikipédia](https://fr.wikipedia.org/wiki/Indicateur_cl%C3%A9_de_performance)**. Distinguer les **indicateurs “leading”** (précurseurs) et **“lagging”** (résultats) aide à équilibrer pilotage et bilan : **[Leading vs Lagging](https://en.wikipedia.org/wiki/Leading_and_lagging_indicators)**. Enfin, les critères **[SMART](https://en.wikipedia.org/wiki/SMART_criteria)** aident à formuler une cible crédible.

---

## Comprendre : KPI vs métrique

Une **métrique** décrit un phénomène (ex. “nombre de connexions”). Un **KPI** mesure un **objectif prioritaire** (“% d’utilisateurs actifs sur 3 cas d’usage clés”) et oriente une **action** (former, corriger, prioriser).  
Un bon KPI est **spécifique**, **mesurable automatiquement**, **actionnable**, avec un **propriétaire**, une **cible** et une **fréquence** de revue.

---

## Les erreurs fréquentes (à éviter)

- **Vanity metrics** : volumétrie qui ne change aucune décision (ex. “nb total d’ouvertures de Teams”).  
- **Trop d’indicateurs** : 30 graphes sans owner ⇒ personne n’agit.  
- **Pas de cible / fréquence** : indicateurs “orphelins”.  
- **Déconnectés des objectifs** : pas liés à la roadmap, ni aux risques.  
- **Données fragiles** : sources manuelles, définitions floues, formules non tracées.

---

## Méthode de sélection (simple & efficace)

1. **Clarifier 3–5 objectifs** (ex. réduire les tickets, accélérer les mises à jour, sécuriser l’accès).  
2. **Identifier les décideurs** : qui consomme quoi et pour décider quoi (sponsor, IT Ops, sécurité, métiers) ?  
3. **Lister les leviers** : projets, politiques, remédiations possibles ; **contraintes** : données dispo, cadence.  
4. **Proposer 2–3 KPI candidats** par objectif (définition, source, formule).  
5. **Scorer** chaque KPI (0–2) : pertinence, mesurabilité, actionnabilité.  
6. **Retenir 1 KPI principal + 1 auxiliaire** par objectif ⇒ **6–8 KPI max**.

### Scorecard de sélection (exemple)

| KPI candidat                      | Pertinence (0–2) | Mesurabilité (0–2) | Actionnabilité (0–2) | Score |
|---|---:|---:|---:|---:|
| p95 temps de démarrage Windows    | 2 | 2 | 2 | **6** |
| % licences M365 inactives > 30 j  | 2 | 2 | 2 | **6** |
| Nb total de connexions Teams      | 0 | 2 | 0 | 2 |

---

## KPI Canvas (modèle réutilisable)

Formalise chaque KPI sur **1 page** : ça évite les malentendus et accélère l’exécution.

| Champ           | Contenu (exemple) |
|---|---|
| **Objectif**    | Améliorer l’expérience poste au démarrage |
| **KPI**         | p95 temps de démarrage ≤ 120 s (moyenne 30 j) |
| **Formule**     | p95 (logon → appareil utilisable) |
| **Source**      | Télémétrie poste / Endpoint analytics |
| **Fréquence**   | Hebdomadaire (synthèse mensuelle exécutif) |
| **Owner**       | Responsable Poste de Travail |
| **Seuils**      | Vert ≤ 120 / Ambre 121–150 / Rouge > 150 |
| **Actions**     | Remédiations démarrage, drivers/firmware, nettoyage services, audit GPO héritées |

---

## Exemples d’indicateurs utiles (Workplace IT)

**Adoption & collaboration.** *% d’utilisateurs actifs* sur **3 cas d’usage clés** (messagerie, réunion, co-édition). S’il décroît : micro-learning ciblé, modèles d’espaces, coaching des managers.

**DEX / poste de travail.** *p95 temps de démarrage* et *% sessions “crash-free”*. En dérive : remédiations proactives (désactivation démarrage, nettoyage, drivers/firmware, correctifs applis).

**Sécurité & conformité.** *% d’appareils conformes aux politiques critiques* (chiffrement, protection, accès conditionnel) et *% MFA effectif sur comptes à privilèges*. En rouge : correction ciblée et **exceptions time-boxed**.

**Mises à jour & déploiements.** *% d’appareils sur le dernier correctif à J+14* et *taux de succès premier passage (Win32)*. En écart : anneaux & deadlines, dépendances, traitement des erreurs récurrentes.

**Coûts (FinOps).** *% de licences M365 inactives > 30 j*. Action : recouvrement/downgrade + revue mensuelle RH/managers.

---

## Gouvernance des KPI

Sans rituel, pas d’impact. Installe un **RACI** simple, une **cadence** courte et un processus d’**escalade**.

| Rôle                   | Responsabilités |
|---|---|
| **Sponsor**           | Valide objectifs & cibles, arbitre priorités |
| **Owner KPI**         | Suit l’indicateur, déclenche les actions, rend compte |
| **IT Ops / Sécu / Métiers** | Mesure, exécute remédiations, fournit contexte |
| **PMO / Consultant**  | Tient le data dictionary, anime la revue, consolide le dashboard |

- **Hebdo (30 min)** : top 3 écarts → **actions**, **owner**, **date**.  
- **Mensuel** : synthèse exécutive (tendances 90 j, risques, arbitrages).  
- **Data dictionary** versionné : définition, source, formule, fréquence, seuils.

---

## Plan de mise en œuvre (exemple)

| Moment | Livrable / action | Détail |
|---|---|---|
| J1–J3 | Cadrage objectifs & parties prenantes | Interviews, périmètre, sources de données |
| J4–J5 | Propositions + scorecard | 2–3 KPI candidats / objectif, scoring 0–2 |
| J6    | Sélection finale | 6–8 KPI max, cibles & seuils |
| J7–J8 | KPI Canvas + data dictionary | 1 page / KPI + dictionnaire |
| J9    | Dashboard v1 | Vue exécutive + opérationnelle |
| J10   | Lancement du rituel | Réunion hebdo, premières actions |

---

## Gestion des risques (extrait)

| Risque                          | Prob. | Impact | Mitigation                                   | Plan de secours                 |
|---|---|---|---|---|
| Vanity metrics                  | Moy.  | Élevé  | Méthode de sélection + scorecard             | Revue externe des KPI |
| Données incomplètes / instables | Moy.  | Élevé  | Sources automatisées, définitions tracées    | Ajuster la formule / changer la source |
| KPI sans owner                  | Élevée| Élevé  | RACI clair + sponsor actif                   | Revue mensuelle sponsor |
| Sur-pilotage (trop d’indicateurs) | Élevée| Moyen | 6–8 KPI max, nettoyage trimestriel           | “Stop list” et archivage |

---

## FAQ – Objections fréquentes

- **“On va mesurer trop de choses.”** → Non : **6–8 KPI max**, chacun relié à un objectif et à un owner.  
- **“On n’a pas les données.”** → Commencer par des **sources automatiques** existantes ; documenter les limites ; améliorer ensuite.  
- **“Ça prend du temps.”** → **Rituel hebdo de 30 min** centré sur 3 écarts ; le gain vient des décisions plus rapides.

---

## Exemple concret

**Sans cadre KPI** : beaucoup de graphiques, peu d’actions ; les tickets augmentent, l’adoption stagne, les arbitrages dérivent au ressenti.  
**Avec cadre KPI** : 6 indicateurs clairs, data dictionary, revue hebdo ; en 8 semaines, **p95 démarrage −25 %**, **tickets “how-to” −18 %**, **licences inactives −60 %** ; décisions sponsorisées et traçables.

---

## En résumé

- **Peu de KPI, mais bons** : liés aux objectifs, mesurés automatiquement, actionnables.  
- **Gouvernance** : owner, cible, fréquence, revue courte, décisions tracées.  
- **Valeur** : arbitrer, prioriser, démontrer l’impact.

Besoin d’un cadrage rapide ou d’un tableau de bord orienté résultats ? **Contacte-moi** : [/MDS/index.html#contact](/MDS/index.html#contact).

---

## Références

- **Définition des KPI** : [Wikipédia — Indicateur clé de performance (fr)](https://fr.wikipedia.org/wiki/Indicateur_cl%C3%A9_de_performance) ; [Wikipedia — Key performance indicator (en)](https://en.wikipedia.org/wiki/Key_performance_indicator)  
- **Leading vs Lagging** : [Wikipedia — Leading and lagging indicators](https://en.wikipedia.org/wiki/Leading_and_lagging_indicators)  
- **Formulation SMART** : [Wikipedia — SMART criteria](https://en.wikipedia.org/wiki/SMART_criteria)
