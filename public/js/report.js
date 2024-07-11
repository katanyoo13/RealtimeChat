$(document).ready(function() {
    $('#reportForm').submit(function(e) {
        e.preventDefault();

        const reportData = {
            reportType: $('#reportType').val(),
            reportDescription: $('#reportDescription').val()
        };

        $.ajax({
            type: 'POST',
            url: '/api/submitReport',
            data: JSON.stringify(reportData),
            contentType: 'application/json',
            success: function(response) {
                alert(response.message);
                window.location.href = 'chat.html';
            },
            error: function(error) {
                console.error('Error submitting report:', error);
                alert('Error submitting report');
            }
        });
    });
});
