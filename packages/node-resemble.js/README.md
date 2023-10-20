node-resemble.js
================

<p align="center">
<a href="https://nodejs.org/docs/latest-v12.x/api/index.html"><img src="https://img.shields.io/badge/node-12+-brightgreen.svg"></a>
<a href="https://www.npmjs.com/package/nodejs-resemble"><img src="https://img.shields.io/npm/v/nodejs-resemble.svg"></a>
</p>
Supported fork of [node-resemble.js](https://github.com/burnpiro/node-resemble.js)
Analyse and compare images with Javascript. This project does not need canvas or any other binary dependencies.
It is a modification of [Resemble.js](https://github.com/Huddle/Resemble.js)


### Get it

`npm install nodejs-resemble`

### Example

##### Retrieve basic analysis on image.

```javascript
var api = resemble(fileData).onComplete(function(data){
	console.log(data);
	/*
	{
	  red: 255,
	  green: 255,
	  blue: 255,
	  brightness: 255
	}
	*/
});
```

##### Use resemble to compare two images.

```javascript
var diff = resemble(file).compareTo(file2).ignoreColors().onComplete(function(data){
	console.log(data);
	/*
	{
	  misMatchPercentage : 100, // %
	  isSameDimensions: true, // or false
	  dimensionDifference: { width: 0, height: -1 }, // defined if dimensions are not the same
	  getImageDataUrl: function(){}
	}
	*/
});
```

##### You can also change the comparison method after the first analysis.

```javascript
// diff.ignoreNothing();
// diff.ignoreColors();
diff.ignoreAntialiasing();
```

##### Specify matching Box for image comparsion

```javascript
diff.ignoreRectangles([[325,170,100,40], [10,10,200,200]]);
```
- Ignores matched rectangles
- <[Array<Array[x, y, width, height]>]>
```javascript
diff.includeRectangles([[325,170,100,40], [10,10,200,200]]);
```
- Compares only within given rectangles
- <[Array<Array[x, y, width, height]>]>

##### Change the output display style.

```javascript
resemble.outputSettings({
  errorColor: {
    red: 255,
    green: 0,
    blue: 255
  },
  errorType: 'movement',
  transparency: 0.3
});
// resembleControl.repaint();
```

--------------------------------------
## Example usuage (in cucumber step definition)


     this.Then(/^Screenshot should match image "(.*)"$/, function (image, callback) {
        browser.takeScreenshot().then(function(pngString) {
          var screenshot = new Buffer(pngString, 'base64');
     
          resemble(image)
            .compareTo(screenshot)
            .onComplete(function(data){
     
              if (Number(data.misMatchPercentage) <= 0.01) {
                callback();
              } else {
                data.getDiffImage().pack().pipe(fs.createWriteStream(image + 'diff.png'));
                callback.fail(new Error("Screenshot '" + image+  "' differ " + data.misMatchPercentage + "%"));
              }
            });
        });
      })

--------------------------------------

Credits:
 * Created by [James Cryer](http://github.com/jamescryer) and the Huddle development team.
 * [Lukas Svoboda](http://github.com/lksv) - modification for node.js
 * [Kemal Erdem](https://github.com/burnpiro) - modification
 * [Viktar Silakou](https://github.com/viktor-silakov) - modification
