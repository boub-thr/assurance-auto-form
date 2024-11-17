document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('insurance-form');
    const claimsSelect = document.getElementById('claims');
    const numClaimsInput = document.getElementById('num-claims');
    const claimsList = document.getElementById('claims-list');
    const claimDetails = document.getElementById('claim-details');
    const resultDiv = document.getElementById('result');
    const birthdateInput = document.getElementById('birthdate');
    const carValueInput = document.getElementById('car-value');
    const carYearInput = document.getElementById('car-year');
    const mileageInput = document.getElementById('mileage');

    // Fonction de validation de la date de naissance
    function validateBirthdate() {
        const birthdate = new Date(birthdateInput.value);
        const today = new Date();
        const errorMessage = document.getElementById('birthdate-error');

        // Vérifier si la date est dans le futur
        if (birthdate > today) {
            errorMessage.textContent = "La date de naissance ne peut pas être dans le futur.";
            birthdateInput.classList.add("error-outline");
            return false;
        }

        // Vérifier si la date est valide
        if (isNaN(birthdate)) {
            errorMessage.textContent = "Veuillez entrer une date valide.";
            birthdateInput.classList.add("error-outline");
            return false;
        }

        // Si tout est valide, effacer le message d'erreur
        birthdateInput.classList.remove("error-outline")
        errorMessage.textContent = '';
        return true;
    }
    // Fonction de validation pour la valeur du véhicule
    function validateCarValue() {
        const errorMessage = document.getElementById('car-value-error');
        if (carValueInput.value <= 0) {
            errorMessage.textContent = "La valeur du véhicule doit être positive.";
            carValueInput.classList.add("error-outline");
            return false;
        }
        carValueInput.classList.remove("error-outline");
        errorMessage.textContent = '';
        return true;
    }

    // Fonction de validation pour l'année du véhicule
    function validateCarYear() {
        const year = +carYearInput.value;
        const currentYear = new Date().getFullYear();
        const errorMessage = document.getElementById('car-year-error');
        if (year < 1999 || year > currentYear) {
            errorMessage.textContent = `L'année doit être entre 1999 et ${currentYear}.`;
            carYearInput.classList.add("error-outline");
            return false;
        }
        carYearInput.classList.remove("error-outline");
        errorMessage.textContent = '';
        return true;
    }

    // Fonction de validation pour le kilométrage
    function validateMileage() {
        const errorMessage = document.getElementById('mileage-error');
        nbrMileage = +mileageInput.value  // le + pour convertir le string en numbre
        console.log("mileageInput: ", mileageInput);
        console.log("mileageInput: converted by nuber", Number (nbrMileage));
        console.log("mileageInput: converted by nuber", +nbrMileage);
        console.log("value of mileageInput: ", mileageInput.value);
        console.log("string: ", '12');
        console.log("number: ", 12);
       
        if (nbrMileage <= 0) {
            errorMessage.textContent = "Le kilométrage doit être un nombre positif.";
            mileageInput.classList.add("error-outline");
            return false;
        }
        if (nbrMileage > 50000 ){ 
            errorMessage.textContent = "Le kilométrage doit être inferieur a 50000km.";
            mileageInput.classList.add("error-outline");
          return false; 
        } 
          mileageInput.classList.remove("error-outline");
        errorMessage.textContent = '';
        return true;
    }
    // Afficher ou masquer les détails des réclamations
    claimsSelect.addEventListener('change', function () {
        const claimDetails = document.getElementById('claim-details')
        if (claimsSelect.value === 'oui') {
            claimDetails.style.display = 'block';
        } else {
            claimDetails.style.display = 'none';
            claimsList.innerHTML = ''; // Réinitialiser la liste des réclamations
        }
    });

    // Générer les champs de réclamation selon le nombre spécifié
    numClaimsInput.addEventListener('input', function () {
        claimsList.innerHTML = ''; // Réinitialiser la liste des réclamations
        const numClaims = parseInt(numClaimsInput.value) || 0;
        for (let i = 1; i <= numClaims; i++) {
            const claimItem = document.createElement('div');
            claimItem.innerHTML = `
                <label for="claim-amount-${i}">Pour la réclamation #${i}, quel montant avez-vous réclamé ?</label>
                <input type="number" id="claim-amount-${i}" name="claim-amount-${i}" required>
            `;
            claimsList.appendChild(claimItem);
        }
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Récupérer les valeurs saisies
        const gender = document.getElementById('gender').value;
        const birthdate = document.getElementById('birthdate').value;
        const carValue = parseFloat(document.getElementById('car-value').value);
        const carYear = parseInt(document.getElementById('car-year').value);
        const mileage = parseInt(document.getElementById('mileage').value);
        const camera = document.getElementById('camera').value;
        const claims = claimsSelect.value;
        const numClaims = claims === 'oui' ? parseInt(numClaimsInput.value) : 0;

        let totalClaimAmount = 0;
        if (numClaims > 0) {
            for (let i = 1; i <= numClaims; i++) {
                const claimAmount = parseFloat(document.getElementById(`claim-amount-${i}`).value) || 0;
                totalClaimAmount += claimAmount;
            }
        }

        // Calculer l'âge de l'utilisateur
        const age = calculateAge(birthdate);

        // Vérifier si l'utilisateur est trop risqué
        if (isTooRisky(gender, age, carYear, carValue, mileage, camera, numClaims, totalClaimAmount)) {
            displayResult("Désolé, nous n'avons aucun produit à offrir pour ce profil de client.", true);
            return;
        }

        // Calcul du montant d'assurance
        let baseAmount = calculateBaseAmount(gender, age, carValue);
        let insuranceAmount = baseAmount + (350 * numClaims) + (0.02 * mileage);

        if (totalClaimAmount > 25000) {
            insuranceAmount += 700;
        }

        // Afficher le résultat
        displayResult(`Votre montant d'assurance annuel est de ${insuranceAmount.toFixed(2)}$.`);
    });

    function isTooRisky(gender, age, carYear, carValue, mileage, camera, numClaims, totalClaimAmount) {
        return (
            (age < 18 ) ||
            (gender === 'femme' && age < 16) ||
            (gender === 'homme' && age < 18) ||
            (gender === 'non-binaire' && age < 18) ||
            age >= 100 ||
            carYear < new Date().getFullYear() - 25 ||
            carValue > 100000 ||
            mileage > 50000 ||
            camera === 'non' ||
            numClaims > 4 ||
            totalClaimAmount > 35000
        );
    }

    function calculateBaseAmount(gender, age, carValue) {
        if ((gender === 'homme' || gender === 'non-binaire') && age < 25) {
            return carValue * 0.05;
        } else if (age >= 75) {
            return carValue * 0.04;
        } else {
            return carValue * 0.015;
        }
    }

    function calculateAge(birthdate) {
        const birthDateObj = new Date(birthdate);
        const today = new Date();
        let age = today.getFullYear() - birthDateObj.getFullYear();
        const monthDiff = today.getMonth() - birthDateObj.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
            age--;
        }
        return age;
    }

    function displayResult(message, isError = false) {
        resultDiv.innerText = message;
        resultDiv.className = isError ? 'error' : 'success';
        resultDiv.style.display = 'block';
    }

    // Ajouter des écouteurs d'événements sur chaque champ
    birthdateInput.addEventListener('change', validateBirthdate);
    carValueInput.addEventListener('input', validateCarValue);
    carYearInput.addEventListener('change', validateCarYear);
    mileageInput.addEventListener('input', validateMileage);
});
