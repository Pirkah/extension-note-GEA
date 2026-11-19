// ============================================================================
// SIMULATEUR GEA — SIGNATURES UNILIM (v2.0)
// Intégration native dans la page + Simulation interactive en temps réel
// ============================================================================

(function () {
    'use strict';

    // Nettoyage d'une éventuelle ancienne instance (overlay v1 ou dashboard v2)
    const oldOverlay = document.getElementById('ext-gea-overlay');
    if (oldOverlay) oldOverlay.remove();
    document.querySelectorAll('.gea-sim-injected').forEach(el => el.remove());

    // Injection des styles CSS propres et intégrés au thème Bootstrap de Signatures
    const styleEl = document.createElement('style');
    styleEl.className = 'gea-sim-injected';
    styleEl.textContent = `
        .gea-dashboard {
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            color: #f8fafc;
            border-radius: 12px;
            padding: 18px 20px;
            margin-bottom: 22px;
            box-shadow: 0 8px 24px rgba(15, 23, 42, 0.18);
            border: 1px solid #334155;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        .gea-dash-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 12px;
            padding-bottom: 14px;
            margin-bottom: 16px;
            border-bottom: 1px solid #334155;
        }
        .gea-dash-title {
            display: flex;
            align-items: center;
            gap: 10px;
            margin: 0;
            font-size: 1.15rem;
            font-weight: 700;
            color: #f8fafc;
        }
        .gea-dash-subtitle {
            font-size: 0.8rem;
            color: #94a3b8;
            font-weight: 400;
        }
        .gea-dash-actions {
            display: flex;
            align-items: center;
            gap: 8px;
            flex-wrap: wrap;
        }
        .gea-btn {
            background: #1e293b;
            color: #e2e8f0;
            border: 1px solid #475569;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 0.8rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.15s ease;
            display: inline-flex;
            align-items: center;
            gap: 6px;
        }
        .gea-btn:hover {
            background: #334155;
            border-color: #64748b;
            color: #fff;
        }
        .gea-btn-danger {
            background: rgba(239, 68, 68, 0.15);
            color: #fca5a5;
            border-color: rgba(239, 68, 68, 0.4);
        }
        .gea-btn-danger:hover {
            background: #ef4444;
            color: #fff;
            border-color: #ef4444;
        }
        .gea-ue-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
            gap: 12px;
        }
        .gea-ue-card {
            background: rgba(15, 23, 42, 0.75);
            border: 1px solid #334155;
            border-radius: 10px;
            padding: 12px 14px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            transition: transform 0.15s ease, border-color 0.15s ease;
        }
        .gea-ue-card:hover {
            border-color: #38bdf8;
        }
        .gea-ue-card-top {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 8px;
            margin-bottom: 6px;
        }
        .gea-ue-code {
            font-weight: 800;
            font-size: 0.95rem;
            color: #38bdf8;
        }
        .gea-ue-name {
            font-size: 0.73rem;
            color: #94a3b8;
            line-height: 1.3;
            margin-bottom: 10px;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            min-height: 1.9em;
        }
        .gea-ue-avg-badge {
            font-size: 0.95rem;
            font-weight: 800;
            padding: 3px 8px;
            border-radius: 6px;
            white-space: nowrap;
        }
        .gea-badge-green { background: rgba(34, 197, 94, 0.2); color: #4ade80; border: 1px solid rgba(34, 197, 94, 0.4); }
        .gea-badge-orange { background: rgba(245, 158, 11, 0.2); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.4); }
        .gea-badge-red { background: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.4); }
        .gea-badge-gray { background: rgba(148, 163, 184, 0.15); color: #94a3b8; border: 1px solid rgba(148, 163, 184, 0.3); }

        .gea-progress-wrap {
            margin-bottom: 10px;
        }
        .gea-progress-labels {
            display: flex;
            justify-content: space-between;
            font-size: 0.72rem;
            color: #cbd5e1;
            margin-bottom: 4px;
        }
        .gea-progress-bar-bg {
            width: 100%;
            height: 6px;
            background: #1e293b;
            border-radius: 99px;
            overflow: hidden;
        }
        .gea-progress-bar-fill {
            height: 100%;
            background: linear-gradient(90deg, #38bdf8, #818cf8);
            border-radius: 99px;
            transition: width 0.25s ease;
        }
        .gea-targets-box {
            background: #1e293b;
            border-radius: 7px;
            padding: 8px 10px;
            font-size: 0.76rem;
            display: flex;
            flex-direction: column;
            gap: 4px;
            border: 1px solid rgba(255,255,255,0.05);
        }
        .gea-target-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .gea-target-label {
            color: #94a3b8;
        }
        .gea-target-val {
            font-weight: 700;
            color: #f8fafc;
        }

        /* Champs de simulation dans le tableau */
        .gea-input-wrap {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            justify-content: flex-end;
        }
        .gea-note-input {
            width: 68px;
            padding: 3px 6px;
            font-size: 0.85rem;
            font-weight: 600;
            text-align: center;
            border-radius: 6px;
            border: 1px dashed #94a3b8;
            background: #f8fafc;
            color: #0f172a;
            transition: all 0.15s ease;
        }
        .gea-note-input:focus {
            outline: none;
            border-style: solid;
            border-color: #0284c7;
            box-shadow: 0 0 0 2px rgba(2, 132, 199, 0.2);
            background: #fff;
        }
        .gea-note-input.is-official {
            border: 1px solid #cbd5e1;
            background: transparent;
            color: inherit;
            font-weight: 700;
        }
        .gea-note-input.is-simulated {
            border: 1px solid #0284c7;
            background: #e0f2fe;
            color: #0369a1;
            font-weight: 700;
        }
        .gea-note-input.is-computed {
            border: 1px solid #6366f1;
            background: #eef2ff;
            color: #4338ca;
            font-weight: 700;
        }
        .gea-clear-btn {
            background: none;
            border: none;
            color: #ef4444;
            font-size: 0.85rem;
            cursor: pointer;
            padding: 0 3px;
            line-height: 1;
            title: "Effacer cette note simulée";
        }
        .gea-auto-hint {
            display: block;
            font-size: 0.7rem;
            color: #6366f1;
            font-weight: 600;
            margin-top: 2px;
        }
        .gea-shared-pill {
            display: inline-block;
            font-size: 0.65rem;
            padding: 1px 5px;
            border-radius: 4px;
            background: #e2e8f0;
            color: #475569;
            margin-left: 6px;
            font-weight: 600;
            vertical-align: middle;
        }
        .gea-ue-inline-info {
            display: block;
            font-size: 0.72rem;
            font-weight: 600;
            color: #0284c7;
            margin-top: 2px;
        }
    `;
    document.head.appendChild(styleEl);

    // ---- ÉTAT DES SIMULATIONS (Sauvegardé dans localStorage) ----
    const STORAGE_KEY = 'gea_unilim_simulations_v2';
    let simState = {
        // level2Overrides[semId][moduleKey] = number
        level2Overrides: {},
        // level3Notes[semId][evalId] = number
        level3Notes: {}
    };

    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed && typeof parsed === 'object') {
                simState.level2Overrides = parsed.level2Overrides || {};
                simState.level3Notes = parsed.level3Notes || {};
            }
        }
    } catch (e) {
        console.warn('Impossible de charger les simulations GEA:', e);
    }

    function sauvegarderEtat() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(simState));
        } catch (e) {}
    }

    // ---- NORMALISATION DES CLÉS DE MODULES PARTAGÉS ENTRE UEs ----
    function getNormalizedModuleKey(rawCode, rawNom, semNum) {
        const code = (rawCode || '').replace(/\s+/g, '').toUpperCase();
        const nom = (rawNom || '').trim();

        if (code) {
            return code; // ex: "R3.01", "R3.10", "SAE3.1", "SAE3.2", "UE1"
        }
        // Si la colonne code est vide (ex: Stage ou SAE 4.1 dans UE 4.2+)
        const saeMatch = nom.match(/SAE\s*(\d+[._]\d+)/i);
        if (saeMatch) {
            return 'SAE' + saeMatch[1].replace('_', '.');
        }
        if (nom.toLowerCase().includes('stage')) {
            return `STAGE_S${semNum}`;
        }
        return nom.toUpperCase();
    }

    // ---- STRUCTURE DE DONNÉES EXTRAITE DU DOM ----
    const semestresData = [];

    function analyserPage() {
        const panes = document.querySelectorAll('.tab-pane[id^="semestre-S"]');
        panes.forEach(pane => {
            const semId = pane.id; // ex: "semestre-S3-GEMA"
            const matchNum = semId.match(/S(\d)/i);
            const semNum = matchNum ? parseInt(matchNum[1], 10) : 1;

            const tabBtn = document.querySelector(`[data-bs-target="#${semId}"], [href="#${semId}"]`);
            const semTitre = tabBtn ? tabBtn.innerText.trim() : `Semestre ${semNum}`;

            if (!simState.level2Overrides[semId]) simState.level2Overrides[semId] = {};
            if (!simState.level3Notes[semId]) simState.level3Notes[semId] = {};

            const ues = [];
            // Dictionnaire des modules partagés au sein du même semestre : modulesMap[moduleKey]
            const modulesMap = {};

            let currentUE = null;
            let currentModOccurrence = null;
            let evalCounter = 0;

            const rows = pane.querySelectorAll('tbody tr');
            rows.forEach(row => {
                if (row.classList.contains('level-1')) {
                    const tdCode = row.querySelector('.code');
                    const tdNom = row.querySelector('.nom') || row.querySelector('td:nth-child(2)');
                    const tdMoy = row.querySelector('.moyenne');
                    const tdCoef = row.querySelector('.coefficient');

                    const code = tdCode ? tdCode.innerText.trim() : 'UE';
                    const nom = tdNom ? tdNom.innerText.trim() : '';
                    const officialMoy = tdMoy ? parseFloat(tdMoy.innerText.replace(',', '.')) : NaN;
                    const coef = tdCoef ? parseFloat(tdCoef.innerText.replace(',', '.')) : 100;

                    currentUE = {
                        code,
                        nom,
                        coef,
                        row,
                        tdMoy,
                        officialMoy,
                        items: [] // Liste des { moduleKey, coef, row, tdMoy, nom, rawCode }
                    };
                    ues.push(currentUE);
                    currentModOccurrence = null;
                }
                else if (row.classList.contains('level-2') && currentUE) {
                    const tdCode = row.querySelector('.code');
                    const tdNom = row.querySelector('td:nth-child(2)');
                    const tdMoy = row.querySelector('.moyenne');
                    const tdCoef = row.querySelector('.coefficient');

                    const rawCode = tdCode ? tdCode.innerText.trim() : '';
                    const nom = tdNom ? tdNom.innerText.trim().split('\n')[0].trim() : '';
                    const officialMoy = tdMoy ? parseFloat(tdMoy.innerText.replace(',', '.')) : NaN;
                    const coef = tdCoef ? parseFloat(tdCoef.innerText.replace(',', '.')) : NaN;

                    if (isNaN(coef)) {
                        currentModOccurrence = null;
                        return;
                    }

                    const moduleKey = getNormalizedModuleKey(rawCode, nom, semNum);

                    if (!modulesMap[moduleKey]) {
                        modulesMap[moduleKey] = {
                            moduleKey,
                            rawCode: rawCode || moduleKey,
                            nom,
                            officialMoy: !isNaN(officialMoy) ? officialMoy : NaN,
                            occurrences: [],
                            evals: [],
                            isSae: moduleKey.startsWith('SAE')
                        };
                    } else if (!isNaN(officialMoy) && isNaN(modulesMap[moduleKey].officialMoy)) {
                        modulesMap[moduleKey].officialMoy = officialMoy;
                    }

                    const occ = {
                        moduleKey,
                        rawCode,
                        nom,
                        coef,
                        row,
                        tdMoy,
                        tdNom,
                        officialMoy
                    };
                    modulesMap[moduleKey].occurrences.push(occ);
                    currentUE.items.push(occ);
                    currentModOccurrence = occ;
                }
                else if (row.classList.contains('level-3') && currentModOccurrence) {
                    evalCounter++;
                    const mod = modulesMap[currentModOccurrence.moduleKey];
                    const tdCode = row.querySelector('.code');
                    const tdNom = row.querySelector('td:nth-child(2)');
                    const tdMoy = row.querySelector('.moyenne');
                    const tdCoef = row.querySelector('.coefficient');

                    const nomEval = tdNom ? tdNom.innerText.trim().split('\n')[0].trim() : `Devoir ${evalCounter}`;
                    const officialNote = tdMoy ? parseFloat(tdMoy.innerText.replace(',', '.')) : NaN;
                    let coefEval = tdCoef ? parseFloat(tdCoef.innerText.replace(',', '.')) : 1;
                    if (isNaN(coefEval) || coefEval <= 0) coefEval = 1;

                    const evalId = `${currentModOccurrence.moduleKey}__${evalCounter}`;

                    // Vérifier s'il s'agit de la ligne "Moyenne des ressources comptant dans la SAE (R3.01 ...)"
                    let saeResourceCodes = null;
                    const matchRes = nomEval.match(/Moyenne des ressources comptant dans la SAE\s*\(([^)]+)\)/i);
                    if (matchRes) {
                        saeResourceCodes = matchRes[1]
                            .trim()
                            .split(/\s+/)
                            .map(c => c.replace(/\s+/g, '').toUpperCase())
                            .filter(Boolean);
                    }

                    const isAlternanceRow = /alternance/i.test(nomEval);

                    mod.evals.push({
                        evalId,
                        nom: nomEval,
                        coef: coefEval,
                        officialNote,
                        row,
                        tdMoy,
                        saeResourceCodes,
                        isAlternanceRow
                    });
                }
            });

            semestresData.push({
                semId,
                semNum,
                semTitre,
                pane,
                ues,
                modulesMap
            });
        });
    }

    // ---- CONSTRUCTION DES CHAMPS DE SAISIE DANS LE TABLEAU ----
    function initialiserTableauxInteractifs() {
        semestresData.forEach(sem => {
            // Indiquer d'un badge discret les modules partagés entre plusieurs UEs (ex: SAE 3.1, SAE 3.2, R3.10)
            Object.values(sem.modulesMap).forEach(mod => {
                if (mod.occurrences.length > 1) {
                    mod.occurrences.forEach(occ => {
                        if (occ.tdNom && !occ.tdNom.querySelector('.gea-shared-pill')) {
                            const pill = document.createElement('span');
                            pill.className = 'gea-shared-pill gea-sim-injected';
                            pill.title = `Cette matière compte dans ${mod.occurrences.length} UEs : la note est synchronisée automatiquement.`;
                            pill.textContent = `Sync ×${mod.occurrences.length} UEs`;
                            occ.tdNom.appendChild(pill);
                        }
                    });
                }

                // 1. Créer les inputs sur les lignes level-3 (Devoirs / Contrôles)
                mod.evals.forEach(ev => {
                    if (!ev.tdMoy) return;
                    ev.tdMoy.innerHTML = '';

                    const wrap = document.createElement('div');
                    wrap.className = 'gea-input-wrap gea-sim-injected';

                    const input = document.createElement('input');
                    input.type = 'number';
                    input.min = '0';
                    input.max = '20';
                    input.step = '0.25';
                    input.className = 'gea-note-input';
                    input.placeholder = ev.saeResourceCodes ? 'Auto' : 'Simuler';

                    const clearBtn = document.createElement('button');
                    clearBtn.type = 'button';
                    clearBtn.className = 'gea-clear-btn';
                    clearBtn.textContent = '×';
                    clearBtn.title = 'Réinitialiser cette note';
                    clearBtn.style.display = 'none';

                    const hint = document.createElement('span');
                    hint.className = 'gea-auto-hint gea-sim-injected';
                    hint.style.display = 'none';

                    input.addEventListener('input', () => {
                        const valStr = input.value.replace(',', '.').trim();
                        if (valStr === '') {
                            delete simState.level3Notes[sem.semId][ev.evalId];
                        } else {
                            let val = parseFloat(valStr);
                            if (!isNaN(val)) {
                                val = Math.max(0, Math.min(20, val));
                                simState.level3Notes[sem.semId][ev.evalId] = val;
                                // Si on modifie un devoir level-3, on enlève un éventuel override manuel level-2 du module parent
                                delete simState.level2Overrides[sem.semId][mod.moduleKey];
                            }
                        }
                        sauvegarderEtat();
                        recalculerTout(input);
                    });

                    clearBtn.addEventListener('click', () => {
                        delete simState.level3Notes[sem.semId][ev.evalId];
                        sauvegarderEtat();
                        recalculerTout();
                    });

                    wrap.appendChild(input);
                    wrap.appendChild(clearBtn);
                    ev.tdMoy.appendChild(wrap);
                    ev.tdMoy.appendChild(hint);

                    ev._inputEl = input;
                    ev._clearBtnEl = clearBtn;
                    ev._hintEl = hint;
                });

                // 2. Créer les inputs sur toutes les occurrences level-2 (Ressources / SAÉ / Stage / Portfolio)
                mod.occurrences.forEach(occ => {
                    if (!occ.tdMoy) return;
                    occ.tdMoy.innerHTML = '';

                    const wrap = document.createElement('div');
                    wrap.className = 'gea-input-wrap gea-sim-injected';

                    const input = document.createElement('input');
                    input.type = 'number';
                    input.min = '0';
                    input.max = '20';
                    input.step = '0.25';
                    input.className = 'gea-note-input';
                    input.placeholder = 'Simuler';

                    const clearBtn = document.createElement('button');
                    clearBtn.type = 'button';
                    clearBtn.className = 'gea-clear-btn';
                    clearBtn.textContent = '×';
                    clearBtn.title = 'Effacer la simulation de ce module';
                    clearBtn.style.display = 'none';

                    input.addEventListener('input', () => {
                        const valStr = input.value.replace(',', '.').trim();
                        if (valStr === '') {
                            delete simState.level2Overrides[sem.semId][mod.moduleKey];
                        } else {
                            let val = parseFloat(valStr);
                            if (!isNaN(val)) {
                                val = Math.max(0, Math.min(20, val));
                                simState.level2Overrides[sem.semId][mod.moduleKey] = val;
                            }
                        }
                        sauvegarderEtat();
                        recalculerTout(input);
                    });

                    clearBtn.addEventListener('click', () => {
                        delete simState.level2Overrides[sem.semId][mod.moduleKey];
                        mod.evals.forEach(ev => {
                            delete simState.level3Notes[sem.semId][ev.evalId];
                        });
                        sauvegarderEtat();
                        recalculerTout();
                    });

                    wrap.appendChild(input);
                    wrap.appendChild(clearBtn);
                    occ.tdMoy.appendChild(wrap);

                    occ._inputEl = input;
                    occ._clearBtnEl = clearBtn;
                });
            });

            // 3. Créer le conteneur Dashboard en haut de chaque onglet de semestre
            const dashboard = document.createElement('div');
            dashboard.className = 'gea-dashboard gea-sim-injected';
            dashboard.id = `gea-dashboard-${sem.semId}`;

            const tableResponsive = sem.pane.querySelector('.table-responsive') || sem.pane.firstElementChild;
            if (tableResponsive) {
                sem.pane.insertBefore(dashboard, tableResponsive);
            } else {
                sem.pane.prepend(dashboard);
            }
            sem._dashboardEl = dashboard;
        });
    }

    // ---- MOTEUR DE CALCUL D'UN SEMESTRE ----
    function calculerMoyennesModules(sem) {
        const resultatsModules = {}; // moduleKey -> { moy, source: 'official'|'simulated'|'computed'|'none' }

        // Passe 1 : Calculer tous les modules qui NE SONT PAS des SAÉ (pour avoir les moyennes des ressources R3.xx d'abord)
        Object.values(sem.modulesMap).forEach(mod => {
            if (!mod.isSae) {
                resultatsModules[mod.moduleKey] = calculerModuleIndividuel(sem, mod, resultatsModules);
            }
        });

        // Passe 2 : Calculer les SAÉ (qui peuvent dépendre de la moyenne de ressources R3.xx à 40%)
        Object.values(sem.modulesMap).forEach(mod => {
            if (mod.isSae) {
                resultatsModules[mod.moduleKey] = calculerModuleIndividuel(sem, mod, resultatsModules);
            }
        });

        return resultatsModules;
    }

    function calculerModuleIndividuel(sem, mod, resultatsDejaCalcules) {
        const overrideL2 = simState.level2Overrides[sem.semId][mod.moduleKey];

        // Vérifier d'abord les évaluations level-3 (et mettre à jour l'indice 40% des ressources SAÉ)
        let ptsEval = 0;
        let coefEvalTotal = 0;
        let hasSimulatedEval = false;
        let hasNonAutoProjectGrade = false;

        // Pour une SAÉ, calculer d'abord la moyenne des ressources associées si applicable
        mod.evals.forEach(ev => {
            if (ev.saeResourceCodes && ev.saeResourceCodes.length > 0) {
                let sumRes = 0;
                let countRes = 0;
                ev.saeResourceCodes.forEach(resCode => {
                    const resInfo = resultatsDejaCalcules[resCode];
                    if (resInfo && !isNaN(resInfo.moy)) {
                        sumRes += resInfo.moy;
                        countRes++;
                    }
                });
                ev._autoResourceAvg = countRes > 0 ? (sumRes / countRes) : NaN;
            } else {
                ev._autoResourceAvg = NaN;
            }
        });

        // Vérifier si l'étudiant a une note projet (formation initiale ou alternance) sur la SAÉ
        if (mod.isSae) {
            mod.evals.forEach(ev => {
                if (!ev.saeResourceCodes) {
                    const simVal = simState.level3Notes[sem.semId][ev.evalId];
                    const offVal = ev.officialNote;
                    if (simVal !== undefined || !isNaN(offVal)) {
                        hasNonAutoProjectGrade = true;
                    }
                }
            });
        }

        mod.evals.forEach(ev => {
            const simVal = simState.level3Notes[sem.semId][ev.evalId];
            let noteEffective = NaN;
            let isSim = false;

            if (simVal !== undefined && !isNaN(simVal)) {
                noteEffective = simVal;
                isSim = true;
                hasSimulatedEval = true;
            } else if (!isNaN(ev.officialNote)) {
                noteEffective = ev.officialNote;
            } else if (ev.saeResourceCodes && !isNaN(ev._autoResourceAvg) && hasNonAutoProjectGrade) {
                // La part 40% ressources s'active automatiquement dès qu'il y a une note projet SAÉ
                noteEffective = ev._autoResourceAvg;
                isSim = true;
                hasSimulatedEval = true;
            }

            ev._effectiveNote = noteEffective;
            ev._isSimulated = isSim;

            if (!isNaN(noteEffective)) {
                ptsEval += noteEffective * ev.coef;
                coefEvalTotal += ev.coef;
            }
        });

        // Priorité 1 : Override direct sur la ligne level-2 du module
        if (overrideL2 !== undefined && !isNaN(overrideL2)) {
            return {
                moy: overrideL2,
                source: 'simulated'
            };
        }

        // Priorité 2 : Si au moins un devoir level-3 est simulé, ou si des notes level-3 existent
        if (coefEvalTotal > 0 && (hasSimulatedEval || isNaN(mod.officialMoy))) {
            return {
                moy: ptsEval / coefEvalTotal,
                source: hasSimulatedEval ? 'computed' : 'official'
            };
        }

        // Priorité 3 : Moyenne officielle déjà inscrite sur la ligne level-2
        if (!isNaN(mod.officialMoy)) {
            return {
                moy: mod.officialMoy,
                source: 'official'
            };
        }

        return {
            moy: NaN,
            source: 'none'
        };
    }

    // ---- MISE À JOUR DU DOM & DU DASHBOARD ----
    function recalculerTout(activeInput = null) {
        const bilansParSemestre = {}; // semNum -> { uesByIndex: { 1: moy, 2: moy, ... } }

        semestresData.forEach(sem => {
            const resModules = calculerMoyennesModules(sem);
            bilansParSemestre[sem.semNum] = {};

            // 1. Mettre à jour les inputs dans le tableau (level-3 et level-2)
            Object.values(sem.modulesMap).forEach(mod => {
                const info = resModules[mod.moduleKey];

                // Mise à jour des lignes level-3
                mod.evals.forEach(ev => {
                    if (!ev._inputEl) return;
                    const simVal = simState.level3Notes[sem.semId][ev.evalId];

                    if (ev._inputEl !== activeInput) {
                        if (simVal !== undefined && !isNaN(simVal)) {
                            ev._inputEl.value = Number(simVal.toFixed(2));
                        } else if (!isNaN(ev.officialNote)) {
                            ev._inputEl.value = Number(ev.officialNote.toFixed(2));
                        } else if (ev.saeResourceCodes && !isNaN(ev._effectiveNote)) {
                            ev._inputEl.value = Number(ev._effectiveNote.toFixed(2));
                        } else {
                            ev._inputEl.value = '';
                        }
                    }

                    ev._inputEl.classList.remove('is-official', 'is-simulated', 'is-computed');
                    if (simVal !== undefined && !isNaN(simVal)) {
                        ev._inputEl.classList.add('is-simulated');
                        ev._clearBtnEl.style.display = 'inline-block';
                    } else if (ev.saeResourceCodes && !isNaN(ev._effectiveNote) && isNaN(ev.officialNote)) {
                        ev._inputEl.classList.add('is-computed');
                        ev._clearBtnEl.style.display = 'none';
                    } else if (!isNaN(ev.officialNote)) {
                        ev._inputEl.classList.add('is-official');
                        ev._clearBtnEl.style.display = 'none';
                    } else {
                        ev._clearBtnEl.style.display = 'none';
                    }

                    // Afficher l'indice de moyenne automatique des ressources sur la ligne 40% SAÉ
                    if (ev.saeResourceCodes && ev._hintEl) {
                        if (!isNaN(ev._autoResourceAvg)) {
                            ev._hintEl.style.display = 'block';
                            ev._hintEl.textContent = `Moy. ressources actuelle : ${ev._autoResourceAvg.toFixed(2)}/20`;
                        } else {
                            ev._hintEl.style.display = 'none';
                        }
                    }
                });

                // Mise à jour des occurrences level-2
                mod.occurrences.forEach(occ => {
                    if (!occ._inputEl) return;

                    if (occ._inputEl !== activeInput) {
                        if (!isNaN(info.moy)) {
                            occ._inputEl.value = Number(info.moy.toFixed(2));
                        } else {
                            occ._inputEl.value = '';
                        }
                    }

                    occ._inputEl.classList.remove('is-official', 'is-simulated', 'is-computed');
                    if (info.source === 'simulated') {
                        occ._inputEl.classList.add('is-simulated');
                        occ._clearBtnEl.style.display = 'inline-block';
                    } else if (info.source === 'computed') {
                        occ._inputEl.classList.add('is-computed');
                        occ._clearBtnEl.style.display = 'inline-block';
                    } else if (info.source === 'official') {
                        occ._inputEl.classList.add('is-official');
                        occ._clearBtnEl.style.display = 'none';
                    } else {
                        occ._clearBtnEl.style.display = 'none';
                    }
                });
            });

            // 2. Calculer les résultats de chaque UE (level-1) et mettre à jour la ligne UE + le Dashboard
            const ueStatsList = [];

            sem.ues.forEach((ue, idx) => {
                let ptsAcquis = 0;
                let coefTotal = 0;
                let coefAcquis = 0;
                let coefManquant = 0;
                let hasSimInUE = false;

                ue.items.forEach(item => {
                    const info = resModules[item.moduleKey];
                    coefTotal += item.coef;
                    if (info && !isNaN(info.moy)) {
                        ptsAcquis += info.moy * item.coef;
                        coefAcquis += item.coef;
                        if (info.source === 'simulated' || info.source === 'computed') {
                            hasSimInUE = true;
                        }
                    } else {
                        coefManquant += item.coef;
                    }
                });

                const moyProvisoire = coefAcquis > 0 ? (ptsAcquis / coefAcquis) : NaN;
                const ptsCible10 = 10 * coefTotal;
                const ptsCible8 = 8 * coefTotal;

                const reqPour10 = coefManquant > 0 ? ((ptsCible10 - ptsAcquis) / coefManquant) : NaN;
                const reqPour8 = coefManquant > 0 ? ((ptsCible8 - ptsAcquis) / coefManquant) : NaN;

                // Sauvegarder pour l'onglet BILAN (UE 1..5)
                const matchUeIdx = ue.code.match(/\.(\d+)/);
                const ueNum = matchUeIdx ? parseInt(matchUeIdx[1], 10) : (idx + 1);
                bilansParSemestre[sem.semNum][ueNum] = {
                    moy: moyProvisoire,
                    coefAcquis,
                    coefTotal,
                    hasSimInUE
                };

                // Mettre à jour la cellule td.moyenne de la ligne tr.level-1 (UE) dans le tableau
                if (ue.tdMoy) {
                    if (!isNaN(moyProvisoire)) {
                        const color = moyProvisoire >= 10 ? '#16a34a' : (moyProvisoire >= 8 ? '#d97706' : '#dc2626');
                        let subText = '';
                        if (coefManquant > 0) {
                            if (reqPour10 <= 0) {
                                subText = `<span class="gea-ue-inline-info" style="color:#16a34a;">✅ 10/20 déjà acquis</span>`;
                            } else if (reqPour10 <= 20) {
                                subText = `<span class="gea-ue-inline-info">🎯 Requis pour 10 : ${reqPour10.toFixed(2)}/20</span>`;
                            } else {
                                subText = `<span class="gea-ue-inline-info" style="color:#dc2626;">⚠️ >20 requis (${reqPour10.toFixed(2)})</span>`;
                            }
                        }
                        ue.tdMoy.innerHTML = `
                            <span style="font-weight:800; color:${color};">${moyProvisoire.toFixed(2)}</span>
                            ${hasSimInUE ? '<span title="Inclut des notes simulées" style="font-size:0.7rem; color:#0284c7;">(sim.)</span>' : ''}
                            ${subText}
                        `;
                    } else {
                        ue.tdMoy.innerHTML = `<span style="color:#94a3b8; font-size:0.8rem;">—</span>`;
                    }
                }

                ueStatsList.push({
                    ue,
                    ptsAcquis,
                    coefTotal,
                    coefAcquis,
                    coefManquant,
                    moyProvisoire,
                    reqPour10,
                    reqPour8,
                    hasSimInUE
                });
            });

            // 3. Rendu du Dashboard en haut du semestre
            rendreDashboardSemestre(sem, ueStatsList);
        });

        // 4. Mettre à jour l'onglet BILAN (#bilan) si présent sur la page
        mettreAJourOngletBilan(bilansParSemestre);
    }

    function formaterObjectif(noteRequise) {
        if (noteRequise <= 0) {
            return `<span style="color:#4ade80;">✅ Déjà acquis !</span>`;
        }
        if (noteRequise <= 20) {
            const col = noteRequise <= 10 ? '#38bdf8' : (noteRequise <= 14 ? '#fbbf24' : '#f87171');
            return `<span style="color:${col};">${noteRequise.toFixed(2)} / 20</span>`;
        }
        return `<span style="color:#ef4444;">Impossible (${noteRequise.toFixed(1)}/20)</span>`;
    }

    function rendreDashboardSemestre(sem, ueStatsList) {
        const dash = sem._dashboardEl;
        if (!dash) return;

        const nbSimL2 = Object.keys(simState.level2Overrides[sem.semId] || {}).length;
        const nbSimL3 = Object.keys(simState.level3Notes[sem.semId] || {}).length;
        const totalSims = nbSimL2 + nbSimL3;

        let cardsHtml = '';
        ueStatsList.forEach(st => {
            let badgeClass = 'gea-badge-gray';
            let moyText = '— / 20';
            if (!isNaN(st.moyProvisoire)) {
                moyText = `${st.moyProvisoire.toFixed(2)} / 20`;
                if (st.moyProvisoire >= 10) badgeClass = 'gea-badge-green';
                else if (st.moyProvisoire >= 8) badgeClass = 'gea-badge-orange';
                else badgeClass = 'gea-badge-red';
            }

            const pctCoefs = st.coefTotal > 0 ? Math.min(100, Math.round((st.coefAcquis / st.coefTotal) * 100)) : 0;

            let targetsHtml = '';
            if (st.coefManquant === 0 && st.coefTotal > 0) {
                const validText = st.moyProvisoire >= 10
                    ? '<span style="color:#4ade80; font-weight:700;">✅ UE Validée (≥ 10)</span>'
                    : (st.moyProvisoire >= 8
                        ? '<span style="color:#fbbf24; font-weight:700;">⚠️ Compensable (≥ 8)</span>'
                        : '<span style="color:#f87171; font-weight:700;">❌ Non validée (< 8)</span>');
                targetsHtml = `
                    <div class="gea-targets-box" style="text-align:center;">
                        <div>100% des coefficients notés</div>
                        <div>${validText}</div>
                    </div>
                `;
            } else {
                targetsHtml = `
                    <div class="gea-targets-box">
                        <div style="font-size:0.7rem; color:#cbd5e1; font-weight:600; margin-bottom:2px; border-bottom:1px solid #334155; padding-bottom:3px;">
                            Moyenne requise sur les <strong>${st.coefManquant} coefs</strong> restants :
                        </div>
                        <div class="gea-target-row">
                            <span class="gea-target-label">🎯 Pour valider à 10/20 :</span>
                            <span class="gea-target-val">${formaterObjectif(st.reqPour10)}</span>
                        </div>
                        <div class="gea-target-row">
                            <span class="gea-target-label">🛡️ Pour seuil 8/20 (BUT) :</span>
                            <span class="gea-target-val">${formaterObjectif(st.reqPour8)}</span>
                        </div>
                    </div>
                `;
            }

            cardsHtml += `
                <div class="gea-ue-card">
                    <div>
                        <div class="gea-ue-card-top">
                            <span class="gea-ue-code">${st.ue.code}${st.hasSimInUE ? ' <small style="color:#38bdf8;font-size:0.7rem;">(sim.)</small>' : ''}</span>
                            <span class="gea-ue-avg-badge ${badgeClass}">${moyText}</span>
                        </div>
                        <div class="gea-ue-name" title="${st.ue.nom}">${st.ue.nom}</div>
                    </div>
                    <div>
                        <div class="gea-progress-wrap">
                            <div class="gea-progress-labels">
                                <span>Coefs notés : <strong>${st.coefAcquis}/${st.coefTotal}</strong></span>
                                <span><strong>${st.ptsAcquis.toFixed(0)}</strong> / ${st.coefTotal * 10} pts</span>
                            </div>
                            <div class="gea-progress-bar-bg">
                                <div class="gea-progress-bar-fill" style="width: ${pctCoefs}%;"></div>
                            </div>
                        </div>
                        ${targetsHtml}
                    </div>
                </div>
            `;
        });

        dash.innerHTML = `
            <div class="gea-dash-header">
                <div>
                    <h2 class="gea-dash-title">
                        <span>🎓 Simulateur & Objectifs — ${sem.semTitre}</span>
                    </h2>
                    <div class="gea-dash-subtitle">
                        Cliquez dans n'importe quelle case de la colonne <strong>Moy.</strong> du tableau ci-dessous pour simuler une note. Les matières communes (SAÉ, PPP, Stage) se synchronisent entre les UEs.
                    </div>
                </div>
                <div class="gea-dash-actions">
                    <button type="button" class="gea-btn" data-action="fill-10">✨ Simuler 10/20 partout (vide)</button>
                    <button type="button" class="gea-btn" data-action="fill-12">✨ Simuler 12/20 partout (vide)</button>
                    ${totalSims > 0 ? `<button type="button" class="gea-btn gea-btn-danger" data-action="reset">🗑️ Réinitialiser (${totalSims} sim.)</button>` : ''}
                </div>
            </div>
            <div class="gea-ue-grid">
                ${cardsHtml}
            </div>
        `;

        // Brancher les boutons d'action rapide du dashboard
        const btnFill10 = dash.querySelector('[data-action="fill-10"]');
        const btnFill12 = dash.querySelector('[data-action="fill-12"]');
        const btnReset = dash.querySelector('[data-action="reset"]');

        if (btnFill10) {
            btnFill10.addEventListener('click', () => remplirNotesManquantes(sem, 10));
        }
        if (btnFill12) {
            btnFill12.addEventListener('click', () => remplirNotesManquantes(sem, 12));
        }
        if (btnReset) {
            btnReset.addEventListener('click', () => {
                simState.level2Overrides[sem.semId] = {};
                simState.level3Notes[sem.semId] = {};
                sauvegarderEtat();
                recalculerTout();
            });
        }
    }

    function remplirNotesManquantes(sem, noteCible) {
        const resModules = calculerMoyennesModules(sem);
        Object.values(sem.modulesMap).forEach(mod => {
            const info = resModules[mod.moduleKey];
            if (!info || isNaN(info.moy)) {
                simState.level2Overrides[sem.semId][mod.moduleKey] = noteCible;
            }
        });
        sauvegarderEtat();
        recalculerTout();
    }

    // ---- MISE À JOUR DE L'ONGLET BILAN ANNUEL (#bilan) ----
    function mettreAJourOngletBilan(bilansParSemestre) {
        const bilanPane = document.getElementById('bilan');
        if (!bilanPane) return;

        const semNums = Object.keys(bilansParSemestre).map(Number).sort((a, b) => a - b);
        if (semNums.length === 0) return;

        const semImpair = semNums.find(n => n % 2 === 1) || semNums[0];
        const semPair = semNums.find(n => n % 2 === 0) || (semImpair + 1);

        const dataImpair = bilansParSemestre[semImpair] || {};
        const dataPair = bilansParSemestre[semPair] || {};

        const rows = bilanPane.querySelectorAll('tbody tr');
        rows.forEach((row, idx) => {
            const tdUe = row.querySelector('.ue-code');
            const tdsMoy = row.querySelectorAll('.bilan-moyenne');
            if (tdsMoy.length < 3) return;

            const ueText = tdUe ? tdUe.innerText : '';
            const matchNum = ueText.match(/(\d+)/);
            const ueNum = matchNum ? parseInt(matchNum[1], 10) : (idx + 1);

            const st1 = dataImpair[ueNum];
            const st2 = dataPair[ueNum];

            const moy1 = st1 ? st1.moy : NaN;
            const moy2 = st2 ? st2.moy : NaN;

            // Colonne Semestre Impair (ex: S3)
            if (!isNaN(moy1)) {
                tdsMoy[0].className = 'bilan-moyenne ' + (moy1 >= 10 ? 'bilan-vert' : 'bilan-rouge');
                tdsMoy[0].innerHTML = `${moy1.toFixed(2)}${st1.hasSimInUE ? ' <small style="font-size:0.7rem;color:#0284c7;">(sim.)</small>' : ''}`;
            } else {
                tdsMoy[0].className = 'bilan-moyenne';
                tdsMoy[0].innerHTML = '';
            }

            // Colonne Semestre Pair (ex: S4)
            if (!isNaN(moy2)) {
                tdsMoy[1].className = 'bilan-moyenne ' + (moy2 >= 10 ? 'bilan-vert' : 'bilan-rouge');
                tdsMoy[1].innerHTML = `${moy2.toFixed(2)}${st2.hasSimInUE ? ' <small style="font-size:0.7rem;color:#0284c7;">(sim.)</small>' : ''}`;
            } else if (!isNaN(moy1)) {
                // Afficher l'objectif S4 pour compenser l'année à 10/20
                const objS4 = Math.max(8, 20 - moy1);
                tdsMoy[1].className = 'bilan-moyenne';
                tdsMoy[1].innerHTML = `<span style="font-size:0.78rem; color:#0284c7; font-weight:600;">🎯 Objectif S${semPair} : ${objS4.toFixed(2)}/20</span>`;
            } else {
                tdsMoy[1].className = 'bilan-moyenne';
                tdsMoy[1].innerHTML = '';
            }

            // Colonne Moyenne Année
            if (!isNaN(moy1) && !isNaN(moy2)) {
                const moyAnnee = (moy1 + moy2) / 2;
                const isValide = moyAnnee >= 10 && moy1 >= 8 && moy2 >= 8;
                tdsMoy[2].className = 'bilan-moyenne ' + (isValide ? 'bilan-vert' : 'bilan-rouge');
                tdsMoy[2].innerHTML = `<strong>${moyAnnee.toFixed(2)}</strong> ${isValide ? '✅' : '❌'}`;
            } else {
                tdsMoy[2].className = 'bilan-moyenne';
                tdsMoy[2].innerHTML = '';
            }
        });
    }

    // ---- LANCEMENT ----
    analyserPage();
    if (semestresData.length > 0) {
        initialiserTableauxInteractifs();
        recalculerTout();
    }
})();
