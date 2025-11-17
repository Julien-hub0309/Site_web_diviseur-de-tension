
function removeHighlights() {
    const highlights = document.querySelectorAll(".highlight");
    highlights.forEach(span => {
        const parent = span.parentNode;
        // Check if parent and textContent exist before replacement
        if (parent && span.textContent !== null) {
            parent.replaceChild(document.createTextNode(span.textContent), span);
            parent.normalize(); // merge adjacent text nodes
        }
    });
}

function highlightText(node, keyword) {
    const regex = new RegExp(`(${keyword})`, "gi");
    const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null, false);
    const textNodes = [];

    while (walker.nextNode()) {
        // Ensure the text node is not inside a script or style tag and has actual text
        if (walker.currentNode.parentNode.nodeName !== 'SCRIPT' && 
            walker.currentNode.parentNode.nodeName !== 'STYLE' &&
            walker.currentNode.nodeValue.trim().length > 0) {
            textNodes.push(walker.currentNode);
        }
    }

    let found = false; // To track if any highlights were made
    textNodes.forEach(textNode => {
        const value = textNode.nodeValue;
        if (regex.test(value)) {
            const span = document.createElement("span");
            span.innerHTML = value.replace(regex, '<span class="highlight">$&</span>'); // Use $& to insert the matched string
            textNode.parentNode.replaceChild(span, textNode);
            found = true;
        }
    });
    return found; // Return true if any highlights were found
}

function searchKeyword() {
    removeHighlights(); // clean old highlights

    const keyword = document.getElementById("searchInput").value.trim();
    if (!keyword) {
        // No need for alert, maybe a visual cue instead
        console.log("Veuillez entrer un mot clé.");
        return;
    }

    const contentZones = document.querySelectorAll("main, .glossaire-content, footer");
    let keywordFound = false;
    contentZones.forEach(zone => {
        if (highlightText(zone, keyword)) {
            keywordFound = true;
        }
    });

    if (!keywordFound) {
        alert(`Le mot-clé "${keyword}" n'a pas été trouvé.`);
    }
}

// --- Mobile Navigation Toggle ---
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.nav-list');

    if (menuToggle && navList) {
        menuToggle.addEventListener('click', () => {
            navList.classList.toggle('active');
            // Toggle aria-expanded for accessibility
            const isExpanded = navList.classList.contains('active');
            menuToggle.setAttribute('aria-expanded', isExpanded);
        });

        // Close menu when a nav link is clicked (for single-page feel or fast navigation)
        navList.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (navList.classList.contains('active')) {
                    navList.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', false);
                }
            });
        });

        // Close menu if clicked outside (optional, but good for UX)
        document.addEventListener('click', (event) => {
            if (!navList.contains(event.target) && !menuToggle.contains(event.target) && navList.classList.contains('active')) {
                navList.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', false);
            }
        });
    }
});

// À ajouter dans script.js
function toggleMenu() {
    const navList = document.querySelector('.nav-list');
    navList.classList.toggle('active');
}

document.addEventListener('DOMContentLoaded', () => {
    // ---------------------------------------------------
    // 1. LOGIQUE DU CONVERTISSEUR DE TENSION
    // ---------------------------------------------------

    const calculateButton = document.getElementById('calculate-btn');
    if (calculateButton) {
        // Ajoute l'écouteur d'événement au bouton de calcul de la page Convertisseur
        calculateButton.addEventListener('click', calculateVoltageDivider);
    }

    /**
     * Calcule la tension de sortie (Vout) du pont diviseur de tension.
     * Vout = Vin * (R2 / (R1 + R2))
     */
    function calculateVoltageDivider() {
        // Récupération des éléments d'entrée et de sortie
        const vinInput = document.getElementById('vin');
        const r1Input = document.getElementById('r1');
        const r2Input = document.getElementById('r2');
        const resultDisplay = document.getElementById('vout-result');
        const converterBox = document.querySelector('.converter-box');

        // Récupération des valeurs numériques et validation de base
        const Vin = parseFloat(vinInput ? vinInput.value : NaN);
        const R1 = parseFloat(r1Input ? r1Input.value : NaN);
        const R2 = parseFloat(r2Input ? r2Input.value : NaN);

        // Réinitialisation de l'affichage
        resultDisplay.textContent = '-- V';
        converterBox.style.boxShadow = '0 0 15px rgba(0, 255, 255, 0.5)'; // Reset lueur
        resultDisplay.classList.remove('data-error'); 
        resultDisplay.classList.add('data-good');

        // Validation des entrées (Doivent être des nombres positifs)
        if (isNaN(Vin) || isNaN(R1) || isNaN(R2) || Vin <= 0 || R1 <= 0 || R2 <= 0) {
            
            // Affichage de l'erreur dans le style Électrique/Acier
            resultDisplay.textContent = 'ERREUR: Entrées Invalides.';
            resultDisplay.classList.remove('data-good'); 
            resultDisplay.classList.add('data-error'); 
            
            // Renforce l'alerte visuelle (box-shadow rouge)
            converterBox.style.boxShadow = '0 0 20px var(--color-error)'; 
            return;
        }

        // Calcul du pont diviseur
        const Vout = Vin * (R2 / (R1 + R2));

        // Affichage du résultat avec 3 décimales
        resultDisplay.textContent = `${Vout.toFixed(3)} V`;
    }

    // ---------------------------------------------------
    // 2. LOGIQUE DE NAVIGATION MOBILE
    // ---------------------------------------------------

    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.nav-list');

    if (menuToggle && navList) {
        menuToggle.addEventListener('click', toggleMenu);
    }
});

/**
 * Fonction pour basculer la classe 'active' sur la liste de navigation
 * pour afficher/masquer le menu sur mobile (utilisé par le CSS @media).
 */
function toggleMenu() {
    const navList = document.querySelector('.nav-list');
    if (navList) {
        navList.classList.toggle('active');
    }
}