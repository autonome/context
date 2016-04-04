var sparkline = (function(window) {

  function generate(userNumbers, userMaxLength) {
    if (!userNumbers) {
      return '';
    }

    // resample the series to the desired number of characters
    // we have X > C data points and we want to output not more than C characters.
    //
    // So the first character will be based on the average of the
    // first ceil(X/C) data points.
    var maxOutLength = userMaxLength || 20;
    var outputLength = Math.min(userNumbers.length, maxOutLength);
    var outputNumbers = [outputLength];

    var chunkSize = Math.ceil(userNumbers.length / outputLength);
    var sumValues = 0;
    var sumCount = 0;
    var chunkNum = 0;
    for (var i = 0; i < userNumbers.length; i++) {
      sumValues += parseFloat(userNumbers[i]);
      sumCount++;
      if (sumCount == chunkSize || i == (userNumbers.length - 1)) {
        outputNumbers[chunkNum] = sumValues / sumCount;
        chunkNum++;
        sumValues = 0;
        sumCount = 0;
      }
    }

    return renderNumbers(outputNumbers);
  }

  function renderNumbers(numbers) {
    var base = 9601;
    var range = 6;

    // permitted unicode decimal values go from base to base+range
    // so there are (range+1) permitted values

    var result="";

    var minValue = numbers[0];
    var maxValue = numbers[0];
    for (i = 1; i < numbers.length; i++) {
      minValue = Math.min(minValue, numbers[i]);
      maxValue = Math.max(maxValue, numbers[i]);
    }
    var valueScale = maxValue - minValue;

    for (i = 0; i < numbers.length; i++) {
      // scaledValue is a real value in [0,1]
      scaledValue = (numbers[i] - minValue) / valueScale;

      // num is now an integer value in [0, range]
      num = Math.floor(Math.min(range, scaledValue * (range + 1)));

      // sadly, unicode 9604 and 9608 dont render properly in my browser.
      // they are not vertically aligned the same as the other unicode block elements
      // so it looks crap.
      //
      // thus we hack.
      if (num == 3) {
        if (scaledValue * (range + 1) < 3.5) {
          num = 2;
        }
        else {
          num = 4;
        }
      }
      if (num == 7) {
        num = 6
      }

      result += String.fromCharCode(base + num);
    }
    return result;
  }

  // public
  return {
    generate: generate
  };

})(this);
