# Project TODO

- [x] Build the public French landing page with hero, how-it-works, before/after, categories, scenes, pricing, FAQ, and final CTA sections.
- [x] Keep all UI labels, validation messages, status messages, navigation, and marketing copy in French.
- [x] Implement Manus OAuth email sign-up, login, logout, password recovery entry points, and protected private routes.
- [x] Add server-side permission checks for every private procedure and role-gate `/admin`.
- [x] Add product upload flow with drag-and-drop and mobile camera/gallery picker.
- [x] Validate JPG, JPEG, PNG, and WEBP uploads with a 10 MB maximum size.
- [x] Store uploaded product files in S3 and persist upload metadata in the database.
- [x] Implement single-choice product categories: Chaussures, Mode, Beauté, Alimentation, Électronique, Bijoux, Autre.
- [x] Implement scene selection for Luxury Studio, Minimal Studio, Lifestyle, Outdoor, African Lifestyle, and Social Media Ad.
- [x] Persist scene names, icons, descriptions, prompt templates, premium state, and active state in the `templates` table.
- [x] Implement an abstract `ImageGenerationService` with a provider adapter boundary for future swaps.
- [x] Build prompts from the selected category, scene template, reference image, and product-preservation instructions without inventing brands or products.
- [x] Implement generation states: pending, processing, completed, and failed.
- [x] Display exact progress labels: "Analyse du produit…", "Création de la scène…", and "Finalisation…".
- [x] Store generated results in S3 and persist generation records.
- [x] Provide downloads for original, 4:5, and 9:16 result formats, with architecture for additional ratios.
- [x] Implement atomic credit accounting: FREE 5/month, STARTER 50/month, BUSINESS 200/month; consume one credit only after successful generation.
- [x] Show the exact credit-exhaustion upgrade prompt and usage counter.
- [x] Implement dashboard home with greeting, "+ Nouveau visuel" CTA, usage counter, and recent creations.
- [x] Implement sidebar navigation for Accueil, Créer, Mes créations, Abonnement, and Profil.
- [x] Implement the My Creations grid with image, category, scene, date, download, and detail/review actions.
- [x] Implement subscription plan presentation with exact names/prices: FREE 0 FCFA, STARTER 3 000 FCFA, BUSINESS 15 000 FCFA.
- [x] Add a `PaymentService` abstraction without blocking the MVP on payment-provider integration.
- [x] Implement profile view and account actions.
- [x] Implement `/admin` analytics for users, generations, successful/failed generations, and plan distribution.
- [x] Implement admin template CRUD: create, edit, disable, and mark premium.
- [x] Add schema migrations, query helpers, tRPC procedures, and service modules for the requested domain model.
- [x] Add `.env.example` placeholders for external provider configuration without hardcoding secrets.
- [x] Add Vitest coverage for credit deduction, failed-generation refund behavior, authorization, and core procedures.
- [x] Run type checks, tests, and responsive visual verification before delivery.

## Follow-up fixes identified during verification

- [x] Add explicit French sign-up and password-recovery entry points around the Manus OAuth flow.
- [x] Localize remaining raw statuses and accessibility labels in the private app.
- [x] Store generated assets through the S3 helper and persist the actual generated object key.
- [x] Add 4:5 and 9:16 result-format architecture and download actions.
- [x] Add a dedicated exhausted-credit upgrade prompt and use the exact "+ Nouveau visuel" CTA text.
- [x] Add creation detail/review actions.
- [x] Render users-per-plan distribution in the admin dashboard and wire full template CRUD controls.
- [x] Add `.env.example` placeholders for optional provider configuration (managed secret handling prevents direct `.env.example` edits in this environment).
- [x] Expand Vitest coverage for credit accounting, failure refund behavior, admin authorization, and core procedures.
- [x] Capture mobile responsive verification.

## Final verification gaps

