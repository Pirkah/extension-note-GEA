// 1. Création de l'overlay complet (configuré en mode REDUIT par défaut au lancement)
const overlay = document.createElement('div');
overlay.id = 'ext-gea-overlay';
overlay.style.position = 'fixed';
overlay.style.top = '20px';
overlay.style.right = '20px';
overlay.style.backgroundColor = '#1e293b';
overlay.style.color = '#f8fafc';
overlay.style.boxShadow = '0 10px 25px rgba(0,0,0,0.5)';
overlay.style.zIndex = '99999';
overlay.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
overlay.style.border = '1px solid #334155';
overlay.style.transition = 'all 0.2s ease-in-out';
overlay.style.overflow = 'hidden';

// Style initial du petit badge rond iGraal
overlay.style.width = '45px';
overlay.style.height = '45px';
overlay.style.padding = '0';
overlay.style.display = 'flex';
overlay.style.alignItems = 'center';
overlay.style.justifyContent = 'center';
overlay.style.borderRadius = '50%';
overlay.style.cursor = 'move'; 

overlay.innerHTML = `
    <div id="ext-header" style="display: flex; justify-content: space-between; align-items: center; user-select: none; margin: 0; border: none; padding: 0; width: 100%; height: 100%; justify-content: center;">
        <span id="ext-title-text" style="color: #38bdf8; font-weight: bold; font-size: 20px; display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;">🎯</span>
        <div id="ext-actions-bloc" style="display: none; align-items: center; gap: 10px; margin-left: auto;">
            <a id="ext-twitter-link" href="https://twitter.com/pirkaah" target="_blank" title="Mon Twitter" style="text-decoration: none; color: #1d9bf0; font-size: 14px; display: flex; align-items: center; font-weight: bold;">
                𝕏
            </a>
            <button id="ext-minimize" style="background: none; border: none; color: #94a3b8; cursor: pointer; font-size: 16px; padding: 0 5px; line-height: 1;">−</button>
        </div>
    </div>
    
    <div id="ext-tabs" style="display: none; gap: 5px; margin-bottom: 12px; border-bottom: 1px solid #334155; padding-bottom: 8px; width: 100%;">
        <button id="tab-btn-annee" style="flex: 1; background: #38bdf8; color: #0f172a; border: none; padding: 5px; border-radius: 4px; cursor: pointer; font-size: 11px; font-weight: bold;">Année</button>
        <button id="tab-btn-s1" style="flex: 1; background: #1e293b; color: #94a3b8; border: 1px solid #334155; padding: 5px; border-radius: 4px; cursor: pointer; font-size: 11px; font-weight: bold;">Semestre 1</button>
        <button id="tab-btn-s2" style="flex: 1; background: #1e293b; color: #94a3b8; border: 1px solid #334155; padding: 5px; border-radius: 4px; cursor: pointer; font-size: 11px; font-weight: bold;">Semestre 2</button>
    </div>

    <div id="ext-content" style="display: none; width: 100%;">Analyse du bulletin...</div>
`;
document.body.appendChild(overlay);

// ---- VARIABLES D'ÉTAT ----
let currentView = 'annee'; 
let isMinimized = true;

// ---- DRAG & DROP RÉACTIF ET COMPATIBLE CLIC ----
let isDragging = false;
let initialX, initialY;
let startX = 0, startY = 0;

overlay.addEventListener('mousedown', (e) => {
    if (e.target.closest('a') || e.target.closest('button')) return;
    
    isDragging = true;
    overlay.style.transition = 'none'; // CORRIGÉ : Plus de double .style !
    
    initialX = e.clientX - overlay.offsetLeft;
    initialY = e.clientY - overlay.offsetTop;
    
    startX = e.clientX;
    startY = e.clientY;
});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        e.preventDefault();
        overlay.style.left = (e.clientX - initialX) + 'px';
        overlay.style.top = (e.clientY - initialY) + 'px';
        overlay.style.right = 'auto';
    }
});

document.addEventListener('mouseup', (e) => {
    if (isDragging) {
        isDragging = false;
        overlay.style.transition = 'all 0.2s ease-in-out';
    }
});

