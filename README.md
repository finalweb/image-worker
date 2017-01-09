# image-worker
## description

Quickly get the dimensions and base64 url of an image file without blocking the UI (additional features coming later).

## installation

#### recommended

```
npm install --save-dev image-processor-worker
```

#### old school

```
<script type="text/javascript" src="dist/image-processor-worker.js"></script>
var processor = new ImageProcessor(file);
```

## usage

#### tl/dr

```
var IP = require('image-processor-worker');
var ip = new IP(file) //javascript File object;
ip.getDetails({preview: true}).then(function(details){
    console.log(details);
})
```

will yield the following JSON object

```
{
    width: 100,
    height: 100,
    preview: 'data:image/jpeg;base64,/dg06HthpF...'
}
```

#### longer example

Assuming you have the following HTML

```html

<input id="file" type="file" />
```

and javascript:

``` javascript
var ImageProcessor = require('image-processor-worker');
var field = document.getElementById('file');
field.addEventListener('change', function(e){
    var file = e.target.files[0];
    var processor = new ImageProcessor(file);
    processor.getDetails().then(function(result){
        console.log(result);
    });
})
```

you'll get the following output:

```
{
    width: 100,
    height: 100,
    preview: 'data:image/jpeg;base64,/dg06HthpF...'
}
```
