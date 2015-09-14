<?php
/**
 * @package Make
 */
?>

<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>

	<div class="entry-content">
		<?php remove_filter( 'the_content', 'wpautop' ); ?>
		<?php get_template_part( 'partials/entry', 'content' ); ?>
		<?php add_filter( 'the_content', 'wpautop' ); ?>
	</div>
</article>
