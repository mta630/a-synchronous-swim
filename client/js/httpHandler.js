(function() {

  const serverUrl = 'http://127.0.0.1:3000';

  //
  // TODO: build the swim command fetcher here
  //

  // ==========================REQUEST FOR GETTING RANDOM COMMANDS EVERY 2 SECONDS====================================

  const fetchRandomCommand = () => {
    $.ajax({
      type: 'GET',
      data: {
        command: 'random'
      },
      url: serverUrl,
      success: (response) => {
        SwimTeam.move(response);
      },
      fail: (response) => {
        console.log(failure);
        console.log(response);
      },
      complete: () => setTimeout(fetchRandomCommand, 2000)
    });
  };


    const fetchCommand = () => {
      $.ajax({
        type: 'GET',
        data: {
          move: 'move'
        },
        url: serverUrl,
        success: (res) => {
          SwimTeam.move(res);
        },
        complete: () => setTimeout(fetchCommand, 500)
      })
    }


  fetchCommand();


  /////////////////////////////////////////////////////////////////////
  // The ajax file uplaoder is provided for your convenience!
  // Note: remember to fix the URL below.
  /////////////////////////////////////////////////////////////////////

  const ajaxFileUplaod = (file) => {
    var formData = new FormData();
    formData.append('file', file);
    $.ajax({
      type: 'POST',
      data: formData,
      url: serverUrl + '/background.jpg',
      cache: false,
      contentType: false,
      processData: false,
      success: () => {
        // reload the page
        console.log('success');
        window.location = window.location.href;
      }
    });
  };

  $('form').on('submit', function(e) {
    e.preventDefault();

    var form = $('form .file')[0];
    if (form.files.length === 0) {
      console.log('No file selected!');
      return;
    }

    var file = form.files[0];
    if (file.type !== 'image/jpeg') {
      console.log('Not a jpg file!');
      return;
    }

    ajaxFileUplaod(file);
  });

})();
