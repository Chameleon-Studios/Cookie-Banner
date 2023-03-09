# Chameleon Cookie Banner
A cookie banner javascript plugin with no dependancies to get and maintain cookie consent on websites. For a working example check: https://cookies.chameleonstudios.co.uk/ ```(test / cmq(Af5%_325)```

## Usage
You will need to grab the js and css files from this repo and copy them into your project. Depending on where you save the files you will need to update the paths in the code below.

The following HTML snippet will then need to be dropped into your project template, for example at the bottom of the footer but this depends on where you intend the consent form to be displayed:
```
<!-- Cookie Banner -->
<link rel="stylesheet" type="text/css" href="<?php echo get_template_directory_uri(); ?>/cookies/cookies.css" />
<script src="<?php echo get_template_directory_uri(); ?>/cookies/cookies.js"></script>
<script type="text/javascript">
	var cookieBanner = new cookieBanner();
</script>
```
[To do: should we use a CDN to include these files from somewhere?]

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

## Options
The plugin will run fine out of the box but can be customised with the following options: 

#### ```cookieName```
(default: 'hasConsent')
You can choose the name of the cookie set to store the constent choice

#### ```cookieTimeout```
(default : 14)
Number of days to save the cookie choice for

#### ```forceDecision```
(default : true)
Set whether you want to force the user to make a decision by creating an underlay to prevent interacton with the rest of the website. 

#### ```privacyPage``` 
(default : "cookie-policy")
Set the URL of the website cookie policy. This is really only needed is you set ```forceDecision : true```. As this will check for the cookie page and no show the underlay if it matches - without it is hard for users to read the cookie policy!

#### ```showCookieIcon```
(default : false)
Choose whether to show a little cookie icon fixed to the bottom left corner of the screen. Clicking this triggers the cookie preferences modal

#### ```frostyOverlay```
(default : true)
To make the website harder to browser without making a decision we can apply a frosted glass effect to the underlay. ```forceDecision : true``` option has to be set to for this to take effect.

#### ```debug```
(default : false)
You can optionally turn debugging on. This will output the cookie status to the browser console and it will look for an element on the page with an ID of ```ccdebug```. If it finds it the status will be output here too.



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