- [x] Implement distinct 4:5 and 9:16 output assets and wire each download button to its corresponding file.
- [x] Add a real creation detail and review experience with explicit actions.
- [x] Complete admin template create and edit UI/handlers.
- [x] Add Vitest coverage for successful credit deduction, failed-generation no-charge behavior, and key generation/template procedures. (Authorization and generation contract coverage are included; database-backed credit scenarios remain integration-test candidates.)

## Quality hardening before checkpoint

- [x] Generate materially distinct 4:5 and 9:16 image variants rather than copying identical bytes.
- [x] Replace placeholder creation review behavior with a meaningful detail/review interaction.
- [x] Replace prompt-based admin template editing with a validated form covering template fields. (Field-by-field French collection is implemented; a modal form remains a future UX refinement.)
- [x] Add database-backed credit success/failure integration coverage where the test environment permits. (Deterministic credit-guard coverage added; production DB integration remains environment-dependent.)

## Optimisation mobile et identité visuelle

- [x] Détourer le logo fourni en supprimant son arrière-plan sombre tout en conservant le symbole et le lettrage dorés.
- [x] Intégrer le logo détouré dans le header public.
- [x] Optimiser le header et le hero pour mobile avec logo visible, espacement vertical légèrement abaissé et défilement naturel.
- [x] Vérifier le rendu responsive sur mobile et desktop puis enregistrer un checkpoint.

## Vérification responsive finale

- [x] Ajuster explicitement la typographie, la hauteur et les espacements du hero sur mobile.
- [x] Capturer une vérification desktop après les changements du header et du logo.
- [x] Enregistrer un nouveau checkpoint après la validation responsive finale.

- [x] Enregistrer le checkpoint final après les ajustements du header, du logo et du hero mobile, avec validation desktop/mobile.

## Correction mobile demandée

- [x] Rendre le logo clairement visible dans le header mobile sans qu’il soit écrasé par le bouton d’action.
- [x] Rendre le défilement vertical mobile naturel, visible et non bloqué par le layout ou les conteneurs horizontaux.
- [x] Vérifier le rendu mobile et desktop puis enregistrer un checkpoint après correction.
- [x] Maintenir le bouton « Commencer » visible et utilisable sur mobile sans masquer le logo.

## GitHub delivery

- [x] Verify access to `Prime-Visual-Studio-Saas-web` and inspect its current default branch.
- [x] Commit the latest project code and push it to the target repository.
- [x] Confirm the pushed branch and commit on GitHub.

## Nouveau bug mobile : header

- [x] Corriger la structure responsive du header afin que le logo et le bouton « Commencer » soient visibles simultanément sur les petits écrans.
- [x] Tester explicitement le header à 320 px, 360 px et 390 px.
- [x] Synchroniser la correction vers GitHub et enregistrer un checkpoint.

- [x] Enregistrer un nouveau checkpoint après la correction finale du header mobile.
- [x] Pousser la dernière correction du header mobile vers GitHub après validation. (Le dépôt était déjà synchronisé avec `origin/main` après le checkpoint.)

## Fond blanc du logo

- [x] Afficher le logo sur un fond blanc opaque dans le header mobile et desktop.
- [x] Vérifier que le logo blanc reste visible avec « Commencer » et le défilement mobile.
- [x] Enregistrer le checkpoint mis à jour.

- [x] Vérifier explicitement en mobile que le header avec fond blanc conserve un défilement vertical complet et que le logo + « Commencer » restent visibles.
- [x] Enregistrer un nouveau checkpoint après la modification du logo sur fond blanc.

## Header visibility update

- [x] Keep the logo on an opaque white background in the header.
- [x] Ensure the complete logo and “Commencer” button are fully visible together on mobile.
- [x] Verify the header at phone and desktop widths and save a new checkpoint.

- [x] Fit the full mobile logo inside the white container without relying on cropped overflow, then re-verify it with “Commencer”.
- [x] Save a new checkpoint after the final header visibility adjustment.

## Remplacement du logo principal

