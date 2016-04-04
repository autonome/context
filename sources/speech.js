// Speech recognition
// * Recognizing speech means people are around, and you can act on their input (even ambiently)
// * Detecting but failing to recognize anything means people are around

var speechSource = (function(window) {

  var id = 'source-speech',
      title = 'Speech Recognition';

  function start() {
    var grammar = addVocabulary(['hey', 'you', 'carrot'])
    recordSpeech(grammar, function(interim, complete, confidence) {
      console.log('recording results', 'INTERIM:', interim, 'COMPLETE:', complete, 'CONFIDENCE:', confidence)
      //say(complete)
      //display([complete])
    });
  }

  function addVocabulary(words) {
    var grammar = new SpeechGrammarList();
    grammar.addFromString(
      '#JSGF V1.0; grammar test; public <simple> = ' +
      words.join(' | ') + ' ;', 1);
    return grammar;
  }

  function recordSpeech(grammar, handler) {
    try {

    var recognition = new SpeechRecognition();
    recognition.grammars = grammar;
    recognition.start();

    var interim_transcript = '',
        final_transcript = '',
        confidence = '';

    recognition.onstart = function(e) {
      console.log('recognition.onstart')
    };

    recognition.onresult = function(e) {
      console.log('recognition.onresult', e.results.length, 'results returned')
      // Assemble the transcript from the array of results
      for (var i = e.resultIndex; i < e.results.length; ++i) {
        var result = e.results[i];
        console.log('recognition.onresult', 'isFinal', result.isFinal)
        if (result.isFinal) {
          final_transcript += result[0].transcript
        } else {
          interim_transcript += result[0].transcript
          confidence = result[0].confidence
        }
      }
      console.log('recognition.onresult', 'interim_transcript', interim_transcript)
      handler(interim_transcript, final_transcript, confidence)
    };

    recognition.onend = function() {
      console.log('recognition.onend', 'final_transcript', final_transcript)
      recognition.stop()
      publish(id, {
        id: 'speechRecognition',
        label: 'Recognized speech',
        type: 'scalar',
        value: final_transcript
      });
    };

    recognition.onerror = function(e) {
      console.log('recognition.onerror', e)
    };

    console.log('rs(): started')
    } catch(ex) { console.log(ex) }
  }

  // public
  return {
    id: id,
    title: title,
    start: start
  };

})(this);
