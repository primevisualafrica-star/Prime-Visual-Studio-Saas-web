# Mapping du schéma — architecture hybride

## Principe

Supabase ne remplace pas toute la base métier dans cette architecture. Il fournit l’identité utilisateur et la source de vérité des abonnements. Les données nécessaires au fonctionnement du studio et les octets des images restent dans les services déjà utilisés par l’application.

| Entité actuelle | Système actuel | Entité Supabase correspondante | Statut dans l’architecture finale |
|---|---|---|---|
| `users` | Drizzle/MySQL | `auth.users` + `profiles` | Supabase Auth est la source de vérité de l’identité ; la ligne interne `users` est synchronisée pour préserver les procédures existantes. |
| `subscriptions` | Drizzle/MySQL historique | `public.subscriptions` | Supabase est la source de vérité du plan actif et de son statut. |
| `templates` | Drizzle/MySQL | Aucune migration requise | Table métier interne conservée pour les templates et les contrôles admin. |
| `generations` | Drizzle/MySQL | Aucune migration requise | Table métier interne conservée pour les statuts, métadonnées et liens de fichiers. |
| `usage` | Drizzle/MySQL | Aucune migration requise | Compteurs et consommation atomique conservés dans la base actuelle afin d’éviter deux sources concurrentes de vérité. |
| `generation_assets` | Drizzle/MySQL ou extension future | Optionnelle dans Supabase | Non requise tant que les métadonnées d’assets restent dans l’application actuelle. |
| `storage.objects` | Stockage géré actuel | `storage.objects` Supabase | Non utilisé pour les images dans l’architecture finale. Les buckets Supabase peuvent rester absents. |

## Tables Supabase obligatoires

La table système `auth.users` est créée et gérée par Supabase Auth. La table publique `profiles` est nécessaire si le script de migration est utilisé pour synchroniser les profils et les rôles. La table publique `subscriptions` est nécessaire pour que `subscription.current` puisse lire le plan sous RLS.

Les tables `templates`, `generations`, `usage` et `generation_assets` du script SQL complet sont des entités de référence pour une migration totale vers Supabase, mais elles sont **optionnelles dans l’architecture hybride actuelle** puisqu’elles restent gérées par Drizzle/MySQL. Les buckets `product-images` et `generated-images` ainsi que leurs politiques Storage sont également optionnels et non requis pour les uploads/générations actuels.

## Source de vérité des rôles

Le rôle applicatif opérationnel des procédures actuelles reste porté par la ligne interne `users.role`, car `adminProcedure` lit cette propriété dans le contexte tRPC. Pour une session Supabase, `auth.users.id` identifie l’utilisateur, `profiles.id` peut conserver le rôle déclaré dans Supabase, puis la synchronisation serveur hydrate la ligne interne `users` utilisée par les règles admin existantes. Le rôle ne doit jamais être accepté depuis des données envoyées par le navigateur.

Le premier administrateur doit être promu manuellement par un opérateur de confiance dans Supabase ou dans la base interne, après vérification de son UUID Supabase. Dans le script SQL fourni, la promotion initiale est volontairement commentée afin d’éviter d’attribuer par erreur les privilèges admin à un mauvais compte. Les fonctions et politiques RLS doivent continuer à refuser toute auto-promotion.

## Validation attendue

Après la première connexion par lien magique, vérifier qu’une ligne `profiles` existe, qu’une ligne interne `users` est synchronisée, que `subscription.current` renvoie `FREE` en l’absence d’abonnement actif et qu’une ligne `STARTER` ou `BUSINESS` n’est visible que par l’utilisateur concerné sous RLS. Les flux d’image ne doivent pas appeler Supabase Storage ; ils doivent continuer à utiliser `storagePut`.
