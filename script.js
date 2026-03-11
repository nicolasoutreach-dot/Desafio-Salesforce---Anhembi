document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('desafio-form');
    const steps = document.querySelectorAll('.form-step');
    const stepperSteps = document.querySelectorAll('.stepper .step');
    const stepperLines = document.querySelectorAll('.stepper .step-line');
    const phoneInput = document.getElementById('phone');

    let currentStep = 1;

    // ============================
    // Check available spots
    // ============================

    // Inscrições encerradas
    form.style.display = 'none';
    document.querySelector('.stepper').style.display = 'none';
    document.getElementById('vagas-esgotadas').style.display = 'block';

    // ============================
    // Navigation
    // ============================

    document.querySelectorAll('.btn-next').forEach(btn => {
        btn.addEventListener('click', () => {
            if (validateStep(currentStep)) {
                goToStep(currentStep + 1);
            }
        });
    });

    document.querySelectorAll('.btn-prev').forEach(btn => {
        btn.addEventListener('click', () => {
            goToStep(currentStep - 1);
        });
    });

    stepperSteps.forEach((stepEl, i) => {
        stepEl.addEventListener('click', () => {
            const targetStep = i + 1;
            if (targetStep === currentStep) return;
            if (targetStep < currentStep) {
                goToStep(targetStep);
            } else {
                let canAdvance = true;
                for (let s = currentStep; s < targetStep; s++) {
                    if (!validateStep(s)) { canAdvance = false; break; }
                }
                if (canAdvance) goToStep(targetStep);
            }
        });
    });

    let isAnimating = false;

    function goToStep(step) {
        if (isAnimating || step === currentStep) return;
        isAnimating = true;

        const direction = step > currentStep ? 'left' : 'right';
        const currentEl = document.querySelector(`.form-step[data-step="${currentStep}"]`);
        const nextEl = document.querySelector(`.form-step[data-step="${step}"]`);

        const outClass = direction === 'left' ? 'slide-out-left' : 'slide-out-right';
        const inClass = direction === 'left' ? 'slide-in-right' : 'slide-in-left';

        currentEl.classList.add(outClass);

        currentEl.addEventListener('animationend', function handler() {
            currentEl.removeEventListener('animationend', handler);
            currentEl.classList.remove('active', outClass, 'slide-out-left', 'slide-out-right');
            currentEl.style.display = 'none';

            nextEl.style.display = 'block';
            nextEl.classList.remove('slide-in-left', 'slide-in-right');
            nextEl.classList.add('active', inClass);

            nextEl.addEventListener('animationend', function handler2() {
                nextEl.removeEventListener('animationend', handler2);
                nextEl.classList.remove(inClass);
                isAnimating = false;
            });
        });

        stepperSteps.forEach((s, i) => {
            const stepNum = i + 1;
            s.classList.remove('active', 'completed');
            if (stepNum === step) {
                s.classList.add('active');
            } else if (stepNum < step) {
                s.classList.add('completed');
            }
        });

        stepperLines.forEach((line, i) => {
            line.classList.toggle('active', i < step - 1);
        });

        currentStep = step;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // ============================
    // Phone mask (BR format)
    // ============================

    phoneInput.addEventListener('input', (e) => {
        let val = e.target.value.replace(/\D/g, '');
        if (val.length > 11) val = val.slice(0, 11);

        if (val.length > 6) {
            val = `(${val.slice(0, 2)}) ${val.slice(2, 7)}-${val.slice(7)}`;
        } else if (val.length > 2) {
            val = `(${val.slice(0, 2)}) ${val.slice(2)}`;
        } else if (val.length > 0) {
            val = `(${val}`;
        }
        e.target.value = val;
    });

    // ============================
    // Validation
    // ============================

    function validateStep(step) {
        const currentFormStep = document.querySelector(`.form-step[data-step="${step}"]`);
        const inputs = currentFormStep.querySelectorAll('input[required], select[required], textarea[required]');
        let valid = true;

        inputs.forEach(input => {
            const group = input.closest('.form-group');
            if (!group) return;

            clearError(group);

            if (!input.value.trim()) {
                setError(group, 'Este campo é obrigatório.');
                valid = false;
            } else if (input.type === 'email' && !isValidEmail(input.value)) {
                setError(group, 'Digite um email válido.');
                valid = false;
            } else if (input.type === 'url' && !isValidURL(input.value)) {
                setError(group, 'Digite uma URL válida (ex: https://...)');
                valid = false;
            }
        });

        if (step === 3) {
            const trailheadInput = document.getElementById('trailhead_url');
            if (trailheadInput && trailheadInput.value.trim()) {
                const url = trailheadInput.value.trim().toLowerCase();
                if (!url.includes('trailhead.salesforce.com') && !url.includes('salesforce.com/trailblazer')) {
                    const group = trailheadInput.closest('.form-group');
                    setError(group, 'O link deve ser do Trailhead (trailhead.salesforce.com ou salesforce.com/trailblazer). Cole o link do seu perfil público.');
                    valid = false;
                }
            }

            const linkedinInput = document.getElementById('linkedin_url');
            if (linkedinInput && linkedinInput.value.trim()) {
                const url = linkedinInput.value.trim().toLowerCase();
                if (!url.includes('linkedin.com')) {
                    const group = linkedinInput.closest('.form-group');
                    setError(group, 'O link deve ser do LinkedIn (linkedin.com/in/seu-perfil).');
                    valid = false;
                }
            }
        }

        return valid;
    }

    function setError(group, message) {
        group.classList.add('has-error');
        const errorEl = group.querySelector('.error-msg');
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.style.display = 'block';
        }
    }

    function clearError(group) {
        group.classList.remove('has-error');
        const errorEl = group.querySelector('.error-msg');
        if (errorEl) {
            errorEl.textContent = '';
            errorEl.style.display = 'none';
        }
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function isValidURL(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    document.querySelectorAll('.form-group input, .form-group select, .form-group textarea').forEach(el => {
        el.addEventListener('input', () => {
            const group = el.closest('.form-group');
            if (group && group.classList.contains('has-error')) {
                clearError(group);
            }
        });
    });

    // ============================
    // Form Submission (Web-to-Lead)
    // ============================

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!validateStep(currentStep)) return;

        const graduationDate = document.getElementById('graduation_date').value;
        const englishLevel = document.getElementById('english_level').value;
        const trailheadUrl = document.getElementById('trailhead_url').value.trim();
        const certifications = document.getElementById('certifications').value.trim();
        const linkedinUrl = document.getElementById('linkedin_url').value.trim();


        const hiddenForm = document.createElement('form');
        hiddenForm.method = 'POST';
        hiddenForm.action = 'https://webto.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8';
        hiddenForm.style.display = 'none';
        hiddenForm.acceptCharset = 'UTF-8';

        const obrigadoUrl = new URL('obrigado.html', window.location.href).href;
        const fields = {
            oid: '00DWt00000GGfdt',
            retURL: obrigadoUrl,
            first_name: document.getElementById('first_name').value.trim(),
            last_name: document.getElementById('last_name').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            company: 'Desafio Salesforce',
            title: document.getElementById('title').value.trim(),
            lead_source: 'Anhembi Morumbi',
            Data_de_Graduacao__c: graduationDate,
            Nivel_de_Ingles__c: englishLevel,
            Perfil_Trailhead__c: trailheadUrl,
            Certificacoes__c: certifications,
            Perfil_LinkedIn__c: linkedinUrl,
        };

        Object.entries(fields).forEach(([name, value]) => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = name;
            input.value = value;
            hiddenForm.appendChild(input);
        });

        document.body.appendChild(hiddenForm);
        hiddenForm.submit();
    });
});
