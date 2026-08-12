# Diagnostic visibilité du pied de page

Les vérifications desktop (1280 px) et mobile (390 px) montrent que le composant `<footer>` est bien rendu après le CTA final, mais il est visuellement trop discret : il partage presque le même fond beige que la page, utilise une bordure très faible et un texte à faible opacité. Sur mobile, sa hauteur est très réduite et il ressemble à une ligne de mentions légales au bord inférieur plutôt qu’à un pied de page identifiable.

La correction retenue est de conserver le contenu français existant tout en donnant au pied de page une surface sombre cohérente avec le hero, une séparation claire, une hauteur minimale, un espacement responsive et un texte à contraste renforcé. Le layout doit rester fluide afin d’éviter tout débordement horizontal sur 390 px.