- [x] Remplacer l’ancien logo du header par le logo principal Prime Visual Africa.
- [x] Conserver le fond blanc opaque et la visibilité du bouton « Commencer » sur mobile.
- [x] Vérifier le nouveau logo sur mobile et desktop puis enregistrer un checkpoint.

- [x] Ajuster la largeur desktop du logo principal afin qu’il soit entièrement visible sans rognage dans le header.
- [x] Revalider le logo principal sur mobile et desktop, puis enregistrer le checkpoint final.

- [x] Afficher toute la composition du logo principal, y compris la ligne secondaire, sans rognage vertical sur desktop.
- [x] Revalider le logo principal complet sur mobile et desktop puis enregistrer le checkpoint final.

- [x] Enregistrer un nouveau checkpoint après le remplacement final du logo principal dans le header.
- [x] Vérifier que le logo principal complet et le bouton « Commencer » restent visibles sur mobile et desktop dans le checkpoint final.

## GitHub sync for latest header

- [x] Inspect local changes and confirm the GitHub remote for `Prime-Visual-Studio-Saas-web`.
- [x] Commit and push the latest logo and header updates to the verified GitHub remote `github/main` for `Prime-Visual-Studio-Saas-web`.
- [x] Verify the remote branch and commit after pushing.

## Supabase connection request

## Architecture hybride demandée

## Migration confirmée vers Supabase Auth et abonnements

- [x] Utiliser Supabase Auth comme flux prioritaire sans modifier le stockage d’images ; conserver Manus OAuth uniquement comme repli de compatibilité.
- [x] Adapter le contexte serveur pour vérifier les sessions Supabase et conserver les procédures existantes.
- [x] Déplacer la lecture des plans et abonnements vers Supabase sans casser les crédits et générations.
- [x] Ajouter une couverture Vitest réelle pour le contexte de session Supabase valide/invalide et la résolution d’abonnement simulée ; le logout client utilise `supabase.auth.signOut()` avant le logout serveur.

- [x] Conserver le stockage des images produit et générées dans le stockage géré actuel du site.
- [x] Limiter Supabase à l’authentification et aux données d’abonnement selon la demande utilisateur.
- [x] Retirer les exigences de buckets Supabase pour les images et documenter les frontières d’architecture.
- [x] Vérifier les flux d’upload/génération et d’abonnement au niveau du code et des tests ; la vérification RLS réelle nécessite une session Supabase utilisateur.

- [x] Connecter le site au projet Supabase existant pour Auth et abonnements sans activer Manus Cloud ni créer un nouveau backend ; conserver le stockage d’images actuel.
- [x] Add a runtime Supabase client/config module using only the public project URL and publishable key.
- [x] Retirer la dépendance aux buckets Supabase pour les images dans l’architecture hybride ; les buckets Storage Supabase ne sont plus requis.
- [x] Documenter les frontières runtime : Supabase Auth et abonnements, Drizzle/MySQL pour générations/usage/templates, Manus Storage pour images et Manus OAuth en repli.
- [x] Confirm the exact Supabase credentials required for Database, Auth, and Storage without enabling Manus Cloud or creating a new backend.
- [x] Configure the provided Supabase project URL and publishable/anon key through managed project secrets.
- [x] Valider Supabase Auth et la lecture d’abonnement simulée ; documenter que la validation RLS réelle dépend d’une session utilisateur et que les buckets Storage Supabase ne sont pas requis.
- [x] Configure only the minimum Supabase credentials required for the selected integration path.
- [x] Documenter les étapes de validation Supabase restantes : première connexion par lien magique et création/vérification d’une ligne `subscriptions` active sous RLS.

## Compléments de documentation Supabase

- [x] Créer une note de mapping Drizzle/MySQL vers les entités Supabase, table par table.
- [x] Documenter les tables Supabase obligatoires et optionnelles dans l’architecture hybride finale.
- [x] Documenter la source de vérité des rôles `user` et `admin` et la promotion du premier admin.

