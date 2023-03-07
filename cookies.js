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
			frostyOverlay : true, 
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
			html += '<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 72.5 72.5" enable-background="new 0 0 72.5 72.5" xml:space="preserve"><polygon points="75,75 0,75 0,0" id="triangle"/><g><path fill="white" d="M23.2,63.7c-3,0-6-1.1-8.3-3.4c-4.7-4.5-4.8-12.1-0.3-16.7c2.2-2.3,5.4-3.6,8.5-3.6h0.1c0.5,0,1,0.2,1.3,0.5 c0.3,0.4,0.5,0.8,0.5,1.3c0,0.2,0,0.2-0.1,0.4c-0.3,1.5,0.6,3,2.1,3.3c0.2,0.1,0.4,0.1,0.5,0.1c1,0,1.8,0.8,1.8,1.8 c0,1.5,1.2,2.7,2.8,2.7l0,0c0.2,0,0.4,0,0.5-0.1c0.5-0.1,1,0,1.4,0.2c0.4,0.2,0.7,0.7,0.8,1.1c0,0.2,0.1,0.2,0.1,0.4l0,0 c0,3.1-1.2,6.3-3.5,8.5C29.2,62.5,26.2,63.7,23.2,63.7z M23.2,41.8c-2.7,0-5.3,1.1-7.2,3.1c-3.8,4-3.7,10.3,0.2,14.2 c3.9,3.8,10.2,3.7,14.1-0.1c1.9-1.9,3-4.5,3-7.2l0,0l0,0c-0.3,0.1-0.6,0.1-0.9,0.1c-2.5,0-4.6-2-4.6-4.5l0,0 c-0.3,0-0.6-0.1-0.9-0.1C24.2,46.7,22.6,44.2,23.2,41.8L23.2,41.8L23.2,41.8L23.2,41.8z"/><circle fill="white" cx="26.3" cy="56.8" r="1.4"/><circle fill="white" cx="19" cy="55.9" r="1.4"/><circle fill="white" cx="18.1" cy="49.5" r="1.4"/><circle fill="white" cx="24" cy="51.3" r="1.4"/></g></svg>';
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
			html += '<p class="ccprefs-message">We use cookies to collect and store information about how you use this website. They are used to improve how websites work, such as enabling interactive features, and to provide information to website owners about how their site is used and how well it is performing. You can change your preferences at any time.</p>';
			html += '<p class="ccprefs-message">Find out more about the cookies used on this website and select your preferences below:</p>';
			html += '<a href="#" class="ccprefs-close" id="ccprefs-close">Close</a>';
			html += '</div>';
			html += '<div class="ccprefs-option">';
			html += '<div class="ccprefs-select"><input type="checkbox" name="" checked="checked" disabled></div>';
			html += '<div class="ccprefs-definition">';
			html += '<p class="ccprefs-subtitle">Essential Cookies</p>';
			html += '<p>These cookies let you use all parts of the website and remember the choices you make to give you better functionality and personalised features. Without them, services that you’ve asked for can’t be provided.</p>';
			html += '</div>';
			html += '</div>';
			html += '<div class="ccprefs-option">';
			html += '<div class="ccprefs-select"><input type="checkbox" name="" id="ccprefs-thirdparty"></div>';
			html += '<div class="ccprefs-definition">';
			html += '<label for="ccprefs-thirdparty"><p class="ccprefs-subtitle">3rd Party Cookies</p>';
			html += '<p>We use third-party cookies to track the actions of visitors to our site, allowing us to assess the effectiveness of our digital advertising.</p></label>';
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
			html += '<p class="ccbanner-message">We use cookies to give you the best online experience, visit our <a href="/privacy-policy/">cookie policy</a> to learn more. Choose ‘Accept all’ to agree or for more options choose ‘Preferences’.</p>';
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
			if ( this.settings.frostyOverlay ) node.classList.add("ccunderlay--frosted");
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