// ---- BASCULE OUVERTURE / FERMETURE ----
const minBtn = document.getElementById('ext-minimize');
const extContent = document.getElementById('ext-content');
const extTabsBar = document.getElementById('ext-tabs');
const titleText = document.getElementById('ext-title-text');
const twitterLink = document.getElementById('ext-twitter-link');
const actionsBloc = document.getElementById('ext-actions-bloc');
const headerElement = document.getElementById('ext-header');

function basculerModeReduit() {
    isMinimized = !isMinimized;
    
    if (isMinimized) {
        extContent.style.display = 'none';
        extTabsBar.style.display = 'none';
        actionsBloc.style.display = 'none';
        overlay.style.overflowY = 'hidden';
        
        titleText.innerText = '🎯';
        titleText.style.fontSize = '20px';
        titleText.style.textAlign = 'center';
        titleText.style.justifyContent = 'center';
        titleText.style.width = '100%';
        titleText.style.height = '100%';
        
        headerElement.style.justifyContent = 'center';
        headerElement.style.margin = '0';
        headerElement.style.border = 'none';
        headerElement.style.padding = '0';
        
        overlay.style.width = '45px';
        overlay.style.height = '45px';
        overlay.style.padding = '0';
        overlay.style.display = 'flex';
        overlay.style.borderRadius = '50%';
    } else {
        overlay.style.display = 'block';
        overlay.style.width = '360px';
        overlay.style.height = 'auto';
        overlay.style.padding = '15px';
        overlay.style.borderRadius = '12px';
        
        titleText.innerText = '🎯 Simulateur Universitaire GEA';
        titleText.style.fontSize = '14px';
        titleText.style.textAlign = 'left';
        titleText.style.justifyContent = 'flex-start';
        titleText.style.width = 'auto';
        titleText.style.height = 'auto';
        
        headerElement.style.justifyContent = 'space-between';
        headerElement.style.marginBottom = '10px';
        headerElement.style.borderBottom = '2px solid #334155';
        headerElement.style.paddingBottom = '8px';
        
        actionsBloc.style.display = 'flex';
        extTabsBar.style.display = 'flex';
        extContent.style.display = 'block';
        
        overlay.style.maxHeight = '80vh';
        overlay.style.overflowY = 'auto';
        
        minBtn.innerText = '−';
        genererVueOverlay();
    }
}

// Réduire au clic sur le bouton moins
minBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    basculerModeReduit();
});

// Ouvrir au clic si ce n'est pas un drag
overlay.addEventListener('click', (e) => {
    if (e.target.closest('a') || e.target.closest('button')) return;
    
    // On calcule l'écart de pixel réel entre le clic et le relâchement
    const deltaX = Math.abs(e.clientX - startX);
    const deltaY = Math.abs(e.clientY - startY);
    
    // Si l'overlay est fermé ET que la souris a bougé de moins de 6 pixels, c'est un vrai clic d'ouverture
    if (isMinimized && deltaX < 6 && deltaY < 6) {
        basculerModeReduit();
    }
});

// ---- MOTEUR DE CALCULS ----
function extraireSemestre(idConteneur) {
    const conteneur = document.getElementById(idConteneur);
    if (!conteneur) return [];

    const lignes = conteneur.querySelectorAll('tr');
    let ues = [];
    let currentUE = null;

    lignes.forEach(ligne => {
        if (ligne.classList.contains('level-1')) {
            const caseCode = ligne.querySelector('.code');
            const caseNom = ligne.querySelector('td:nth-child(2)');
            
            if (currentUE) ues.push(currentUE);

            currentUE = {
                code: caseCode ? caseCode.innerText.trim() : "UE",
                nom: caseNom ? caseNom.innerText.trim() : "Compétence",
                elements: []
            };
        } 
        else if (ligne.classList.contains('level-2') && currentUE) {
            const caseCode = ligne.querySelector('.code');
            const caseNom = ligne.querySelector('td:nth-child(2)');
            const caseCoef = ligne.querySelector('.coefficient');
            const caseMoy = ligne.querySelector('.moyenne');

            const coef = caseCoef ? parseFloat(caseCoef.innerText.replace(',', '.')) : NaN;
            const moyenne = caseMoy ? parseFloat(caseMoy.innerText.replace(',', '.')) : NaN;

            if (!isNaN(coef)) {
                currentUE.elements.push({
                    code: caseCode ? caseCode.innerText.trim() : "",
                    nom: caseNom ? caseNom.innerText.trim().split('\n')[0] : "",
                    coef: coef,
                    moyenne: moyenne
                });
            }
        }
    });
    if (currentUE) ues.push(currentUE);
    return ues;
}

