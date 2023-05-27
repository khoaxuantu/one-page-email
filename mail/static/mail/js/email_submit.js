import { clearCompositionFields } from "./lib/modifyDOM.js";

// Call event listener when DOM is loaded 
document.addEventListener('DOMContentLoaded', function() {
    // Add submit button
    document.getElementById('compose-form').addEventListener("submit", submitEmail);
})


// Fetch POST emails api
async function submitEmail(event) {
    event.preventDefault();
    const header = document.querySelectorAll('input');
    const content = document.querySelector('textarea');

    const fetchAPI = await fetch('/emails', {
        method: 'POST',
        body: JSON.stringify({
            recipients: header[1].value,
            subject: header[2].value,
            body: content.value
        })
    })
    const result = await fetchAPI.json();

    // If receive status 400, pop an alert and abort submitting
    if (fetchAPI.status === 400) alert(result.error);
    else {
        clearCompositionFields();
        location.reload();
    }
}