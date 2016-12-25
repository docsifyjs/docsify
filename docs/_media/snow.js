// Fork https://github.com/HermannBjorgvin/SnowJs/blob/master/snow.js
(function(){
    if (new Date().getDate() > 25) return
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    var flakeArray = [];

    canvas.style.pointerEvents = "none";
    canvas.style.position = "absolute";
    canvas.style.top = 0;
    canvas.style.left = 0;
    canvas.style.width = "100vw";
    canvas.style.height = "100vh";
    document.body.appendChild(canvas);

    function canvasResize(){
        canvas.height = canvas.offsetHeight;
        canvas.width = canvas.offsetWidth;
    }
    canvasResize();

    window.onresize = function() {
        canvasResize();
    };

    var MyMath = Math;

    setInterval(function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();

        var random = MyMath.random();
        var distance = .05 + .95 * random;

        flake = {};
        flake.x = 1.5 * canvas.width * MyMath.random() - .5 * canvas.width;
        flake.y = -9;
        flake.velX = 2 * distance * (MyMath.random() / 2 + .5);
        flake.velY = (4 + 2 * MyMath.random()) * distance;
        flake.radius = MyMath.pow(5 * random, 2) / 5;
        flake.update = function() {
            var t = this;
            t.x += t.velX;
            t.y += t.velY;
            ctx.beginPath();
            ctx.arc(t.x, t.y, t.radius, 0, 2 * MyMath.PI, !1);
            ctx.fillStyle = "#FFF";
            ctx.fill()
        };

        flakeArray.push(flake);

        for (b = 0; b < flakeArray.length; b++) {
            flakeArray[b].y > canvas.height ? flakeArray.splice(b, 1) : flakeArray[b].update()
        }
    }, 16);
})();