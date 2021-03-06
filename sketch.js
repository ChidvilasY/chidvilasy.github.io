// The FUGPL License 
// ===================
//
// Free software should be truly free. The GPL and its derivatives infringe
// upon the freedoms of the licensee by forcing distribution of code with
// distribution of software. This license is a protest against anti-business, 
// anti-freedom licenses such as the GPL.
//
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the
// "Software"), to deal in the Software with only one restriction: no part of
// it may be included in software projects that are solely distributed under 
// strong copyleft restricted licenses such as the GPL, GPL2, or GPL3.
//
// There otherwise exists no restrictions in using this software, including
// without other limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to
// the following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
// IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
// CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
// TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
// SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

var a = 255;
var b = 0;
var c = 0;
var offset = 100; // offset from window

class mover {
    constructor () {
        this.locinit ();
        this.vel = new p5.Vector (0, 0);
        this.acc = new p5.Vector (0, 0);
        // this.maxspeed = 8;
        // this.maxforce = 0.3;
    }

    update () {
        this.vel.add (this.acc);
        this.vel.limit (this.maxspeed);
        this.loc.add (this.vel);
        this.acc.mult (0);
    }

    applyforce (f) {
        this.acc.add (f);
    }

    arrive (target) {
        var desired =  p5.Vector.sub (target, this.loc);
        var d = desired.mag ();
        if (d < 100) {
            var m = map (d, 0, 100, 0, this.maxspeed);
            desired.setMag (m);
        } else {
            desired.setMag (this.maxspeed);
        }

        var steer = p5.Vector.sub (desired, this.vel);
        steer.limit (this.maxforce);
        this.applyforce (steer);
    }

    locinit () {
        var rand = random (10);
        if (rand < 2.5) {
            this.loc = new p5.Vector (-1 * random (offset), random (height));  // from left of window
        } else if (rand < 5) {
            this.loc = new p5.Vector (random (width), height + random (offset)); // from bottom of windwow
        } else if (rand < 7.5) {
            this.loc = new p5.Vector (width + random (offset), random (height)); // from right of window
        } else {
            this.loc = new p5.Vector (random (width), -1 * random (offset)); // from top of window
        }
        this.maxspeed = random (5, 8);
        this.maxforce = random (0.2, 0.3);
    }

    display () {
        fill (a, b, c);
        ellipse (this.loc.x, this.loc.y, 10, 10);
    }
}

var objs = [];
var tar;
var score = 0;
var hiscore = 0;

function setup () {
    rectMode (CENTER);
    ellipseMode (CENTER);
    createCanvas (windowWidth, windowHeight - 5);

    nofobjs = 6;
    tar = new p5.Vector (width / 2, height / 2);
    for (var i = 0; i < nofobjs; i++) {
        objs[i] = new mover();
    }
    noStroke ();
}

function draw () {
    background (51, 200);
    fill (0, 0, 255);
    tar.x = constrain (tar.x, 0, width);
    tar.y = constrain (tar.y, 0, height);
    ellipse (tar.x, tar.y, 15, 15);

    for (var i = 0; i < objs.length; i++) {
        objs[i].arrive (tar);
        objs[i].update ();
        objs[i].display ();
    }

    for (var i = 0; i < objs.length; i++) {
        var disp = p5.Vector.dist (objs[i].loc, tar);
        if (disp < 10) {
            a = random (51, 255);
            b = random (51, 255);
            c = random (51, 255);
            if (hiscore < score) {
                hiscore = score;
            }
            score = 0;
        }
    }

    for (var i = 0; i < objs.length; i++) {
        for (var j = 0; j < objs.length; j++) {
            if (i != j) {
                var disp = p5.Vector.dist (objs[i].loc, objs[j].loc);
                if (disp < 10) {
                    score += 1;
                    objs[i].locinit ();
                    objs[j].locinit ();
                }
            }
        }
    }

    if (keyIsDown (RIGHT_ARROW)) {
        tar.x += 10;
    } else if (keyIsDown (LEFT_ARROW)) {
        tar.x -= 10;
    }
    if (keyIsDown (UP_ARROW)) {
        tar.y -= 10;
    } else if (keyIsDown (DOWN_ARROW)) {
        tar.y += 10;
    }

    fill (0, 150, 255);
    textSize (20);
    text (score, 30, 60);
    text (hiscore, width - 60, 60);

}
