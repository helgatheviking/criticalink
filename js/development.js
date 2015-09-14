/*!
 * Script for initializing globally-used functions and libs.
 *
 * @since 1.0.0
 */
/* global jQuery, ttfmakeGlobal */
(function($, Make) {
	'use strict';

	var ttfmake = {
		/**
		 *
		 */
		cache: {},

		/**
		 *
		 */
		init: function() {
			this.cacheElements();
			this.bindEvents();
		},

		/**
		 *
		 */
		cacheElements: function() {
			this.cache = {
				$window: $(window),
				$document: $(document)
			};
		},

		/**
		 *
		 */
		bindEvents: function() {
			var self = this;

			self.cache.$document.ready(function() {
				self.navigationInit();
				self.skipLinkFocusFix();
				self.navigationHoverFix();
				self.fitVidsInit($('.ttfmake-embed-wrapper'), Make);
			} );

			// Infinite Scroll support
			self.cache.$document.on('post-load', function() {
				// FitVids
				var $elements = $('.ttfmake-embed-wrapper:not(:has(".fluid-width-video-wrapper"))');
				self.fitVidsInit($elements, Make);
			});

			self.cache.$window.on( 'resize', self.debounce( function() {
					$.sidr( 'close', 'offcanvas' );
				}
			) );

		},

		/**
		 * Initialize the mobile menu functionality.
		 *
		 * @since 1.1.0
		 *
		 * @return void
		 */
		navigationInit: function() {

			$('#menu-header').attr( 'aria-expanded', 'false' );


			// Add dropdown toggle to display child menu items
			$('#site-navigation .menu > .menu-item-has-children').append( '<span class="dropdown-toggle" />');

			// When mobile submenu is tapped/clicked
			$( "body" ).on( "click", ".sidr-class-dropdown-toggle", function() {
				var $menu_item = $(this).parent();
				$menu_item.find('.sidr-class-sub-menu').slideToggle( "fast", function() {
				    $menu_item.toggleClass('open');
				});
			});

			var sources = [];
			if ( $('#site-header').find( '#menu-header-container' ).length ) {
				sources[0] = '#menu-header-container';
			}
			if ( $('#site-header').find( '#menu-header-container' ).length ) {
				sources[0] = '#menu-header-container';
			}


			$( '.menu-toggle' ).sidr({
				name: 'offcanvas',
				source: sources.join(","),
				side : 'right',
				onOpen : function() {
					$(this).attr( 'aria-expanded', 'true' );
					$('#menu-header').attr( 'aria-expanded', 'true' );
					$('body').addClass( 'offcanvas-open-js' );
					$('.offcanvas-open-js #site-wrapper').on( 'click', function(){
						$.sidr( 'close', 'offcanvas' );
					});
				},
				onClose : function() {
					$('body').removeClass( 'offcanvas-open-js' );
					$(this).attr( 'aria-expanded', 'false' );
					$('#menu-header').attr( 'aria-expanded', 'false' );
				}
			});

		},

		/**
		 * Fix tab destination after 'Skip to content' link has been clicked.
		 *
		 * @since 1.0.0
		 *
		 * @return void
		 */
		skipLinkFocusFix: function() {
			var is_webkit = navigator.userAgent.toLowerCase().indexOf( 'webkit' ) > -1,
				is_opera  = navigator.userAgent.toLowerCase().indexOf( 'opera' )  > -1,
				is_ie     = navigator.userAgent.toLowerCase().indexOf( 'msie' )   > -1;

			if ( ( is_webkit || is_opera || is_ie ) && document.getElementById && window.addEventListener ) {
				window.addEventListener( 'hashchange', function() {
					var id = location.hash.substring( 1 ),
						element;

					if ( ! ( /^[A-z0-9_-]+$/.test( id ) ) ) {
						return;
					}

					element = document.getElementById( id );

					if ( element ) {
						if ( ! ( /^(?:a|select|input|button|textarea)$/i.test( element.tagName ) ) ) {
							element.tabIndex = -1;
						}

						element.focus();
					}
				}, false );
			}
		},

		/**
		 * Bind a click event to nav menu items with sub menus.
		 *
		 * Fixes an issue with the sub menus not appearing correctly in some situations on iPads.
		 *
		 * @link http://blog.travelvictoria.com.au/2012/03/31/make-sure-your-websites-drop-down-menus-work-on-an-ipad/
		 *
		 * @since
		 *
		 * @return void
		 */
		navigationHoverFix: function() {
			this.cache.$dropdown = this.cache.$dropdown || $('li:has(ul)', '#site-navigation');
			this.cache.$dropdown.on('click', function() {
				return true;
			});
		},

		/**
		 * Initialize FitVids.
		 *
		 * @since  1.0.0
		 *
		 * @return void
		 */
		fitVidsInit: function($elements, Make) {
			// Make sure lib is loaded.
			if (! $.fn.fitVids) {
				return;
			}

			var $container = $elements || $('.ttfmake-embed-wrapper'),
				selectors = Make.fitvids.selectors || '',
				args = {};

			// Get custom selectors
			if (selectors) {
				args.customSelector = selectors;
			}

			// Run FitVids
			$container.fitVids(args);

			// Fix padding issue with Blip.tv. Note that this *must* happen after Fitvids runs.
			// The selector finds the Blip.tv iFrame, then grabs the .fluid-width-video-wrapper div sibling.
			$container.find('.fluid-width-video-wrapper:nth-child(2)').css({ 'paddingTop': 0 });
		},

		/**
		 * Debounce function.
		 *
		 * @since  1.0.0
		 * @link http://remysharp.com/2010/07/21/throttling-function-calls
		 *
		 * @return void
		 */
		debounce: function(fn, delay) {
			var timer = null;
			return function () {
				var context = this, args = arguments;
				clearTimeout(timer);
				timer = setTimeout(function () {
					fn.apply(context, args);
				}, delay);
			};
		}

	};

	ttfmake.init();

})(jQuery, ttfmakeGlobal);