function genererHtmlUeSolo(ue, objectifFixe = 10) {
    const ueBox = document.createElement('div');
    ueBox.style.backgroundColor = '#0f172a';
    ueBox.style.padding = '10px';
    ueBox.style.borderRadius = '8px';
    ueBox.style.marginBottom = '10px';
    ueBox.style.border = '1px solid #1e293b';

    let pointsAcquis = 0;
    let coefTotal = 0;
    let coefManquant = 0;
    let htmlElements = "";

    ue.elements.forEach(el => {
        coefTotal += el.coef;
        let couleurTexte = '#94a3b8'; 
        if (el.nom.toLowerCase().includes('portfolio')) couleurTexte = '#c084fc';
        if (el.nom.toLowerCase().includes('stage')) couleurTexte = '#38bdf8';

        if (!isNaN(el.moyenne)) {
            pointsAcquis += el.moyenne * el.coef;
            htmlElements += `
                <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 2px; color: ${couleurTexte};">
                    <span>${el.code} ${el.nom.substring(0, 15)}... (x${el.coef})</span>
                    <span style="color: #2ecc71; font-weight: bold;">${el.moyenne.toFixed(2)}</span>
                </div>
            `;
        } else {
            coefManquant += el.coef;
            htmlElements += `
                <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 2px; color: #eab308;">
                    <span>❓ ${el.code} ${el.nom.substring(0, 15)}... (x${el.coef})</span>
                    <span>En attente</span>
                </div>
            `;
        }
    });

    if (coefTotal === 0) return null;

    let objectifHtml = "";
    const pointsRequisPourCible = (objectifFixe * coefTotal) - pointsAcquis;

    if (coefManquant === 0) {
        const moyFinale = pointsAcquis / coefTotal;
        const validation = moyFinale >= objectifFixe ? '✅ Validé' : '❌ Non validé';
        const colorVal = moyFinale >= objectifFixe ? '#2ecc71' : '#ef4444';
        objectifHtml = `<div style="text-align: center; font-size: 11px; margin-top: 8px; color: ${colorVal}; font-weight: bold; background: #1e293b; padding: 4px; border-radius: 4px;">Moyenne : ${moyFinale.toFixed(2)} (${validation})</div>`;
    } else {
        const noteCible = pointsRequisPourCible / coefManquant;
        if (noteCible <= 0) {
            objectifHtml = `<div style="text-align: center; font-size: 11px; margin-top: 8px; color: #2ecc71; font-weight: bold; background: #1e293b; padding: 4px; border-radius: 4px;">✅ Déjà validé !</div>`;
        } else if (noteCible <= 20) {
            objectifHtml = `<div style="text-align: center; font-size: 11px; margin-top: 8px; color: #38bdf8; background: #1e293b; padding: 4px; border-radius: 4px;">🎯 Note moy. requise : <strong style="font-size:12px; color:#fff;">${noteCible.toFixed(2)}</strong>/20</div>`;
        } else {
            objectifHtml = `<div style="text-align: center; font-size: 11px; margin-top: 8px; color: #ef4444; background: #1e293b; padding: 4px; border-radius: 4px;">⚠️ Impossible (Requis: ${noteCible.toFixed(2)})</div>`;
        }
    }

    ueBox.innerHTML = `
        <div style="font-size: 12px; font-weight: bold; color: #e2e8f0; margin-bottom: 6px; border-bottom: 1px solid #334155; padding-bottom: 3px; display: flex; justify-content: space-between;">
            <span>${ue.code}</span>
            <span style="color:#38bdf8; font-size:11px;">Objectif ${objectifFixe.toFixed(1)}</span>
        </div>
        ${htmlElements}
        ${objectifHtml}
    `;
    return ueBox;
}

