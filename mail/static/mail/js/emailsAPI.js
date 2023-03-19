// Call event listener when DOM is DOM is loaded 
document.addEventListener('DOMContentLoaded', function() {
    // Add submit button
    document.getElementById('compose-form').addEventListener("submit", submitEmail);
})


// Fetch POST emails api
function submitEmail(event) {
    const header = document.querySelectorAll('input');
    const content = document.querySelector('textarea');
    // event.preventDefault();
    fetch('/emails', {
        method: 'POST',
        body: JSON.stringify({
            recipients: header[1].value,
            subject: header[2].value,
            body: content.value
        })
    })
    .then(response => response.json())
    .then(result => {
        // Print result
        console.log(result);
        // Clear out composition fields
        document.querySelector('#compose-recipients').value = '';
        document.querySelector('#compose-subject').value = '';
        document.querySelector('#compose-body').value = '';
    })
}