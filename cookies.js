/*
_________                __   .__         __________                                    
\_   ___ \  ____   ____ |  | _|__| ____   \______   \_____    ____   ____   ___________ 
/    \  \/ /  _ \ /  _ \|  |/ /  |/ __ \   |    |  _/\__  \  /    \ /    \_/ __ \_  __ \
\     \___(  <_> |  <_> )    <|  \  ___/   |    |   \ / __ \|   |  \   |  \  ___/|  | \/
 \______  /\____/ \____/|__|_ \__|\___  >  |______  /(____  /___|  /___|  /\___  >__|   
        \/                   \/       \/          \/      \/     \/     \/     \/ 

Version: 1.7
Author: Chameleon Studios
Website: http://www.chameleonstudios.co.uk
Repo: https://github.com/Chameleon-Studios/Cookie-Banner
*/

(function()
{

	// Register the class
	this.cookieBanner = function()
	{
		// Define the default settings
		let defaults = {

			// General
			cookieName : 'cookieConsent', // Set the name of the cookie used to store preferences 
			cookieTimeout : 90, // Number of days before the cookie expires 
			privacyPage : "/privacy-policy/", // Looking for a string match so no need for start or end slashes 
			showCookieIcon : false, // Show the cookie icon fixed bottom left to bring back the preferences modal 
			forceDecision : false, // Prevent users navigating the website before making a decision 
			assumeConsent : true, // Assume consent until confirmed
			rejectButton : false, // Show a reject 3rd party cookies button
			frostyOverlay : true, // Only used when forceDecision is true. Option to show frosted underlay 
			debug : false, // Ouput to console log 

			// Cookie Banner 
			textBannerTitle : 'Cookies',
			textBannerContent : 'We use cookies to give you the best online experience, visit our <a href="[privacyPage]">cookie policy</a> to learn more. Choose ‘Accept all’ to agree or for more options choose ‘Preferences’.',
			textBannerPreferences : 'Preferences',
			textBannerButton : 'Accept All',
			textBannerRejectButton : 'Reject',

			// Cookie Preferences
			textPreferencesTitle : 'Cookie Preferences', 
			textPreferencesContent : '<p>We use cookies to collect and store information about how you use this website. They are used to improve how websites work, such as enabling interactive features, and to provide information to website owners about how their site is used and how well it is performing. You can change your preferences at any time.</p><p>Find out more about the cookies used on this website and select your preferences below:</p>', 
			textPreferencesEssentialTitle : 'Essential Cookies', 
			textPreferencesEssentialContent : '<p>These cookies let you use all parts of the website and remember the choices you make to give you better functionality and personalised features. Without them, services that you’ve asked for can’t be provided.</p>', 
			textPreferencesThirdpartyTitle : '3rd Party Cookies', 
			textPreferencesThirdpartyContent : '<p>We use third-party cookies to track the actions of visitors to our site, allowing us to assess the effectiveness of our digital advertising.</p>', 
			textPreferencesConfirmButton : 'Confirm your choices',
			textPreferencesAcceptButton : 'Accept All',
		};

		// Update the settings
		this.settings = (arguments[0] && typeof arguments[0] === 'object') ? extendDefaults(defaults, arguments[0]) : defaults;

		// Update the placeholder privacy page URL with the correct value
		this.settings.textBannerContent = this.settings.textBannerContent.replace("[privacyPage]", this.settings.privacyPage);

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

				this.showCookieIcon();

			} else {

				// If we are not forcing a decision then assume constent and set the cookie until the user sets otherwise
				if ( !this.settings.forceDecision && this.settings.assumeConsent ) {
					this.setCookie( this.settings.cookieName, "assumed" );
				}

				// Otherwise run the banner
				this.showBanner();

				// Do not show the underlay if on the cookies information page
				var slug = location.pathname;
				if ( slug.indexOf( this.settings.privacyPage ) == -1 ) {
					this.showUnderlay();
				}
			}
			
			this.updateStatus();
			this.runBlockedJavascript();
		},

		runBlockedJavascript: function() {

			// If no consent given always fail at this point
			if ( this.hasConsent('true') || this.hasConsent('assumed') ) {

				// Debug
				if ( this.settings.debug ) console.log('[Cookie banner: Run blocked Javascript]');

				// Get all script tags with type="text/plain"
				var scripts = document.getElementsByTagName("script");

				// Loop through setting to type="text/javascript"
				for (var i = 0; i < scripts.length; i++) {

					if ( scripts[i].getAttribute("type") == "text/plain" ) {

						// Run the scripts
						if ( scripts[i].getAttribute("src") ) {

							// add it afresh
							var js_script = document.createElement('script');
							js_script.type = "text/javascript";
							js_script.src = scripts[i].getAttribute("src");
							js_script.async = true;
							scripts[i].parentNode.insertBefore(js_script, scripts[i].nextSibling);

							// remove old script
							scripts[i].parentNode.removeChild( scripts[i] );

						} else {

							// Script inline
							scripts[i].setAttribute("type", "text/javascript");
							var scriptText = scripts[i].innerHTML;
							eval(scriptText);

						}
					}
				}
			}
		}, 

		// Display the preferences
		showCookieIcon: function () {

			// check to show or not
			if ( !this.settings.showCookieIcon ) return;

			// check if it already exists
			if ( document.getElementsByClassName('ccicon').length ) return;

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
			html += '<p class="ccprefs-title">' + this.settings.textPreferencesTitle + '</p>';
			html += this.settings.textPreferencesContent;
			html += '<a href="#" class="ccprefs-close" id="ccprefs-close">Close</a>';
			html += '</div>';
			html += '<div class="ccprefs-option">';
			html += '<div class="ccprefs-select"><input type="checkbox" name="" checked="checked" disabled></div>';
			html += '<div class="ccprefs-definition">';
			html += '<p class="ccprefs-subtitle">' + this.settings.textPreferencesEssentialTitle + '</p>';
			html += this.settings.textPreferencesEssentialContent;
			html += '</div>';
			html += '</div>';
			html += '<div class="ccprefs-option">';
			html += '<div class="ccprefs-select"><input type="checkbox" name="" id="ccprefs-thirdparty"></div>';
			html += '<div class="ccprefs-definition">';
			html += '<label for="ccprefs-thirdparty"><p class="ccprefs-subtitle">' + this.settings.textPreferencesThirdpartyTitle + '</p>';
			html += this.settings.textPreferencesThirdpartyContent + '</label>';
			html += '</div>';
			html += '</div>';
			html += '<div class="ccprefs-actions">';
			html += '<ul>';';';
			html += '<li class="ccprefs-button ccprefs-button--confirm"><a href="#" id="ccprefs-button--confirm">' + this.settings.textPreferencesConfirmButton + '</a></li>';
			html += '<li class="ccprefs-button ccprefs-button--accept"><a href="#" id="ccprefs-button--accept">' + this.settings.textPreferencesAcceptButton + '</a></li>';
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
			if ( this.settings.textBannerTitle ) html += '<p class="ccbanner-title">' + this.settings.textBannerTitle + '</p>';
			html += '<p class="ccbanner-message">' + this.settings.textBannerContent + '</p>';
			html += '</div>';
			html += '<div class="ccbanner-actions">';
			html += '<ul>';
			html += '<li class="ccbanner-button ccbanner-button--preferences"><a href="#" id="ccbanner-button--preferences">' + this.settings.textBannerPreferences + '</a></li>';
			if ( this.settings.rejectButton ) html += '<li class="ccbanner-button ccbanner-button--reject"><a href="#" id="ccbanner-button--reject">' + this.settings.textBannerRejectButton + '</a></li>';
			html += '<li class="ccbanner-button ccbanner-button--accept"><a href="#" id="ccbanner-button--accept">' + this.settings.textBannerButton + '</a></li>';
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

				// Banner: Accept all button
				if( event.target.id == 'ccbanner-button--accept' ) {
					event.preventDefault();
					_this.setCookie( _this.settings.cookieName, "true" );
					_this.removeBanner();
					_this.removeUnderlay();
					_this.updateStatus();
					_this.runBlockedJavascript();
					_this.showCookieIcon();
				};

				// Banner: reject 3rd party button
				if( event.target.id == 'ccbanner-button--reject' ) {
					event.preventDefault();
					_this.setCookie( _this.settings.cookieName, "false" );
					_this.removeBanner();
					_this.removeUnderlay();
					_this.updateStatus();
					_this.showCookieIcon();
				};

				// Banner: Preferences button
				if( event.target.id == 'ccbanner-button--preferences' ) {
					event.preventDefault();
					_this.showPreferences();
					_this.removeBanner();
				};

				// Preferences: Accept all button
				if( event.target.id == 'ccprefs-button--accept' ) {
					event.preventDefault();
					_this.setCookie( _this.settings.cookieName, "true" );
					_this.removePreferences();
					_this.removeUnderlay();
					_this.updateStatus();
					_this.runBlockedJavascript();
					_this.showCookieIcon();
				};

				// Preferences: Confirm choices all button
				if( event.target.id == 'ccprefs-button--confirm' ) {
					event.preventDefault();

					// Check for Third Party input checkbox is checked or not
					if ( document.getElementById("ccprefs-thirdparty").checked ) {
						_this.setCookie( _this.settings.cookieName, "true" );
						_this.runBlockedJavascript();
					} else {
						_this.setCookie( _this.settings.cookieName, "false" );
					}
					_this.removePreferences();
					_this.removeUnderlay();
					_this.updateStatus();
					_this.showCookieIcon();
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
