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