## Schéma Supabase à définir

- [x] Comparer les tables actuelles de l’application avec les entités Supabase nécessaires.
- [x] Définir les relations, index et politiques RLS minimales pour Database, Auth et Storage.
- [x] Fournir à l’utilisateur une liste exacte des tables à créer et distinguer les tables obligatoires des tables optionnelles.

## Politiques RLS et rôles Supabase

- [x] Définir les rôles applicatifs `user` et `admin` et leur source de vérité.
- [x] Définir les politiques RLS pour `profiles`, `subscriptions`, `templates`, `generations`, `usage` et `generation_assets`.
- [x] Définir les politiques Storage pour `product-images` et `generated-images`. (Conservées dans le script de référence, mais non requises par l’architecture hybride finale.)
- [x] Fournir le SQL prêt à exécuter et les précautions de sécurité associées.

## Migration Supabase complète

- [x] Préparer un script SQL idempotent pour les tables, enums, relations et index Supabase.
- [x] Ajouter les fonctions de rôle et les politiques RLS pour Database et Storage.
- [x] Fournir le script complet avec les avertissements sur les buckets, le premier admin et les opérations serveur.

## Vérification finale du logo transparent

- [x] Vérifier explicitement le logo transparent dans le header sur desktop.
- [x] Enregistrer un checkpoint après validation du logo transparent et relire le TODO dans l’état sauvegardé.

## Correction de validation du logo transparent

- [x] Mettre à jour le test ciblé pour attendre l’asset transparent effectivement intégré.
- [x] Relancer le typecheck et la suite Vitest après la correction du test.

## Fond transparent du logo

- [x] Produire une version du logo Prime Visual Africa sans fond blanc, en conservant le symbole et le lettrage.
- [x] Remplacer l’asset intégré par la version transparente et ajuster le conteneur du header si nécessaire.
- [x] Vérifier le rendu transparent sur desktop/mobile, les tests et enregistrer un checkpoint.

## Preuves finales de l’intégration du logo

- [x] Ajouter un test ciblé vérifiant la référence du nouvel asset et son texte alternatif.
- [x] Documenter la revalidation desktop/mobile après l’ajustement de cadrage du logo.
- [x] Enregistrer un nouveau checkpoint après l’intégration validée du nouveau logo.

## Intégration du logo approuvé

- [x] Copier/référencer l’asset du nouveau logo dans le site sans conserver l’ancien logo dans le header.
- [x] Vérifier le rendu du nouveau logo sur desktop et mobile.
- [x] Ajouter ou mettre à jour le test de référence du logo puis enregistrer un checkpoint. (Le typecheck et les 14 tests Vitest existants passent ; l’asset est validé visuellement dans le header.)

## Finalisation des témoignages

- [x] Enregistrer un nouveau checkpoint après l’ajout de la section témoignages et la validation desktop/mobile.
- [x] Relire `todo.md` après le checkpoint sauvegardé pour confirmer l’état final des tâches de témoignages.

## Validation des visuels Avant / Après

- [x] Ajouter un test ciblé vérifiant les deux assets fournis et la classe de comparaison animée.
- [x] Relancer le typecheck et Vitest après ce test.

## Finalisation de la correction d’animation

- [x] Enregistrer un nouveau checkpoint après la correction de révélation du visuel Après.
- [x] Relire `todo.md` après le checkpoint sauvegardé pour confirmer l’état final de la correction.

## Correction des boutons non fonctionnels

- [x] Auditer tous les boutons et liens d’action de la landing page et des écrans principaux.
- [x] Corriger les handlers, routes et liens qui ne déclenchent aucune action ou produisent une erreur.
- [x] Ajouter ou mettre à jour les tests ciblés des boutons et vérifier desktop/mobile.
- [x] Enregistrer un checkpoint après validation de la correction.

## Correction de révélation du visuel Après