function genererVueOverlay() {
    const dataS1 = extraireSemestre('semestre-S1');
    const dataS2 = extraireSemestre('semestre-S2');
    const container = document.getElementById('ext-content');
    container.innerHTML = "";

    if (currentView === 's1') {
        if (dataS1.length === 0) return;
        dataS1.forEach(ue => {
            const elHtml = genererHtmlUeSolo(ue, 10);
            if (elHtml) container.appendChild(elHtml);
        });
    }
    else if (currentView === 's2') {
        if (dataS2.length === 0) return;
        dataS2.forEach(ue => {
            const elHtml = genererHtmlUeSolo(ue, 10);
            if (elHtml) container.appendChild(elHtml);
        });
    }
    else if (currentView === 'annee') {
        let moyennesS1 = {};
        dataS1.forEach(ue => {
            let pts = 0; let totalCoef = 0;
            ue.elements.forEach(el => {
                if (!isNaN(el.moyenne)) { pts += el.moyenne * el.coef; totalCoef += el.coef; }
            });
            const numUE = ue.code.replace(/[^0-9.]/g, ""); 
            moyennesS1[numUE] = totalCoef > 0 ? (pts / totalCoef) : NaN;
        });

        if (dataS2.length === 0) return;

        dataS2.forEach(ue => {
            const ueBox = document.createElement('div');
            ueBox.style.backgroundColor = '#0f172a';
            ueBox.style.padding = '10px';
            ueBox.style.borderRadius = '8px';
            ueBox.style.marginBottom = '12px';
            ueBox.style.border = '1px solid #1e293b';

            const numS2 = ue.code.replace(/[^0-9.]/g, ""); 
            const numS1Correspondant = numS2.replace('2.', '1.'); 
            const moyenneS1Associee = moyennesS1[numS1Correspondant];

            let pointsAcquisS2 = 0; let coefTotalS2 = 0; let coefManquantS2 = 0; let htmlElements = "";

            ue.elements.forEach(el => {
                coefTotalS2 += el.coef;
                let couleur = '#94a3b8';
                if (el.nom.toLowerCase().includes('port')) couleur = '#c084fc';
                if (el.nom.toLowerCase().includes('stage')) couleur = '#38bdf8';

                if (!isNaN(el.moyenne)) {
                    pointsAcquisS2 += el.moyenne * el.coef;
                    htmlElements += `
                        <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 2px; color: ${couleur};">
                            <span>${el.code} ${el.nom.substring(0, 14)}... (x${el.coef})</span>
                            <span style="color: #2ecc71; font-weight: bold;">${el.moyenne.toFixed(2)}</span>
                        </div>
                    `;
                } else {
                    coefManquantS2 += el.coef;
                    htmlElements += `
                        <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 2px; color: #eab308;">
                            <span>❓ ${el.code} ${el.nom.substring(0, 14)}... (x${el.coef})</span>
                            <span>En attente</span>
                        </div>
                    `;
                }
            });

            let noteCibleS2 = 10; let enteteCompensation = "";
            if (!isNaN(moyenneS1Associee)) {
                noteCibleS2 = 20 - moyenneS1Associee;
                enteteCompensation = `<div style="font-size: 10px; color: #94a3b8; margin-bottom: 4px;">Moyenne S1 (${numS1Correspondant}) : <strong style="color: #fff;">${moyenneS1Associee.toFixed(2)}/20</strong> -> Objectif S2 : <strong style="color: #38bdf8;">${noteCibleS2.toFixed(2)}/20</strong></div>`;
            }

            const pointsRequisS2 = (noteCibleS2 * coefTotalS2) - pointsAcquisS2;
            let blocResultatHtml = "";

            if (coefTotalS2 === 0) return;

            if (coefManquantS2 === 0) {
                const moyFinaleS2 = pointsAcquisS2 / coefTotalS2;
                const moyAnnuelle = !isNaN(moyenneS1Associee) ? (moyenneS1Associee + moyFinaleS2) / 2 : moyFinaleS2;
                const valide = moyAnnuelle >= 10 ? '✅ Année Validée' : '❌ Non validé';
                blocResultatHtml = `<div style="text-align: center; font-size: 11px; margin-top: 8px; color: ${moyAnnuelle >= 10 ? '#2ecc71' : '#ef4444'}; font-weight: bold; background: #1e293b; padding: 4px; border-radius: 4px;">Moyenne Annuelle : ${moyAnnuelle.toFixed(2)} (${valide})</div>`;
            } else {
                const moyenneAFaireSurLeReste = pointsRequisS2 / coefManquantS2;
                if (moyenneAFaireSurLeReste <= 0) {
                    blocResultatHtml = `<div style="text-align: center; font-size: 11px; margin-top: 8px; color: #2ecc71; font-weight: bold; background: #1e293b; padding: 4px; border-radius: 4px;">✅ Année déjà sécurisée !</div>`;
                } else if (moyenneAFaireSurLeReste <= 20) {
                    blocResultatHtml = `<div style="text-align: center; font-size: 11px; margin-top: 8px; color: #38bdf8; background: #1e293b; padding: 4px; border-radius: 4px;">🎯 Note moy. requise S2 : <strong style="font-size:12px; color:#fff;">${moyenneAFaireSurLeReste.toFixed(2)}</strong>/20</div>`;
                } else {
                    blocResultatHtml = `<div style="text-align: center; font-size: 11px; margin-top: 8px; color: #ef4444; background: #1e293b; padding: 4px; border-radius: 4px;">⚠️ Impossible de compenser (${moyenneAFaireSurLeReste.toFixed(2)}/20)</div>`;
                }
            }

            ueBox.innerHTML = `
                <div style="font-size: 12px; font-weight: bold; color: #38bdf8; margin-bottom: 4px; border-bottom: 1px solid #334155; padding-bottom: 3px; display: flex; justify-content: space-between;">
                    <span>${ue.code} : ${ue.nom.substring(0, 14)}...</span>
                    <span style="color: #eab308; font-size: 10px;">Année</span>
                </div>
                ${enteteCompensation}
                <div style="margin-top: 6px; border-top: 1px dashed #334155; padding-top: 4px;">
                    ${htmlElements}
                </div>
                ${blocResultatHtml}
            `;
            container.appendChild(ueBox);
        });
    }
}

