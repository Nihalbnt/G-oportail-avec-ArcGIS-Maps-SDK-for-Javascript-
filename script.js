require([
    "esri/config",
    "esri/Map",
    "esri/views/MapView",
    "esri/widgets/BasemapToggle",
    "esri/layers/FeatureLayer",
    "esri/PopupTemplate",
    "esri/widgets/Search",
    "esri/widgets/Legend",
    "esri/widgets/Expand",
    "esri/Graphic",
    "esri/widgets/Editor",
    "esri/widgets/Sketch/SketchViewModel"
], function (
    esriConfig,
    Map,
    MapView,
    BasemapToggle,
    FeatureLayer,
    PopupTemplate,
    Search,
    Legend,
    Expand,
    Graphic,
    Editor,
    SketchViewModel
) {
    esriConfig.apiKey = "AAPTxy8BH1VEsoebNVZXo8HurDbsYHINrVfeJUjyYqMCmBPmbrU3e9uW02F-FqRM_jrd82fnEE_GtWMu_0KbgQNZ2j7jSrHjgClx2aUOztkAMNl334xCd6Vx6Qj7BBfag8xU20rCJNOoT6Up0MPyuekjviprQiXrU3cx5IgJA01M9sXIp8Zz7FlqVOdyNt_qVJpMM4y5K6GrTMXQL6A1LL3s6Cr2QFfG7uG8aJJdP_cFY_I.AT1_Dup3ajUs";

    const map = new Map({
        basemap: "arcgis-topographic"
    });

    const view = new MapView({
        map: map,
        center: [-7.62, 33.59],
        zoom: 13,
        container: "viewDiv",
        popup: {
            dockEnabled: false,
            autoOpenEnabled: true,
            collapseEnabled: true,
            highlightEnabled: true
        }
    });

    // Couche communes et popup
    var popupCommune = new PopupTemplate({
        title: "<b>Commune: {COMMUNE_AR}</b>",
        content: "<p> PREFECTURE : {PREFECTURE} </p>" + "<p> COMMUNE : {COMMUNE_AR}  </p> " + "<p> Shape_Leng : {Shape_Leng} </p> " + "<p> Shape_Le_1 : {Shape_Le_1} </p> " + "<p> Shape_Area : {Shape_Area} </p> " + "<p> numéro : {numero} </p> " + "<p> PLAN D'AMENAGEMENT : {PLAN_AMENA} </p> ",
    });
    const communes = new FeatureLayer({
        url: "https://services5.arcgis.com/TbprQ2JL7Oe3pK0F/arcgis/rest/services/Projet_Elaboration_d’un_Géoportail/FeatureServer/5",
        outFields: ["PREFECTURE", "COMMUNE_AR", "Shape_Leng", "Shape_Le_1", "Shape_Area", "numero", "PLAN_AMENA"],
        popupTemplate: popupCommune
    });
    map.add(communes);

    // Couche Voirie et popup 
    var popupVoirie = new PopupTemplate({
        title: "Voirie de Casablanca",
        content: [{
            type: "fields",
            fieldInfos: [
                {
                    "fieldName": "NOM", "label": "", "isEditable": true, "tooltip": "", "visible": true, "format": null, "stringFieldOption": "text-box"
                },
                {
                    "fieldName": "LENGTH", "label": "Longueur", "isEditable": true, "tooltip": "", "visible": true, "format": { "places": 1, "digitSeparator": true }, "stringFieldOption": "text-box"
                }
            ]
        }]
    });
    const voirie = new FeatureLayer({
        url: "https://services5.arcgis.com/TbprQ2JL7Oe3pK0F/arcgis/rest/services/Projet_Elaboration_d’un_Géoportail/FeatureServer/4",
        outFields: ["NOM", "LENGTH"],
        popupTemplate: popupVoirie
    });
    map.add(voirie);

    // Couche Population et Popup charts 
    var popupPopulation = new PopupTemplate({
        title: "<b>Population de l'Arrondissement : {ARRONDISSE}</b>",
        content: [
            {
                type: "fields",
                fieldInfos: [
                    { fieldName: "TOTAL1994", label: "Population 1994", format: { digitSeparator: true, places: 0 } },
                    { fieldName: "TOTAL2004", label: "Population 2004", format: { digitSeparator: true, places: 0 } },
                    { fieldName: "evolution_", label: "Évolution", format: { digitSeparator: true, places: 0 } }
                ]
            },
            {
                type: "media",
                mediaInfos: [
                    {
                        type: "bar-chart",
                        caption: "Évolution de la population entre 1994 et 2004",
                        value: {
                            fields: ["TOTAL1994", "TOTAL2004"],
                            tooltipField: "ARRONDISSE"
                        }
                    },
                    {
                        type: "bar-chart",
                        caption: "Variation nette de la population",
                        value: {
                            fields: ["evolution_"],
                            normalizeField: null,
                            tooltipField: "ARRONDISSE"
                        }
                    }
                ]
            }
        ]
    });
    const casaPop = new FeatureLayer({
        url: "https://services5.arcgis.com/TbprQ2JL7Oe3pK0F/arcgis/rest/services/Projet_Elaboration_d’un_Géoportail/FeatureServer/0",
        outFields: ["PREFECTURE", "ARRONDISSE", "Shape_Leng", "Shape_Area", "MAROCAINS", "ETRANGERS", "TOTAL1994", "MÉNAGES199", "MAROCAIN_1", "ETRANGER_1", "TOTAL2004", "MÉNAGES200", "TAUX", "densite199", "densite200", "evolution_"],
        popupTemplate: popupPopulation
    });
    map.add(casaPop);

    // Grandes surfaces et popup
    var popupGrandeSurface = new PopupTemplate({
        title: "<b>Grandes Surfaces: {Grande surface wgs}</b>",
        content: "<p> Type : {Type} </p>" + "<p> Adresse : {Adresse}  </p> "
    });
    const grandeSurface = new FeatureLayer({
        url: "https://services5.arcgis.com/TbprQ2JL7Oe3pK0F/arcgis/rest/services/Projet_Elaboration_d’un_Géoportail/FeatureServer/1",
        outFields: ["Type", "Adresse"],
        popupTemplate: popupGrandeSurface
    });
    map.add(grandeSurface);

    // Couche Hotels et popup
    var popupHotels = new PopupTemplate({
        title: "<b>Hotels : {Hotels wgs}</b>",
        content: "<p> HOTEL : {HOTEL} </p>" + "<p> CATÉGORIE : {CATÉGORIE}  </p> " + "<p> ADRESSE : {ADRESSE} </p>" + "<p> PHONE_1 : {PHONE1}  </p> " + "<p> PHONE_2 : {PHONE_2} </p>" + "<p> CAPACITE DES CHAMBRES : {CAP_CHAMBR}  </p> " + "<p> CAPACITES DE LITS : {CAP_LIT} </p>" + "<p> Etoile : {Etoile}  </p> " + "<p> cap_reunio : {cap_reunio}  </p> "
    });
    const hotels = new FeatureLayer({
        url: "https://services5.arcgis.com/TbprQ2JL7Oe3pK0F/arcgis/rest/services/Projet_Elaboration_d’un_Géoportail/FeatureServer/2",
        outFields: ["Type", "CATÉGORIE", "ADRESSE", "PHONE1", "PHONE_2", "CAP_CHAMBR", "CAP_LIT", "Etoile", "cap_reunio"],
        popupTemplate: popupHotels
    });
    map.add(hotels);

    // Reclamations
    var popupReclamation = new PopupTemplate({
        title: "<b>Reclamation : {Reclamation wgs}</b>",
        content: "<p> Objet : {Objet} </p>" + "<p> Message : {Message}  </p> " + "<p> Démarche : {Demarche_d} </p>" + "<p> Mail : {Mail}  </p> "
    });
    const reclamation = new FeatureLayer({
        url: "https://services5.arcgis.com/TbprQ2JL7Oe3pK0F/arcgis/rest/services/Projet_Elaboration_d’un_Géoportail/FeatureServer/3",
        outFields: ["Objet", "Message", "Demarche_d", "Mail"],
        popupTemplate: popupReclamation
    });
    map.add(reclamation);

    // Widgets
    const basemapToggle = new BasemapToggle({
        view: view,
        nextBasemap: "arcgis-imagery"
    });
    view.ui.add(basemapToggle, "bottom-left");

    const searchWidget = new Search({
        view: view
    });
    view.ui.add(searchWidget, {
        position: "top-left",
        index: 2
    });

    // Création du bouton de recentrage
    const centerButton = document.createElement("button");
    centerButton.innerHTML = '<span class="esri-icon esri-icon-home"></span>';
    centerButton.title = "Recentrer la carte";
    centerButton.className = "esri-widget esri-widget--button esri-interactive";
    centerButton.style.marginTop = "10px"; // Espacement depuis la barre de recherche

    // Gestion du clic
    centerButton.addEventListener("click", function () {
        view.goTo({
            center: [-7.62, 33.59], // Coordonnées de Casablanca
            zoom: 13
        });
    });

    // Ajout au UI
    view.ui.add(centerButton, {
        position: "top-left",
        index: 3
    });

    // Légende
    const legend = new Legend({
        view: view,
        layerInfos: [
            { layer: communes, title: "Communes" },
            { layer: voirie, title: "Voirie" },
            { layer: casaPop, title: "Population" },
            { layer: grandeSurface, title: "Grandes Surfaces" },
            { layer: hotels, title: "Hôtels" },
            { layer: reclamation, title: "Réclamations" }
        ]
    });
    const legendExpand = new Expand({
        view: view,
        content: legend,
        expandIconClass: "esri-icon-layer-list",
        expandTooltip: "Afficher la légende"
    });
    view.ui.add(legendExpand, "bottom-right");

    // Gestion des filtres
    document.getElementById("toggleFilters").addEventListener("click", function () {
        const panel = document.getElementById("filtersPanel");
        panel.classList.toggle("visible");
        this.textContent = panel.classList.contains("visible") ? "× Fermer" : "☰ Filtres";
    });

    document.getElementById("resetFilters").addEventListener("click", function () {
        document.getElementById("filterSelect").value = "";
        document.getElementById("hotelFilter").value = "";
        document.getElementById("surfaceFilter").value = "";
        document.getElementById("populationFilter").value = "";

        communes.definitionExpression = "";
        hotels.definitionExpression = "";
        grandeSurface.definitionExpression = "";
        casaPop.definitionExpression = "";

        view.goTo({
            center: [-7.62, 33.59],
            zoom: 11
        });
    });

    // Filtres
    document.getElementById("filterSelect").addEventListener("change", function (event) {
        communes.definitionExpression = event.target.value;
    });

    document.getElementById("hotelFilter").addEventListener("change", function (event) {
        hotels.definitionExpression = event.target.value;
    });

    document.getElementById("surfaceFilter").addEventListener("change", function (event) {
        grandeSurface.definitionExpression = event.target.value;
    });

    document.getElementById("populationFilter").addEventListener("change", function (event) {
        casaPop.definitionExpression = event.target.value;
    });

    // Outil d'édition pour les réclamations
    let sketchViewModel = new SketchViewModel({
        view: view,
        layer: reclamation,
        pointSymbol: {
            type: "simple-marker",
            color: [255, 0, 0],
            outline: {
                color: [255, 255, 255],
                width: 2
            }
        }
    });

    // Activer le mode création de point au clic sur "Ajouter Réclamation"
    document.getElementById("addReclamation").addEventListener("click", function () {
        const objet = document.getElementById("Objet").value;
        const message = document.getElementById("Message").value;
        const mail = document.getElementById("Mail").value;

        if (!objet || !message || !mail) {
            alert("Veuillez remplir tous les champs avant de placer la réclamation sur la carte.");
            return;
        }

        // Activer le mode création de point
        sketchViewModel.create("point");

        // Afficher un message d'instruction
        view.popup.open({
            title: "Ajout de réclamation",
            content: "Cliquez sur la carte pour placer l'emplacement de votre réclamation",
            location: view.center
        });
    });

    // Lorsque l'utilisateur a fini de dessiner (place un point)
    sketchViewModel.on("create", async function (event) {
        if (event.state === "complete") {
            const objet = document.getElementById("Objet").value;
            const message = document.getElementById("Message").value;
            const mail = document.getElementById("Mail").value;

            // Créer un graphic avec les attributs de la réclamation
            const newReclamation = new Graphic({
                geometry: event.graphic.geometry,
                attributes: {
                    Objet: objet,
                    Message: message,
                    Demarche_d: "Nouveau",
                    Mail: mail
                }
            });

            try {
                const result = await reclamation.applyEdits({
                    addFeatures: [newReclamation]
                });

                if (result.addFeatureResults && result.addFeatureResults[0].success) {
                    alert("Réclamation ajoutée avec succès !");
                    // Réinitialiser le formulaire
                    document.getElementById("Objet").value = "";
                    document.getElementById("Message").value = "";
                    document.getElementById("Mail").value = "";

                    // Fermer le popup d'instruction
                    view.popup.close();
                } else {
                    throw new Error("Échec de l'ajout : " + JSON.stringify(result));
                }
            } catch (error) {
                console.error("Erreur détaillée:", error);
                alert(`Erreur lors de l'ajout : ${error.message}`);
            }
        }
    });

    // Annuler la réclamation
    document.getElementById("cancelReclamation").addEventListener("click", function () {
        document.getElementById("Objet").value = "";
        document.getElementById("Message").value = "";
        document.getElementById("Mail").value = "";

        // Annuler le mode création si actif
        sketchViewModel.cancel();
        view.popup.close();
    });

    // Annuler le mode création si l'utilisateur clique ailleurs
    view.on("click", function (event) {
        if (sketchViewModel.state === "active") {
            sketchViewModel.cancel();
            view.popup.close();
        }
    });
});