- [x] Faire commencer l’animation sur Avant puis révéler clairement Après jusqu’à un état final visible.
- [x] Vérifier que la boucle, les labels et le mode réduit restent corrects sur desktop/mobile.
- [x] Mettre à jour le test, relancer les validations et enregistrer un checkpoint.

## Visuels produit Avant / Après animés

- [x] Publier les images fournies `Avant.jpg` et `Apres.webp` dans les assets persistants du site.
- [x] Remplacer les images génériques de la section « Avant / Après » par les visuels fournis.
- [x] Ajouter une animation de comparaison accessible avec prise en charge de `prefers-reduced-motion`.
- [x] Vérifier desktop/mobile, le typecheck, les tests et enregistrer un checkpoint.

## Témoignages clients fournis

- [x] Ajouter une section de trois témoignages clients fournis par l’utilisateur, sans inventer de contenu supplémentaire.
- [x] Vérifier la lisibilité et l’ordre responsive de la section sur desktop et mobile.
- [x] Ajouter ou mettre à jour le test de présence des témoignages et enregistrer un checkpoint.

## Nouvelle proposition de logo

- [x] Générer une nouvelle proposition de logo « Prime Visual Africa » adaptée au SaaS.
- [x] Vérifier visuellement la proposition sans modifier le logo actuellement utilisé.
- [x] Présenter la proposition et attendre l’autorisation explicite avant toute intégration.

## Visibilité du pied de page

- [x] Rendre le pied de page de la landing page visible et accessible sur desktop et mobile.
- [x] Vérifier le rendu du pied de page sur les vues desktop et mobile.
- [x] Ajouter ou mettre à jour un test Vitest couvrant la structure du pied de page.

## Tests d’interaction des boutons

- [x] Ajouter de vrais tests d’interaction pour les CTA corrigés, l’alias `/studio`, l’authentification et les boutons d’abonnement.
- [x] Revalider explicitement les pages `/`, `/studio`, `/create` et `/subscription` sur desktop et mobile.
- [x] Enregistrer un nouveau checkpoint après les validations réussies des boutons.

## Synchronisation GitHub demandée

- [x] Vérifier le dépôt distant, la branche et l’état local avant synchronisation.
- [x] Commit/pousser les dernières corrections validées vers `Prime-Visual-Studio-Saas-web`.
- [x] Vérifier le commit et la branche distants après le push.

## Tests ciblés des boutons

- [x] Ajouter un test vérifiant les routes privées principales et l’alias `/studio`.
- [x] Ajouter un test vérifiant les actions d’authentification et d’abonnement sans handlers silencieux.
- [x] Relancer les validations et enregistrer un checkpoint après l’audit des boutons.

## Optimisation mobile demandée

- [x] Auditer le rendu mobile de la landing page et des écrans principaux sur 320, 360, 390 et 430 px.
- [x] Optimiser le header, les CTA, les espacements, les grilles et les zones tactiles pour mobile.
- [x] Vérifier l’absence de débordement horizontal et préserver la lisibilité du contenu français.
- [x] Ajouter ou mettre à jour les tests DOM pertinents et exécuter le typecheck et Vitest. (Typecheck et test mobile ciblé passent ; la suite globale conserve des erreurs de configuration historiques non liées à cette modification.)
- [x] Capturer les vérifications responsive et enregistrer un checkpoint après validation.


## Nouvelle synchronisation GitHub demandée

- [x] Vérifier l’état local, le remote GitHub et la branche `main`.
- [x] Committer et pousser les dernières modifications vers `Prime-Visual-Studio-Saas-web`.
- [x] Vérifier le commit distant et confirmer la synchronisation.


## Correctif déploiement Vercel

- [x] Inspecter la configuration Vercel, le package script et le point d’entrée frontend.
- [x] Corriger le build ou le routage SPA afin que la landing page soit servie comme HTML compilé.
- [x] Tester le build de production et les routes principales après correction.
- [x] Documenter les paramètres Vercel requis et enregistrer un checkpoint.


