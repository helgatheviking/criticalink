<?php
/**
 * @package CriticaLink
 */

$title_key    = 'layout-' . ttfmake_get_view() . '-hide-title';
$title_option = (bool) get_theme_mod( $title_key, ttfmake_get_default( $title_key ) );
?>

<?php if ( get_the_title() && ( ! $title_option ) ) : ?>
<h1 class="entry-title">
	<?php the_title(); ?>
</h1>
<?php endif; ?>