<script>
//Event Listener for button click
    document.addEventListener('DOMContentLoaded', function () {
        document.querySelector('.btn.solve').addEventListener('click', function () {
            // Get the JavaScript variable or data needed
            var partialSolution = 'YourJavaScriptVariableHere';

            // Make an AJAX request to the Django view
            fetch('/find_partial_solutions/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-CSRFToken': getCookie('csrftoken'),  // Include CSRF token
                },
                body: 'partial_solution=' + encodeURIComponent(partialSolution),
            })
            .then(response => response.json())
            .then(data => {
                // Handle the response data as needed
                console.log(data.message);
            })
            .catch(error => {
                console.error('Error:', error);
            });
        });
    });

    // Function to get CSRF token from cookies
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
</script>
