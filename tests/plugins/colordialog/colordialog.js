/* bender-tags: editor */
/* bender-ckeditor-plugins: colordialog,wysiwygarea,toolbar,colorbutton */

( function() {
	'use strict';

	bender.editor = true;

	bender.test( {
		assertColor: function( inputColor, outputColor ) {
			var editor = this.editor;

			editor.once( 'dialogShow', function( evt ) {
				var dialog = evt.data;
				dialog.setValueOf( 'picker', 'selectedColor', inputColor );
				dialog.getButton( 'ok' ).click();

			} );

			editor.getColorFromDialog( function( color ) {
				resume( function() {
					assert.areSame( outputColor, color );
				} );
			} );
			wait();
		},

		assertColorAtDialogShow: function( expectedColor, html, button ) {
			var editor = this.editor,
				bot = this.editorBot,
				toolbarButton = editor.ui.get( button );

			bot.setHtmlWithSelection( html );
			editor.once( 'dialogShow', function( evt ) {
				resume( function() {
					var dialog = evt.data,
						selectedColor = dialog.getValueOf( 'picker', 'selectedColor' );
					dialog.getButton( 'ok' ).click();
					assert.areSame( expectedColor, selectedColor );
				} );
			} );

			toolbarButton.click( editor );
			openColorDialog( toolbarButton );
		},

		'test colordialog add hash to color\'s values with 6 hexadecimal digits': function() {
			this.assertColor( '123456', '#123456' );
		},

		'test colordialog add hash to color\'s values with 3 hexadecimal digits': function() {
			this.assertColor( 'FDE', '#FDE' );
		},

		'test colordialog does not add hash to color value with 1 digit (incorrect css color value)': function() {
			// IE8 doesn't set incorrect values.
			if ( CKEDITOR.env.ie && CKEDITOR.env.version < 9 ) {
				assert.ignore();
			}
			this.assertColor( '1', '1' );
		},

		'test colordialog does not add hash to color name': function() {
			this.assertColor( 'red', 'red' );
		},

		'test colordialog does not add hash to rgb color value': function() {
			this.assertColor( 'rgb(10, 20, 30)', 'rgb(10, 20, 30)' );
		},

		'test colordialog does not add hash to empty value ': function() {
			this.assertColor( '', '' );
		},

		// (#2639)
		'test colordialog setting current text color on opening': function() {
			this.assertColorAtDialogShow( '#ff0000', '[<h1 style="color:#ff0000">Foo</h1>]', 'TextColor' );
		},

		// (#2639)
		'test colordialog setting current background color on opening': function() {
			this.assertColorAtDialogShow( '#0000ff', '[<h1 style="background:#0000ff">Foo</h1>]', 'BGColor' );
		},

		// (#2639)
		'test omitting default text color': function() {
			this.assertColorAtDialogShow( '', '[<h1>Foo</h1>]', 'TextColor' );
		},

		// (#2639)
		'test omitting default background color': function() {
			this.assertColorAtDialogShow( '', '[<h1>Foo</h1>]', 'BGColor' );
		}
	} );

	function openColorDialog( button ) {
		setTimeout( function() {
			button._.panel.getBlock( button._.id ).element.findOne( '.cke_colormore' ).$.click();
		}, 0 );

		wait();
	}

} )();
