    $("input[type='radio']").change(function (e) {
        if ($(this).val() === 'custom') {
            $('#input').prop('disabled', false);
        } else {
            $('#input').prop('disabled', true);
        }
    });
