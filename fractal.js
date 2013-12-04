var FractalNoise = function () {};
FractalNoise.prototype.interpolate = function(x0, x1, alpha) {
  return x0 * (1 - alpha) + alpha * x1;
}
FractalNoise.prototype.whiteNoise = function (w, h) {
  var noise = [];
  for (var i = 0; i < w; i++) {
    noise[i] = [];
    for (var j = 0; j < h; j++) {
      noise[i][j] = Math.random();
    }
  }
  return noise;
}
FractalNoise.prototype.smoothNoise = function (w, h, octave) {
  if (octave === undefined) var octave = 3;
  var whiteNoise = this.whiteNoise(w, h);
  var samplePeriod = 1 << octave;
  var sampleFreq = (1.0 / samplePeriod);
  var smooth = [];

  for (var i = 0; i < w; i++) {
    smooth[i] = [];
    var _i0 = Math.floor(i / samplePeriod) * samplePeriod;
    var _i1 = (_i0 + samplePeriod) % w;
    var h_blend = (i - _i0) * sampleFreq;

    for (var j = 0; j < h; j++) {
      var _j0 = Math.floor(j / samplePeriod) * samplePeriod;
      var _j1 = (_j0 + samplePeriod) % h;
      var v_blend = (j - _j0) * sampleFreq;

      var top = this.interpolate(whiteNoise[_i0][_j0], whiteNoise[_i1][_j0], h_blend);
      var bottom = this.interpolate(whiteNoise[_i0][_j1], whiteNoise[_i1][_j1], h_blend);

      smooth[i][j] = Math.floor(this.interpolate(top, bottom,  v_blend) * 255);
    }
  }
  return smooth;
}
FractalNoise.prototype.fractalNoise = function (w, h, octave) {
  if (octave === undefined) var octave = 7;
  var persistance = 0.5;
  var amplitude = 1.0;
  var totalAmp = 0.0;
  var smooth = [];
  var fractal = [];

  for (var i = 0; i < octave; i++) {
    smooth[i] = this.smoothNoise(w, h, i);
  }

  for (var o = (octave - 1); o >= 0; o--) {
    amplitude = amplitude * persistance;
    totalAmp += amplitude;
    for (var i = 0; i < w; i++) {
      if(fractal[i] === undefined) fractal[i] = [];
      for (var j = 0; j < h; j++) {
        if (isNaN(fractal[i][j])) {
          fractal[i][j] = 0;
        }
        fractal[i][j] += (smooth[o][i][j] * amplitude);
      }
    }
  }

  for (var i = 0; i < w; i++) {
    for (var j = 0; j < h; j++) {
      fractal[i][j] = Math.floor(fractal[i][j] / totalAmp);
    }
  }
  return fractal;
}
