# Architecture hybride Supabase — Prime Visual AI Studio

## Décision

Prime Visual AI Studio utilise **Supabase Auth** comme source prioritaire pour les sessions utilisateur et **Supabase Database** pour la lecture de l’abonnement actif. Le site n’utilise pas les buckets Supabase pour les images.

| Domaine | Système responsable | Frontière d’implémentation |
|---|---|---|
| Authentification | Supabase Auth | Le client conserve la session Supabase et transmet son bearer token à tRPC. Le contexte serveur valide le token, synchronise l’identité dans la table interne `users`, puis conserve les procédures protégées existantes. |
| Abonnements | Supabase Database | `subscription.current` lit l’abonnement actif dans `subscriptions` avec le JWT Supabase et les politiques RLS. En l’absence d’abonnement actif, le plan appliqué est `FREE`. |
| Crédits mensuels | Drizzle/MySQL actuel | Les compteurs `usage`, la consommation atomique et les limites opérationnelles restent dans la base métier actuelle. |
| Générations et templates | Drizzle/MySQL actuel | Les générations, templates, statuts et métadonnées restent inchangés. |
| Images originales et générées | Stockage géré actuel | `storagePut` reste utilisé pour les uploads originaux et les variantes générées. Les buckets Supabase `product-images` et `generated-images` ne sont donc pas requis pour ce flux. |
| Compatibilité | Manus OAuth | Le chemin Manus reste disponible uniquement comme repli pour les sessions existantes et les environnements non migrés. Supabase Auth est prioritaire lorsque le bearer token est présent. |

## Credentials

Le frontend et le serveur utilisent uniquement `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`, déjà configurés dans les secrets gérés du projet. Aucune clé `service_role`, secret key, mot de passe de base ou nouvelle infrastructure backend n’est nécessaire pour cette architecture.

## Limites connues

La lecture d’abonnement est migrée, mais l’encaissement et le changement de plan ne sont pas encore connectés à un fournisseur de paiement. Les crédits restent atomiques dans la base métier actuelle ; une migration ultérieure des crédits vers Supabase devrait être conçue comme une opération séparée afin de préserver l’intégrité et d’éviter deux sources concurrentes de vérité.

## Validation

Le typecheck et la suite Vitest passent. Les tests couvrent la validation d’un bearer token Supabase, le contexte serveur avec bearer valide/invalide, la lecture d’un abonnement actif sous contexte RLS simulé, la conservation de `storagePut` pour les images et l’absence de clé `service_role` dans le client.

La lecture d’un abonnement réel n’a pas pu être validée depuis le sandbox, car elle nécessite un JWT Supabase utilisateur et une ligne d’abonnement active dans le projet. Elle doit être vérifiée après la première connexion par lien magique et après la création d’une ligne `subscriptions` conforme aux politiques RLS.
