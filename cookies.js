(function()
{

	// Register the class
	this.cookieBanner = function()
	{
		// Define the default settings
		let defaults = {
			cookieName : 'hasConsent', 
			cookieTimeout : 14, // Number of days
			forceDecision : true, 
			privacyPage : "cookie-policy", 
			showCookieIcon : false, 
			debug : false, 
		};

		// Update the settings
		this.settings = (arguments[0] && typeof arguments[0] === 'object') ? extendDefaults(defaults, arguments[0]) : defaults;
		
		// Start the plugin
		this.init();
	}


	cookieBanner.prototype = {

		// Initialise the plugin
		init : function() {

			// Check for bots and do not show if detected
			var bots = /bot|crawler|spider|crawling/i;
			var isBot = bots.test( navigator.userAgent );
			if ( isBot ) {
				return false;
			}

			// Set the click listeners early
			this.clickListeners();

			// User has already set their consent to use cookies
			if ( this.hasConsent('true') || this.hasConsent('false') ) {
				this.updateStatus();
				this.showCookieIcon();
				return false;
			}

			// If we are not forcing a decision then assume constent and set the cookie until the user sets otherwise
			if ( !this.settings.forceDecision && !this.hasConsent('assumed') ) {
				this.setCookie( this.settings.cookieName, "assumed" );
			}
			
			// Update the debug
			this.updateStatus();

			// Otherwise run the banner
			this.showBanner();

			// Do not show the underlay if on the cookies information page
			var slug = location.pathname;
			if ( slug.indexOf( this.settings.privacyPage ) == -1 ) {
				this.showUnderlay();
			}
		},

		// Display the preferences
		showCookieIcon: function () {

			if ( !this.settings.showCookieIcon ) return;

			// Build the banner html
			var html = '';
			html += '<a href="#" class="ccprefs-trigger">';
			html += '<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 72.5 72.5" enable-background="new 0 0 72.5 72.5" xml:space="preserve"><title>Cookie Control Icon</title><g id="triangle"><path d="M0,0l72.5,72.5H0V0z"></path></g><g id="star"><path d="M33.2,51.9l-3.9-2.6l1.6-4.4l-4.7,0.2L25,40.6l-3.7,2.9l-3.7-2.9l-1.2,4.5l-4.7-0.2l1.6,4.4l-3.9,2.6l3.9,2.6l-1.6,4.4l4.7-0.2l1.2,4.5l3.7-2.9l3.7,2.9l1.2-4.5l4.7,0.2l-1.6-4.4L33.2,51.9z M24.6,55.3c-0.3,0.4-0.8,0.8-1.3,1s-1.1,0.3-1.9,0.3c-0.9,0-1.7-0.1-2.3-0.4s-1.1-0.7-1.5-1.4c-0.4-0.7-0.6-1.6-0.6-2.6c0-1.4,0.4-2.5,1.1-3.3c0.8-0.8,1.8-1.1,3.2-1.1c1.1,0,1.9,0.2,2.6,0.7s1.1,1.1,1.4,2L23,50.9c-0.1-0.3-0.2-0.5-0.3-0.6c-0.1-0.2-0.3-0.4-0.5-0.5s-0.5-0.2-0.7-0.2c-0.6,0-1.1,0.2-1.4,0.7c-0.2,0.4-0.4,0.9-0.4,1.7c0,1,0.1,1.6,0.4,2c0.3,0.4,0.7,0.5,1.2,0.5c0.5,0,0.9-0.1,1.2-0.4s0.4-0.7,0.6-1.2l2.3,0.7C25.2,54.3,25,54.8,24.6,55.3z"></path></g></svg>';
			html += '</a>';

			// Output to the current location in the DOM
			var node = document.createElement('div');
			node.className = 'ccicon';
			node.innerHTML = html;
			document.body.appendChild(node);
		}, 

		// Display the preferences
		showPreferences: function () {

			// Build the banner html
			var html = '';
			html += '<div class="ccprefs-wrapper">';
			html += '<div class="ccprefs-content">';
			html += '<p class="ccprefs-title">Cookie preferences</p>';
			html += '<p class="ccprefs-message">Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>';
			html += '<a href="#" class="ccprefs-close" id="ccprefs-close">Close</a>';
			html += '</div>';
			html += '<div class="ccprefs-option">';
			html += '<div class="ccprefs-select"><input type="checkbox" name="" checked="checked" disabled></div>';
			html += '<div class="ccprefs-definition">';
			html += '<p class="ccprefs-subtitle">Essential Cookies</p>';
			html += '<p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>';
			html += '</div>';
			html += '</div>';
			html += '<div class="ccprefs-option">';
			html += '<div class="ccprefs-select"><input type="checkbox" name="" id="ccprefs-thirdparty"></div>';
			html += '<div class="ccprefs-definition">';
			html += '<label for="ccprefs-thirdparty"><p class="ccprefs-subtitle">3rd Party Cookies</p>';
			html += '<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p></label>';
			html += '</div>';
			html += '</div>';
			html += '<div class="ccprefs-actions">';
			html += '<ul>';';';
			html += '<li class="ccprefs-button ccprefs-button--confirm"><a href="#" id="ccprefs-button--confirm">Confirm your choices</a></li>';
			html += '<li class="ccprefs-button ccprefs-button--accept"><a href="#" id="ccprefs-button--accept">Accept All</a></li>';
			html += '</ul>';
			html += '</div>';
			html += '</div>';

			// Output to the current location in the DOM
			var node = document.createElement('div');
			node.className = 'ccprefs';
			node.innerHTML = html;
			document.body.appendChild(node);

			// Update the third party checkbox based on previous choice
			if ( this.hasConsent('true') ) {
				document.getElementById("ccprefs-thirdparty").checked = true;
			} else {
				document.getElementById("ccprefs-thirdparty").checked = false;
			}
		},

		removePreferences: function () {
			var element = document.getElementsByClassName('ccprefs');
			element[0].parentNode.removeChild( element[0] );
		},

		// Display the banner
		showBanner: function () {

			// Build the banner html
			var html = '';
			html += '<div class="ccbanner-wrapper">';
			html += '<div class="ccbanner-content">';
			html += '<p class="ccbanner-title">Cookies</p>';
			html += '<p class="ccbanner-message">We’d like to collect data from your device while you use this website. This helps give you the best experience. Choose ‘Accept all’ to agree we can collect your data in this way, or for more options choose ‘Preferences’. Find out more: <a href="/privacy-policy/">cookie policy</a></p>';
			html += '</div>';
			html += '<div class="ccbanner-actions">';
			html += '<ul>';
			html += '<li class="ccbanner-button ccbanner-button--preferences"><a href="#" id="ccbanner-button--preferences">Preferences</a></li>';
			html += '<li class="ccbanner-button ccbanner-button--accept"><a href="#" id="ccbanner-button--accept">Accept All</a></li>';
			html += '</ul>';
			html += '</div>';
			html += '</div>';

			// Output to the current location in the DOM
			var node = document.createElement('div');
			node.className = 'ccbanner';
			node.innerHTML = html;
			document.body.appendChild(node);
		},

		removeBanner: function () {
			var element = document.getElementsByClassName('ccbanner');
			element[0].parentNode.removeChild( element[0] );
		},

		// Display the underlay
		showUnderlay: function () {

			if ( !this.settings.forceDecision ) return;

			// Output to the current location in the DOM
			var node = document.createElement('div');
			node.className = 'ccunderlay';
			node.classList.add("ccunderlay--frosted");
			document.body.appendChild(node);
		},

		removeUnderlay: function () {

			if ( !this.settings.forceDecision ) return;

			var element = document.getElementsByClassName('ccunderlay');
			element[0].parentNode.removeChild( element[0] );
		},

		// General click listener factory
		clickListeners: function () {
			var _this = this;

			document.body.addEventListener( 'click', function ( event ) {

				// Accept all button
				if( event.target.id == 'ccbanner-button--accept' ) {
					event.preventDefault();
					_this.setCookie( _this.settings.cookieName, "true" );
					_this.removeBanner();
					_this.removeUnderlay();
					_this.updateStatus();
				};

				// Preferences button
				if( event.target.id == 'ccbanner-button--preferences' ) {
					event.preventDefault();
					_this.showPreferences();
					_this.removeBanner();
				};

				// Accept all button
				if( event.target.id == 'ccprefs-button--accept' ) {
					event.preventDefault();
					_this.setCookie( _this.settings.cookieName, "true" );
					_this.removePreferences();
					_this.removeUnderlay();
					_this.updateStatus();
				};

				// Accept all button
				if( event.target.id == 'ccprefs-button--confirm' ) {
					event.preventDefault();

					// Check for Third Party input checkbox is checked or not
					if ( document.getElementById("ccprefs-thirdparty").checked ) {
						_this.setCookie( _this.settings.cookieName, "true" );
					} else {
						_this.setCookie( _this.settings.cookieName, "false" );
					}
					_this.removePreferences();
					_this.removeUnderlay();
					_this.updateStatus();
				};

				// Preferences button
				if( event.target.classList.contains('ccprefs-trigger') ) {
					event.preventDefault();
					_this.showPreferences();
					_this.showUnderlay();
				};

				// Preferences close link
				if( event.target.id == 'ccprefs-close' ) {
					event.preventDefault();
					_this.removePreferences();

					if ( _this.hasConsent('true') || _this.hasConsent('false') ) {
						_this.removeUnderlay();
					} else {
						_this.showBanner();
					}
				};
			} );

		},

		updateStatus: function() {
			var _this = this;

			if ( !this.settings.debug ) return;

			// ccdebug
			var status = 'Not set';
			if ( _this.hasConsent('true') ) {
				status = 'All cookies';
			} else if ( _this.hasConsent('false') ) {
				status = 'Only essential';
			} else if ( _this.hasConsent('assumed') ) {
				status = 'Assumed';
			}
			status = '[Cookie status: ' + status + ']';

			// Output to debug element is it exists
			var debugElement = document.getElementById("ccdebug");
			if ( debugElement ) {
				debugElement.innerHTML = status;
			}

			// Output to console
			console.log(status);
		}, 

		// Check for existing consent
		hasConsent: function (value) {
			var cookieName = this.settings.cookieName;
			return document.cookie.indexOf(cookieName + '=' + value) > -1;
		},

		// Create or update cookie
		setCookie: function (name, value) {
			var date = new Date();
			date.setTime(date.getTime() + (this.settings.cookieTimeout * 24 * 60 * 60 * 1000));
			document.cookie = name + '=' + value + ';expires=' + date.toGMTString() + ';path=/' + ';';
		},

		// Delete cookie by changing expire to something in the past
		deleteCookie: function (name) {
			document.cookie = name + '=;expires=Thu, 01-Jan-1970 00:00:01 GMT;path=/' + ';';
		},

	};

	// Build function to merge the default settings
	function extendDefaults(defaults, properties)
	{
		Object.keys(properties).forEach(property => {
			if(properties.hasOwnProperty(property))
			{
				defaults[property] = properties[property];
			}
		});
		return defaults;
	}

}());