

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


// 3. Keep photo editing local to the visitor's browser
const photoInput = document.getElementById("photo-input");
const dropArea = document.getElementById("drop-area");
const photoPreview = document.getElementById("photo-preview");
const photoImage = document.getElementById("photo-image");
const editorStatus = document.getElementById("editor-status");
const brightnessControl = document.getElementById("brightness");
const contrastControl = document.getElementById("contrast");
const saturationControl = document.getElementById("saturation");
const resetPhotoButton = document.getElementById("reset-photo");
const rotatePhotoButton = document.getElementById("rotate-photo");
const downloadPhotoButton = document.getElementById("download-photo");
const photoControls = [brightnessControl, contrastControl, saturationControl];
const maximumPhotoSize = 20 * 1024 * 1024;
const supportedPhotoTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
let originalPhotoUrl = "";
let originalPhotoName = "photo";
let rotation = 0;

function updatePhotoPreview() {
    const brightness = brightnessControl.value;
    const contrast = contrastControl.value;
    const saturation = saturationControl.value;

    photoImage.style.filter =
        `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
    document.getElementById("brightness-value").value = `${brightness}%`;
    document.getElementById("contrast-value").value = `${contrast}%`;
    document.getElementById("saturation-value").value = `${saturation}%`;
}

function loadPhoto(file) {
    if (!file) return;

    if (!supportedPhotoTypes.includes(file.type)) {
        editorStatus.textContent = "Choose a JPG, PNG, GIF, or WebP image.";
        photoInput.value = "";
        return;
    }

    if (file.size > maximumPhotoSize) {
        editorStatus.textContent = "That image is over 20 MB. Choose a smaller file.";
        photoInput.value = "";
        return;
    }

    const nextPhotoUrl = URL.createObjectURL(file);
    const loadedImage = new Image();

    loadedImage.onload = () => {
        if (originalPhotoUrl) URL.revokeObjectURL(originalPhotoUrl);
        originalPhotoUrl = nextPhotoUrl;
        originalPhotoName = file.name.replace(/\.[^.]+$/, "") || "photo";
        photoImage.src = nextPhotoUrl;
        photoImage.dataset.type = file.type;
        photoPreview.hidden = false;
        dropArea.hidden = true;
        rotation = 0;
        photoImage.style.transform = "rotate(0deg)";
        photoControls.forEach((control) => { control.disabled = false; });
        resetPhotoButton.disabled = false;
        rotatePhotoButton.disabled = false;
        downloadPhotoButton.disabled = false;
        editorStatus.textContent = `${file.name} · ${loadedImage.naturalWidth} × ${loadedImage.naturalHeight}`;
        updatePhotoPreview();
    };

    loadedImage.onerror = () => {
        URL.revokeObjectURL(nextPhotoUrl);
        editorStatus.textContent = "This image could not be opened. Try another file.";
        photoInput.value = "";
    };

    loadedImage.src = nextPhotoUrl;
}

if (photoInput) {
    photoInput.addEventListener("change", () => loadPhoto(photoInput.files[0]));

    ["dragenter", "dragover"].forEach((eventName) => {
        dropArea.addEventListener(eventName, (event) => {
            event.preventDefault();
            dropArea.classList.add("is-dragging");
        });
    });

    ["dragleave", "drop"].forEach((eventName) => {
        dropArea.addEventListener(eventName, (event) => {
            event.preventDefault();
            dropArea.classList.remove("is-dragging");
        });
    });

    dropArea.addEventListener("drop", (event) => {
        loadPhoto(event.dataTransfer.files[0]);
    });

    photoControls.forEach((control) => {
        control.addEventListener("input", updatePhotoPreview);
    });

    resetPhotoButton.addEventListener("click", () => {
        photoControls.forEach((control) => { control.value = "100"; });
        rotation = 0;
        photoImage.style.transform = "rotate(0deg)";
        updatePhotoPreview();
    });

    rotatePhotoButton.addEventListener("click", () => {
        rotation = (rotation + 90) % 360;
        photoImage.style.transform = `rotate(${rotation}deg)`;
    });

    downloadPhotoButton.addEventListener("click", () => {
        const canvas = document.createElement("canvas");
        const sourceWidth = photoImage.naturalWidth;
        const sourceHeight = photoImage.naturalHeight;
        const sideways = rotation === 90 || rotation === 270;
        canvas.width = sideways ? sourceHeight : sourceWidth;
        canvas.height = sideways ? sourceWidth : sourceHeight;

        const context = canvas.getContext("2d");
        context.filter =
            `brightness(${brightnessControl.value}%) contrast(${contrastControl.value}%) saturate(${saturationControl.value}%)`;
        context.translate(canvas.width / 2, canvas.height / 2);
        context.rotate((rotation * Math.PI) / 180);
        context.drawImage(photoImage, -sourceWidth / 2, -sourceHeight / 2);

        const outputType = ["image/jpeg", "image/png", "image/webp"].includes(photoImage.dataset.type)
            ? photoImage.dataset.type
            : "image/png";
        canvas.toBlob((blob) => {
            if (!blob) {
                editorStatus.textContent = "The edited image could not be created. Try again.";
                return;
            }

            const downloadUrl = URL.createObjectURL(blob);
            const link = document.createElement("a");
            const extension = outputType.split("/")[1];
            link.href = downloadUrl;
            link.download = `${originalPhotoName}-edited.${extension}`;
            link.click();
            URL.revokeObjectURL(downloadUrl);
        }, outputType, 0.92);
    });

}