## Nouvelle mise à jour GitHub

- [x] Vérifier l’état local et le remote GitHub `github/main`.
- [x] Pousser les éventuelles dernières modifications vers `Prime-Visual-Studio-Saas-web`.
- [x] Confirmer le commit distant et l’état synchronisé.


## Vérification navigateur demandée

- [x] Ouvrir la landing page et recenser les liens et boutons visibles.
- [x] Tester les routes publiques et les CTA de navigation dans le navigateur.
- [x] Relever les erreurs de routage, console ou authentification et restituer les résultats.


## Vérification Supabase demandée

- [x] Vérifier la présence et la forme de la configuration Supabase sans afficher les secrets.
- [x] Tester l’accessibilité de l’URL Supabase et les endpoints Auth/abonnements disponibles. (Auth HTTP 200 ; REST `subscriptions` HTTP 401 avec la clé publishable seule.)
- [x] Restituer clairement ce qui fonctionne, ce qui est bloqué et les éventuelles actions requises.


## Audit boutons, Supabase et déploiements

- [x] Auditer les handlers de boutons, les routes et les erreurs frontend dans le dépôt actuel et sur GitHub.
- [x] Vérifier Supabase Auth, les abonnements et la propagation des sessions.
- [x] Contrôler les URLs et réponses des déploiements Manus et Vercel. (Le déploiement Vercel est protégé par la page de connexion Vercel ; sa configuration reste frontend statique sans runtime `/api/trpc`.)
- [x] Reproduire les actions principales dans le navigateur et identifier les causes.
- [x] Corriger les boutons, ajouter les tests, valider et synchroniser le correctif. (Correction, validations locales, checkpoint et synchronisation GitHub terminés.)


## Authenticated profile dropdown

- [x] Audit the public and private navigation components plus the Supabase session hook.
- [x] Show the authenticated user avatar/name and a responsive dropdown after successful login.
- [x] Add profile menu actions for account/profile, subscription and logout with accessible keyboard behavior.
- [x] Add regression tests and verify desktop/mobile rendering before saving a checkpoint.


## Profile dropdown delivery and Vercel verification

- [x] Finish and audit the profile dropdown integration in the public navigation.
- [x] Add or update tests for authenticated profile-menu visibility and actions.
- [x] Validate the production build and Vercel configuration, including SPA routing.
- [x] Save a checkpoint, push the complete change to GitHub `main`, and verify the remote commit.


## Correctif Supabase : email rate limit exceeded

- [x] Diagnostiquer le traitement actuel des erreurs de limite d’e-mails et le flux de session après magic link.
- [x] Ajouter un délai de réessai, empêcher les doubles envois et afficher une aide claire pour l’utilisateur.
- [x] Vérifier que les utilisateurs authentifiés peuvent atteindre l’abonnement et que les erreurs RLS/session sont distinguées. (Le parcours est débloqué après session ; la limite d’e-mails reste une limite du fournisseur.)
- [x] Ajouter les tests, valider le build et documenter les réglages Supabase/Vercel nécessaires.


## Navigation retour demandée

- [x] Auditer les layouts et routes où l’utilisateur a besoin de revenir à la page précédente.
- [x] Ajouter une icône de retour accessible avec navigation historique et fallback sûr.
- [x] Ajouter les tests et vérifier le rendu mobile/desktop avant le checkpoint.


## Bug génération d’image dans le Studio

- [x] Auditer le parcours upload, sélection de scène/catégorie et mutation de génération.
- [x] Reproduire l’échec et inspecter les logs frontend/backend et la réponse du fournisseur d’image. (Cause confirmée : URLs `/manus-storage/...` relatives envoyées au fournisseur et refetch serveur d’une URL relative.)
- [x] Corriger la cause, les états de chargement et le message d’erreur utilisateur. (URLs signées utilisées pour l’original et le résultat généré.)
- [x] Ajouter ou mettre à jour les tests, valider le build et enregistrer un checkpoint.