// ---- INITIALISATION DES ONGLETS ----
function initialiserBoutonsOnglets() {
    const btnAnnee = document.getElementById('tab-btn-annee');
    const btnS1 = document.getElementById('tab-btn-s1');
    const btnS2 = document.getElementById('tab-btn-s2');

    function resetStyles() {
        [btnAnnee, btnS1, btnS2].forEach(btn => {
            btn.style.background = '#1e293b'; btn.style.color = '#94a3b8'; btn.style.border = '1px solid #334155';
        });
    }

    btnAnnee.addEventListener('click', (e) => { e.stopPropagation(); currentView = 'annee'; resetStyles(); btnAnnee.style.background = '#38bdf8'; btnAnnee.style.color = '#0f172a'; genererVueOverlay(); });
    btnS1.addEventListener('click', (e) => { e.stopPropagation(); currentView = 's1'; resetStyles(); btnS1.style.background = '#38bdf8'; btnS1.style.color = '#0f172a'; genererVueOverlay(); });
    btnS2.addEventListener('click', (e) => { e.stopPropagation(); currentView = 's2'; resetStyles(); btnS2.style.background = '#38bdf8'; btnS2.style.color = '#0f172a'; genererVueOverlay(); });
}

document.addEventListener('click', (e) => {
    if (e.target && e.target.closest('.nav-link')) setTimeout(genererVueOverlay, 300);
});

setTimeout(() => {
    initialiserBoutonsOnglets();
    genererVueOverlay();
}, 1200);