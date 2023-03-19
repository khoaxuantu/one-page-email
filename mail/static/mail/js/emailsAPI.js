// Call event listener when DOM is DOM is loaded 
document.addEventListener('DOMContentLoaded', function() {
    // Add submit button
    document.querySelector('')
})


// Fetch POST emails api
function submitEmails() {
    const header = document.querySelectorAll('input');
    const content = document.querySelector('textarea');
    fetch('emails', {
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
    })
}