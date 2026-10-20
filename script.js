

/* =================================
   BRIGHTTECH WEBSITE JAVASCRIPT
   ================================= */

// 1. Automatically update the footer year
const yearElement = document.getElementById("year");

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}


// 2. Configure the WhatsApp contact button

// Replace this example number with your business number.
// Use the country code, without +, spaces, or dashes.
// Example format for Kenya: 2547XXXXXXXX
const businessWhatsAppNumber = "254714379075";

const whatsappButton = document.getElementById("whatsapp-button");

if (whatsappButton) {
    whatsappButton.href =
        "https://wa.me/" + businessWhatsAppNumber +
        "?text=" +
        encodeURIComponent(
            "Hello BrightTech Electrical Solutions, " +
            "I would like to enquire about your services."
        );

    whatsappButton.target = "_blank";
    whatsappButton.rel = "noopener noreferrer";
}