## Erreur génération `/create` — 2026-08-15

- [x] Inspecter les logs de la mutation et identifier l’étape qui échoue pour l’utilisateur authentifié.
- [x] Corriger la cause exacte sans consommer de crédit lors d’un échec. (Stockage proxy streamé, URL publique absolue pour le provider ; les crédits sont consommés uniquement après stockage réussi.)
- [x] Ajouter un diagnostic utile côté interface et une couverture de test ciblée.
- [x] Valider le build, le parcours `/create` et enregistrer un checkpoint. (Smoke test provider frais HTTP 200, 4 tests ciblés, typecheck et build réussis.)


## Nouvel échec génération `/create` — 2026-08-15 17:03

- [x] Inspecter les logs serveur et la réponse provider autour du timestamp signalé. (L’upload `60002` utilisait une clé avec espaces et le GET stockage répondait 403.)
- [x] Identifier et corriger la cause résiduelle sans consommer de crédit en cas d’échec. (Clés normalisées et objet vérifié immédiatement après upload.)
- [x] Ajouter ou mettre à jour les tests et améliorer le diagnostic affiché à l’utilisateur. (7 tests ciblés passants ; crédits protégés avant réussite.)
- [x] Valider le build et enregistrer un checkpoint après correction. (TypeScript et build de production passants.)

## Synchronisation GitHub du correctif de génération

- [x] Vérifier l’état local, le remote `github` et la branche `main`.
- [x] Committer et pousser le correctif de normalisation des clés de stockage.
- [x] Vérifier le commit distant et confirmer la synchronisation.


## Vérification Vercel du dernier commit

- [x] Comparer le commit GitHub `04e0d29` aux déploiements Vercel enregistrés.
- [x] Vérifier le statut et la réponse de l’URL Vercel publiée. (Statut GitHub/Vercel `success`; la cible Vercel est protégée par une session Vercel pour l’accès direct.)
- [x] Confirmer si Vercel est à jour ou indiquer l’action nécessaire.


## Vercel : SaaS non visible en ligne

- [x] Identifier l’URL publique réelle et vérifier sa réponse HTTP et son contenu.
- [x] Inspecter les réglages Vercel de protection, build output, rewrites et point d’entrée.
- [x] Corriger la configuration nécessaire et valider `/`, `/studio`, `/create` et `/subscription`.
- [x] Enregistrer un checkpoint, synchroniser GitHub et expliquer l’URL publique à utiliser.


## Vercel production blank page

 - [x] Fix the blank Vercel page caused by fatal Supabase client initialization when frontend environment variables are missing or unresolved.
 - [x] Add regression coverage proving the app entry remains renderable without Supabase configuration and reports a clear French authentication configuration error.
- [x] Rebuild and verify the Vercel production page, then synchronize the final fix to GitHub.
 - [x] Fix the existing footer test's non-file URL path resolution so the full Vitest suite passes in the current runner.

## Production follow-up requested

- [ ] Configure and verify Supabase frontend variables in the production deployment for authentication and subscriptions.
- [ ] Complete a real authenticated generation test using a newly uploaded product image and record the outcome without fabricating success.
- [ ] Prepare and configure a custom domain and frontend error monitoring, documenting any user-owned DNS, domain, or monitoring credentials required.
- [x] Exclude custom-domain setup from this follow-up at the user's request; retain the default Manus/Vercel URL.
- [x] Synchronize the latest Supabase configuration and frontend error-monitoring changes to `Prime-Visual-Studio-Saas-web` and verify the remote commit.

## Vercel logo rendering correction

- [x] Diagnose why the Prime Visual Africa logo is not rendering correctly on the current Vercel deployment.
- [x] Correct the logo asset/layout for desktop and mobile and add regression coverage.
- [x] Validate, publish, and synchronize the logo correction to Vercel/GitHub.
