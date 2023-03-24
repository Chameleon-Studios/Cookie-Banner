# Chameleon Cookie Banner
A cookie banner javascript plugin with no dependancies to get and maintain cookie consent on websites. For a working example check: https://cookies.chameleonstudios.co.uk/ ```(test / cmq(Af5%_325)```

## Usage
You will need to grab the js and css files from this repo and include them in your project. You can do this in a couple of ways:

1. Copy this js and css files from this repo and paste them into your project. They can then get minified and combined in your usual build process.

2. Include the js and css from a CDN. The two files you will need are: 
https://cdn.jsdelivr.net/gh/Chameleon-Studios/Cookie-Banner@v1.0/cookies.min.js
https://cdn.jsdelivr.net/gh/Chameleon-Studios/Cookie-Banner@v1.0/cookies.min.css

Once the files are included in your project you can initialise the plugin:

### Quick setup
The most basic way to get going is just by initialising the script in the following way, this will just use all the default settings:
```
<script type="text/javascript">
	var cookieBanner = new cookieBanner();
</script>
```

### More complete setup
Using the options listed further down on this page you can customise the Cookie Banner in multiple ways, here is an example:
```
<script type="text/javascript">
	var cookieBanner = new cookieBanner({
		cookieName: "cookieBanner", 
		forceDecision: true, 
		cookieTimeout: 90, 
		privacyPage : "privacy-policy", 
		debug : true, 
	});
</script>
```

### WordPress Example
If used on a WordPress website you can the the privacy page URL with a WP function so that if the page slug changes a 404 is not created:
```
<script type="text/javascript">
	var cookieBanner = new cookieBanner({
		privacyPage : "<?php echo get_the_permalink(3); ?>", 
	});
</script>
```

## Functional Options
The plugin will run fine out of the box but can be customised with the following options: 

#### ```cookieName```
(default: 'cookieConsent')
Set the name of the cookie used to store preferences

#### ```cookieTimeout```
(default : 90)
Number of days before the cookie expires 

#### ```privacyPage``` 
(default : "cookie-policy")
Set the URL of the website cookie policy. This is really only needed is you set ```forceDecision : true```. As this will check for the cookie page and no show the underlay if it matches - without it is hard for users to read the cookie policy! Looking for a string match so no need for start or end slashes

#### ```showCookieIcon```
(default : false)
Choose whether to show a little cookie icon fixed to the bottom left corner of the screen. Clicking this triggers the cookie preferences modal

#### ```forceDecision```
(default : false)
Set whether you want to force the user to make a decision by creating an underlay to prevent interacton with the rest of the website. 

#### ```frostyOverlay```
(default : true)
To make the website harder to browser without making a decision we can apply a frosted glass effect to the underlay. ```forceDecision : true``` option has to be set to for this to take effect.

#### ```assumeConsent```
(default : true)
Only works if ```forceDecision : false```. It means the website will assume consent and run blocked javascript until the user chooses otherwise.

#### ```debug```
(default : false)
You can optionally turn debugging on. This will output the cookie status to the browser console and it will look for an element on the page with an ID of ```ccdebug```. If it finds it the status will be output here too.

## Content Options
Modify the content of the tools with the following:

#### ```textBannerTitle```
(default : '```Cookies```')

#### ```textBannerContent```
(Default : '```We use cookies to give you the best online experience, visit our <a href="/privacy-policy/">cookie policy</a> to learn more. Choose ‘Accept all’ to agree or for more options choose ‘Preferences’.```',

#### ```textBannerPreferences```
(Default : '```Preferences```')

#### ```textBannerButton```
(Default : '```Accept All```')


#### ```textPreferencesTitle```
(Default : '```Cookie Preferences```')

#### ```textPreferencesContent```
(Default: '```<p>We use cookies to collect and store information about how you use this website. They are used to improve how websites work, such as enabling interactive features, and to provide information to website owners about how their site is used and how well it is performing. You can change your preferences at any time.</p><p>Find out more about the cookies used on this website and select your preferences below:</p>```')

#### ```textPreferencesEssentialTitle```
(Default: '```Essential Cookies```')

#### ```textPreferencesEssentialContent```
(Default: '```<p>These cookies let you use all parts of the website and remember the choices you make to give you better functionality and personalised features. Without them, services that you’ve asked for can’t be provided.</p>```')

#### ```textPreferencesThirdpartyTitle```
(Default: '```3rd Party Cookies```')

#### ```textPreferencesThirdpartyContent```
(Default: '```<p>We use third-party cookies to track the actions of visitors to our site, allowing us to assess the effectiveness of our digital advertising.</p>```')

#### ```textPreferencesConfirmButton```
(Default: '```Confirm your choices```')

#### ```textPreferencesAcceptButton```
(Default: '```Accept All```')

## Third party javascript
Now that the cookie banner is managing the user consent we can tag any third party javascript code that should be conditionally used. To do so we need to either add or replace the existing <script> tag's 'type' attribute with ```type="text/plain"```. See the simple example below for some inline code:

```
<script type="text/plain">
	// Dont run me until you have the users consent
	alert('BOOM');
</script>
```

And for an external script:
	
```
<script async src="https://www.website.com/this-is-a-javascript-file.js" type="text/plain"></script>
```
	
### Google Analytics example
GA4 is a commonly used third party that should be managed by the cookie banner, this is how to achieve this:

```
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=XX-XXXXXX-XX" type="text/plain"></script>
<script type="text/plain">
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'XX-XXXXXX-XX');
</script>
```


